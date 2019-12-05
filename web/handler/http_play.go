package handler

import (
	"encoding/json"
	"github.com/XDean/playground/play"
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
		Error bool
		Text  string
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
		return echo.NewHTTPError(http.StatusBadRequest, "Can't detect language")
	}
	result, err := lang.Run(param.Args, param.Content)
	if err != nil {
		return err
	}
	c.Response().Header().Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	c.Response().WriteHeader(http.StatusOK)
	for line := range result.Output {
		if err := json.NewEncoder(c.Response()).Encode(Response{
			Error: line.Error,
			Text:  line.Text,
		}); err != nil {
			return err
		}
		c.Response().Flush()
	}
	return nil
}
