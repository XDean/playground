package play_impl

import (
	"github.com/XDean/playground/config"
	"github.com/XDean/playground/log"
	"github.com/XDean/playground/play"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"path/filepath"
)

type templateConfig struct {
	Name string
}

var templateStore = make(map[string]play.Templates, 0)

func getTemplates(lang play.Language) play.Templates {
	if res, ok := templateStore[lang.Name()]; ok {
		return res
	} else {
		templates, err := readTemplates(lang)
		if err != nil {
			log.Logger.WithError(err).Error("Fail to read template")
			return play.Templates{}
		} else {
			templateStore[lang.Name()] = templates
			return templates
		}
	}
}

func readTemplates(lang play.Language) (play.Templates, error) {
	templateFolder := filepath.Join(config.Inst.Path.Resources(), "template", lang.Name())
	files, err := ioutil.ReadDir(templateFolder)
	if err != nil {
		return nil, err
	}
	result := make(play.Templates, 0)
	for _, f := range files {
		file := f.Name()
		ext := filepath.Ext(file)
		if f.IsDir() || !isLanguage(lang, ext) {
			continue
		}
		content, err := ioutil.ReadFile(filepath.Join(templateFolder, file))
		if err != nil {
			return nil, err
		}
		tmpl := play.Template{Name: file[:len(file)-len(ext)], Content: string(content)}
		configFile := filepath.Join(templateFolder, file+".yml")
		configContent, err := ioutil.ReadFile(configFile)
		if err == nil {
			c := new(templateConfig)
			err = yaml.Unmarshal(configContent, c)
			if err == nil {
				tmpl.Name = c.Name
			}
		}
		result = append(result, tmpl)
	}
	return result, nil
}

func isLanguage(lang play.Language, ext string) bool {
	for _, v := range lang.Ext() {
		if v == ext {
			return true
		}
	}
	return false
}
