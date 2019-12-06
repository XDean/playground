package play_impl

import (
	"github.com/XDean/playground/play"
	"os/exec"
	"path/filepath"
)

func init() {
	play.Register(golang{})
}

type golang struct {
}

func (j golang) Name() string {
	return "go"
}

func (j golang) Ext() []string {
	return []string{".go"}
}

func (j golang) Run(args []string, code string) (res play.Result, err error) {
	sf, err := tempFileWithName(code, "main.go")
	if err != nil {
		return
	}

	outputChan := make(chan play.Line, 5)
	doneChan := make(chan bool)
	killChan := make(chan bool)
	res = play.Result{
		Output: outputChan,
		Done:   doneChan,
		Kill:   killChan,
	}

	go func() {
		defer close(doneChan)

		sdir, sfile := filepath.Split(sf)
		compileCmd := exec.Command("go", "build", sfile)
		compileCmd.Dir = sdir
		compileCmd.Stdout = stdout(outputChan, true)
		compileCmd.Stderr = stderr(outputChan, true)
		if err = compileCmd.Run(); err != nil {
			outputChan <- play.Line{
				IsCompile: true,
				IsError:   true,
				Text:      err.Error(),
			}
			return
		}

		runCmd := exec.Command("./main", args...)
		runCmd.Dir = sdir
		runCmd.Stdout = stdout(outputChan, false)
		runCmd.Stderr = stderr(outputChan, false)
		if err = runCmd.Run(); err != nil {
			outputChan <- play.Line{
				IsCompile: false,
				IsError:   true,
				Text:      err.Error(),
			}
			return
		}
		doneChan <- true

		go func() {
			if <-killChan {
				if err := runCmd.Process.Kill(); err != nil {
					outputChan <- play.Line{
						IsCompile: false,
						IsError:   true,
						Text:      "Fail to kill: " + err.Error(),
					}
				}
				doneChan <- true
			}
		}()
	}()
	return
}
