package play_impl

import (
	"github.com/XDean/playground/play"
	"os/exec"
	"path/filepath"
)

func init() {
	play.Register(python{})
}

type python struct {
}

func (P python) Name() string {
	return "Python"
}

func (P python) Ext() []string {
	return []string{".py"}
}

func (P python) Run(args []string, code string) (res play.Result, err error) {
	tf, err := tempFile(code, ".py")
	if err != nil {
		return
	}
	dir, file := filepath.Split(tf)

	outputChan := make(chan play.Line, 5)
	doneChan := make(chan error)
	killChan := make(chan bool)
	res = play.Result{
		Output: outputChan,
		Done:   doneChan,
		Kill:   killChan,
	}

	cmd := exec.Command("python", append(args, file)...)
	cmd.Dir = dir
	cmd.Stdout = stdout(outputChan)
	cmd.Stderr = stderr(outputChan)
	if err = cmd.Start(); err != nil {
		return
	}
	go func() {
		defer close(killChan)
		defer close(doneChan)
		doneChan <- cmd.Wait()
	}()
	go func() {
		if <-killChan {
			doneChan <- cmd.Process.Kill()
		}
	}()
	return
}
