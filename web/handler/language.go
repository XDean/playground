package handler

import (
	"github.com/XDean/playground/play"
	"github.com/labstack/echo/v4"
	"github.com/xdean/goex/xecho"
	"net/http"
	"sort"
	"strconv"
)

func ShowLanguages(c echo.Context) error {
	type Response struct {
		Name      string      `json:"name"`
		Ext       []string    `json:"ext"`
		Templates interface{} `json:"templates"`
	}
	details, _ := strconv.ParseBool(c.QueryParam("details"))

	languages := play.GetAllLanguages()
	sort.Sort(languages)
	res := make([]Response, 0)
	for _, v := range languages {
		var templates interface{}
		if details {
			ts := v.Template()
			sort.Sort(ts)
			templates = ts
		} else {
			templates = getTemplateNames(v)
		}
		res = append(res, Response{
			Name:      v.Name(),
			Ext:       v.Ext(),
			Templates: templates,
		})
	}
	return c.JSON(http.StatusOK, res)
}

func GetTemplate(c echo.Context) error {
	type Param struct {
		Language string `json:"language" query:"language" validate:"required"`
		Template string `json:"template" query:"template" validate:"required"`
	}
	param := new(Param)
	xecho.MustBindAndValidate(c, param)

	lang := play.FindLanguageByName(param.Language)
	if lang == nil {
		return c.JSON(http.StatusBadRequest, xecho.J{
			"message":   "Can't detect language. You can refer supported languages.",
			"supported": play.GetAllLanguageNames(),
		})
	}
	if content, ok := lang.Template().Find(param.Template); ok {
		return c.JSON(http.StatusOK, xecho.J{
			"language": param.Language,
			"name":     param.Template,
			"content":  content,
		})
	} else {
		return c.JSON(http.StatusBadRequest, xecho.J{
			"message":   "No such template. You can refer supported templates",
			"supported": getTemplateNames(lang),
		})
	}
}

func getTemplateNames(v play.Language) []string {
	temps := make([]string, 0)
	for _, v := range v.Template() {
		temps = append(temps, v.Name)
	}
	return temps
}
