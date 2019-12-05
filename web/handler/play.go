package handler

import (
	"github.com/XDean/playground/play"
	"github.com/julienschmidt/sse"
	"github.com/labstack/echo/v4"
	"github.com/xdean/goex/xecho"
	"net/http"
	"path/filepath"
)

type PlayParam struct {
	Type     string   `json:"type"`
	Language string   `json:"language"`
	Filename string   `json:"filename"`
	Args     []string `json:"args"`
	Content  string   `json:"content" validate:"required"`
}

type PlayResponse struct {
	IsError   bool
	IsCompile bool
	Text      string
}

func Play(c echo.Context) error {
	param := new(PlayParam)
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
	switch param.Type {
	case "sse":
		return ssePlay(c, result)
	default:
		return simplePlay(c, result)
	}
}

func simplePlay(c echo.Context, result play.Result) error {
	res := make([]play.Line, 0)
	for {
		select {
		case <-result.Done:
			return c.JSON(http.StatusOK, res)
		case line := <-result.Output:
			res = append(res, line)
		}
	}
}

func ssePlay(c echo.Context, result play.Result) error {
	streamer := sse.New()
	go streamer.ServeHTTP(c.Response(), c.Request())
	for {
		select {
		case <-result.Done:
			return nil
		case line := <-result.Output:
			if err := streamer.SendJSON("", "", PlayResponse{
				IsError:   line.IsError,
				IsCompile: line.IsCompile,
				Text:      line.Text,
			}); err != nil {
				return err
			}
		}
	}
}
