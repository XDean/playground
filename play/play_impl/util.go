package play_impl

import (
	"bytes"
	"github.com/XDean/playground/config"
	"github.com/XDean/playground/play"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strconv"
	"unicode/utf8"
)

var uniq = make(chan int) // a source of numbers for naming temporary files

type (
	writer struct {
		isError bool
		output  chan play.Line
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

func stdout(stream chan play.Line) io.Writer {
	return &writer{
		isError: false,
		output:  stream,
	}
}

func stderr(stream chan play.Line) io.Writer {
	return &writer{
		isError: true,
		output:  stream,
	}
}

func (w *writer) Write(b []byte) (n int, err error) {
	w.output <- play.Line{IsError: w.isError, Text: safeString(b)}
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
