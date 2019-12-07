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

func (g golang) Name() string {
	return "go"
}

func (g golang) Ext() []string {
	return []string{".go"}
}

func (g golang) Data(key play.LanguageDataKey) interface{} {
	switch key {
	case play.HelloWorld:
		return `package main

import "fmt"

func main() {
	fmt.Println("Hello World Go")
}`
	default:
		return nil
	}
}

func (g golang) Run(args []string, code string) (res play.Result, err error) {
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
		cmdChan := make(chan *exec.Cmd)

		defer func() {
			cmdChan <- nil
			doneChan <- true
			close(cmdChan)
			close(doneChan)
			close(outputChan)
		}()

		go func() {
			var runningCmd *exec.Cmd
			for {
				select {
				case <-killChan:
					if runningCmd != nil {
						if err := runningCmd.Process.Kill(); err != nil {
							outputChan <- play.Line{
								IsCompile: false,
								IsError:   true,
								Text:      "Fail to kill: " + err.Error(),
							}
						}
					}
				case runningCmd = <-cmdChan:
					if runningCmd == nil {
						return
					}
				}
			}
		}()

		sdir, sfile := filepath.Split(sf)
		compileCmd := exec.Command("go", "build", sfile)
		compileCmd.Dir = sdir
		compileCmd.Stdout = stdout(outputChan, true)
		compileCmd.Stderr = stderr(outputChan, true)
		cmdChan <- compileCmd
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
		cmdChan <- runCmd
		if err = runCmd.Run(); err != nil {
			outputChan <- play.Line{
				IsCompile: false,
				IsError:   true,
				Text:      err.Error(),
			}
			return
		}
	}()
	return
}
