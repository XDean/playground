package play

const (
	HelloWorld LanguageDataKey = "HelloWorld" // string
)

type (
	LanguageDataKey string

	Language interface {
		Name() string
		Ext() []string
		Data(key LanguageDataKey) interface{}
		Run(args []string, code string) (Result, error)
	}

	Result struct {
		Output <-chan Line
		Done   <-chan bool
		Kill   chan<- bool
	}

	Line struct {
		IsError   bool
		IsCompile bool
		Text      string
	}
)
