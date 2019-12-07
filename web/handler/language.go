package handler

import (
	"github.com/XDean/playground/play"
	"github.com/labstack/echo/v4"
	"net/http"
)

func ShowLanguages(c echo.Context) error {
	type Response struct {
		Name       string   `json:"name"`
		Ext        []string `json:"ext"`
		HelloWorld string   `json:"hello-world"`
	}
	languages := play.GetAllLanguages()
	res := make([]Response, 0)
	for _, v := range languages {
		res = append(res, Response{
			Name:       v.Name(),
			Ext:        v.Ext(),
			HelloWorld: v.Data(play.HelloWorld).(string),
		})
	}
	return c.JSON(http.StatusOK, res)
}
