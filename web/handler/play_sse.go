package handler

import (
	"github.com/XDean/playground/play"
	"github.com/julienschmidt/sse"
	"github.com/labstack/echo/v4"
	"github.com/xdean/goex/xecho"
	"net/http"
	"path/filepath"
)

func Play(c echo.Context) error {
	type Param struct {
		Language string   `json:"language"`
		Filename string   `json:"filename"`
		Args     []string `json:"args"`
		Content  string   `json:"content" validate:"required"`
	}
	type Response struct {
		IsError   bool
		IsCompile bool
		Text      string
	}
	param := new(Param)
	xecho.MustBindAndValidate(c, param)

	var lang play.Language
	if param.Language != "" {
		lang = play.FindLanguageByName(param.Language)
	} else if param.Filename != "" {
		lang = play.FindLanguageByExt(filepath.Ext(param.Filename))
	} else {
		return echo.NewHTTPError(http.StatusBadRequest, "Both language and filename are not specified")
	}
	if lang == nil {
		return c.JSON(http.StatusBadRequest, xecho.J{
			"message":   "Can't detect language. You can follow supported languages.",
			"supported": play.SupportedLanguageExt(),
		})
	}
	result, err := lang.Run(param.Args, param.Content)
	if err != nil {
		return err
	}
	streamer := sse.New()
	go streamer.ServeHTTP(c.Response(), c.Request())
	for {
		select {
		case <-result.Done:
			return nil
		case line := <-result.Output:
			if err := streamer.SendJSON("", "", Response{
				IsError:   line.IsError,
				IsCompile: line.IsCompile,
				Text:      line.Text,
			}); err != nil {
				return err
			}
		}
	}
}
