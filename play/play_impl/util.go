package play_impl

import (
	"bytes"
	"github.com/XDean/playground/config"
	"github.com/XDean/playground/play"
	"io"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"unicode/utf8"
)

var uniq = make(chan int) // a source of numbers for naming temporary files

type (
	writer struct {
		isError   bool
		isCompile bool
		output    chan play.Line
	}
)

func init() {
	go func() {
		for i := 0; ; i++ {
			uniq <- i
		}
	}()
}

func tempFile(content string, ext string) (string, error) {
	tf := filepath.Join(config.Inst.Path.Temp(), "play", "temp"+strconv.Itoa(<-uniq)+ext)
	_ = os.Remove(tf)
	err := os.MkdirAll(filepath.Dir(tf), 0755)
	if err != nil {
		return "", err
	}
	if err := ioutil.WriteFile(tf, []byte(content), 0666); err != nil {
		return "", err
	}
	return tf, nil
}

func tempFileWithName(content string, name string) (string, error) {
	dir := filepath.Join(config.Inst.Path.Temp(), "play", "temp"+strconv.Itoa(<-uniq))
	_ = os.Remove(dir)
	err := os.MkdirAll(dir, 0755)
	if err != nil {
		return "", err
	}
	tf := filepath.Join(dir, name)
	if err := ioutil.WriteFile(tf, []byte(content), 0666); err != nil {
		return "", err
	}
	return tf, nil
}

func stdout(stream chan play.Line, isCompile bool) io.Writer {
	return &writer{
		isError:   false,
		isCompile: isCompile,
		output:    stream,
	}
}

func stderr(stream chan play.Line, isCompile bool) io.Writer {
	return &writer{
		isError:   true,
		isCompile: isCompile,
		output:    stream,
	}
}

func runDirect(codeFile string, args []string, bin string) (res play.Result, err error) {
	dir, file := filepath.Split(codeFile)

	outputChan := make(chan play.Line, 5)
	doneChan := make(chan bool)
	killChan := make(chan bool)
	res = play.Result{
		Output: outputChan,
		Done:   doneChan,
		Kill:   killChan,
	}

	cmd := exec.Command(bin, append(args, file)...)
	cmd.Dir = dir
	cmd.Stdout = stdout(outputChan, false)
	cmd.Stderr = stderr(outputChan, false)
	if err = cmd.Start(); err != nil {
		return
	}
	go func() {
		defer close(killChan)
		defer close(doneChan)
		if err := cmd.Wait(); err != nil {
			outputChan <- play.Line{
				IsCompile: false,
				IsError:   true,
				Text:      err.Error(),
			}
		}
		doneChan <- true
	}()
	go func() {
		if <-killChan {
			if err := cmd.Process.Kill(); err != nil {
				outputChan <- play.Line{
					IsCompile: false,
					IsError:   true,
					Text:      "Fail to kill: " + err.Error(),
				}
			}
			doneChan <- true
		}
	}()
	return
}

func (w *writer) Write(b []byte) (n int, err error) {
	w.output <- play.Line{
		IsError:   w.isError,
		IsCompile: w.isCompile,
		Text:      safeString(b),
	}
	return len(b), nil
}

func safeString(b []byte) string {
	if utf8.Valid(b) {
		return string(b)
	}
	var buf bytes.Buffer
	for len(b) > 0 {
		r, size := utf8.DecodeRune(b)
		b = b[size:]
		buf.WriteRune(r)
	}
	return buf.String()
}
