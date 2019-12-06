package web

import (
	"github.com/XDean/playground/web/handler"
	"github.com/labstack/echo/v4"
)

func initRouter(e *echo.Echo) {
	apiGroup := e.Group("/api")
	apiGroup.GET("/languages", handler.ShowLanguages)
	apiGroup.POST("/play", handler.Play)

	socketGroup := e.Group("/socket")
	socketGroup.GET("/play", handler.SocketPlay)
}
