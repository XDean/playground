package handler

import (
	"github.com/XDean/playground/play"
	"github.com/labstack/echo/v4"
	"net/http"
)

func ShowLanguages(c echo.Context) error {
	return c.JSON(http.StatusOK, play.SupportedLanguageExt())
}
