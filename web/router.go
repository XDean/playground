package web

import (
	"github.com/XDean/playground/web/handler"
	"github.com/labstack/echo/v4"
)

func initRouter(e *echo.Echo) {
	e.Any("/play", handler.Play)
}
