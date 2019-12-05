package play

import "github.com/XDean/playground/log"

var languages = make(map[string]Language)

func Register(language Language) {
	name := language.Name()
	if _, ok := languages[name]; ok {
		log.Logger.Fatal("Duplicate Language Register: " + name)
	} else {
		languages[name] = language
	}
}

func FindLanguageByName(name string) Language {
	return languages[name]
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
