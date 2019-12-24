package web

import (
	"github.com/XDean/playground/config"
	"github.com/XDean/playground/log"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/xdean/goex/xecho"
	"net/http"
)

func Run() {
	e := echo.New()

	e.HTTPErrorHandler = errorHandler
	e.Validator = xecho.NewValidator()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(xecho.BreakErrorRecover())
	e.Use(middleware.CORS())

	initRouter(e)

	log.Logger.Fatal(e.Start(config.Inst.Server.HttpAddr()))
}

func errorHandler(err error, c echo.Context) {
	code := http.StatusInternalServerError
	var msg xecho.J

	if he, ok := err.(*echo.HTTPError); ok {
		code = he.Code
		if he.Internal == nil {
			msg = xecho.J{
				"message": he.Message,
			}
		} else {
			msg = xecho.J{
				"message": he.Message,
				"cause":   he.Internal.Error(),
			}
		}
	} else {
		msg = xecho.J{
			"message": http.StatusText(code),
			"cause":   err.Error(),
		}
	}

	if !c.Response().Committed {
		if c.Request().Method == http.MethodHead {
			err = c.NoContent(code)
		} else {
			err = c.JSON(code, msg)
		}
		if err != nil {
			log.Logger.Error(err)
		}
	}
}
