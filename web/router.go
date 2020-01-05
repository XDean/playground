package web

import (
	"github.com/XDean/playground/config"
	"github.com/XDean/playground/web/handler"
	"github.com/labstack/echo/v4"
	"path/filepath"
)

func initRouter(e *echo.Echo) {
	apiGroup := e.Group("/api")
	apiGroup.GET("/languages", handler.ShowLanguages)
	apiGroup.POST("/play", handler.Play)
	apiGroup.GET("/template", handler.GetTemplate)

	socketGroup := e.Group("/socket")
	socketGroup.GET("/play", handler.SocketPlay)

	e.GET("/", func(c echo.Context) error {
		return c.File(filepath.Join(config.Inst.Path.Static(), "index.html"))
	})
	e.Static("/", config.Inst.Path.Static())
}
