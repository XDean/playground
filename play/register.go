package play

import (
	"github.com/XDean/playground/log"
	"strings"
)

var languages = make(map[string]Language)

func Register(language Language) {
	name := strings.ToLower(language.Name())
	if _, ok := languages[name]; ok {
		log.Logger.Fatal("Duplicate Language Register: " + name)
	} else {
		languages[name] = language
	}
}

func GetAllLanguages() []Language {
	res := make([]Language, 0)
	for _, v := range languages {
		res = append(res, v)
	}
	return res
}

func GetAllLanguageNames() []string {
	res := make([]string, 0)
	for k, _ := range languages {
		res = append(res, k)
	}
	return res
}

func FindLanguageByName(name string) Language {
	return languages[strings.ToLower(name)]
}

func FindLanguageByExt(ext string) Language {
	for _, v := range languages {
		for _, e := range v.Ext() {
			if e == ext {
				return v
			}
		}
	}
	return nil
}
