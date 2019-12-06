package web

import (
	"github.com/XDean/playground/config"
	"github.com/XDean/playground/web/handler"
	"github.com/labstack/echo/v4"
	"net/http"
	"path/filepath"
)

func initRouter(e *echo.Echo) {
	apiGroup := e.Group("/api")
	apiGroup.GET("/languages", handler.ShowLanguages)
	apiGroup.POST("/play", handler.Play)

	socketGroup := e.Group("/socket")
	socketGroup.GET("/play", handler.SocketPlay)

	e.GET("/", func(c echo.Context) error {
		return c.Redirect(http.StatusFound, "/index")
	})
	e.GET("/index", func(c echo.Context) error {
		return c.File(filepath.Join(config.Inst.Path.Static(), "index.html"))
	})
	e.Static("/static", config.Inst.Path.Static())
}
