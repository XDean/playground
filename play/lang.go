package play

type (
	Language interface {
		Name() string
		Ext() []string
		Run(args []string, code string) (PlayResult, error)
	}

	PlayResult struct {
		Output <-chan PlayLine
		Done   <-chan bool
	}

	PlayLine struct {
		Error bool
		Text  string
	}
)
