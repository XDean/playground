package play_impl

import (
	"github.com/XDean/playground/play"
	"os/exec"
	"path/filepath"
)

func init() {
	play.Register(java{})
}

type java struct {
}

func (j java) Name() string {
	return "java"
}

func (j java) Ext() []string {
	return []string{".java"}
}

func (j java) Run(args []string, code string) (res play.Result, err error) {
	sf, err := tempFileWithName(code, "Main.java")
	if err != nil {
		return
	}
	tf := filepath.Join(sf, "../Main.class")

	outputChan := make(chan play.Line, 5)
	doneChan := make(chan bool)
	killChan := make(chan bool)
	res = play.Result{
		Output: outputChan,
		Done:   doneChan,
		Kill:   killChan,
	}

	go func() {
		defer func() {
			doneChan <- true
			close(doneChan)
		}()

		sdir, sfile := filepath.Split(sf)
		compileCmd := exec.Command("javac", sfile)
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

		tdir, _ := filepath.Split(tf)
		runCmd := exec.Command("java", append(args, "Main")...)
		runCmd.Dir = tdir
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

		go func() {
			if <-killChan {
				if err := runCmd.Process.Kill(); err != nil {
					outputChan <- play.Line{
						IsCompile: false,
						IsError:   true,
						Text:      "Fail to kill: " + err.Error(),
					}
				}
			}
		}()
	}()
	return
}
