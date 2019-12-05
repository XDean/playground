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

func SupportedLanguageExt() map[string][]string {
	result := make(map[string][]string)
	for _, v := range languages {
		result[v.Name()] = v.Ext()
	}
	return result
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
