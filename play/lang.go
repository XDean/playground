package play

type (
	Language interface {
		Name() string
		Ext() []string
		Run(args []string, code string) (PlayResult, error)
	}

	PlayResult struct {
		Stdout <-chan string
		Stderr <-chan string
		Done   <-chan bool
	}
)
