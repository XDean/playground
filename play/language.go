package play

type (
	Language interface {
		Name() string
		Ext() []string
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
