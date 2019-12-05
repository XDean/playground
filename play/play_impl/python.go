package play_impl

import (
	"github.com/XDean/playground/play"
)

func init() {
	play.Register(python{})
}

type python struct {
}

func (p python) Name() string {
	return "Python"
}

func (p python) Ext() []string {
	return []string{".py"}
}

func (p python) Run(args []string, code string) (res play.Result, err error) {
	tf, err := tempFile(code, ".py")
	if err != nil {
		return
	}
	return runDirect(tf, args, "python")
}
