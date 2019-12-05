package play

type (
	Language interface {
		Name() string
		Ext() []string
		Run(args []string, code string) (Result, error)
	}

	Result struct {
		Output <-chan Line
		Done   <-chan error
		Kill   chan<- bool
	}

	Line struct {
		IsError bool
		Text    string
	}
)
