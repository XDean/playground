package main

import "fmt"

func main() {
	resultStream := make(chan int)
	doneStream := make(chan struct{})

	go fib(resultStream, doneStream)

	for i := 0; i < 20; i++ {
		fmt.Println(<-resultStream)
	}
	close(doneStream)
}

func fib(c chan<- int, done <-chan struct{}) {
	a, b := 0, 1
	for {
		a, b = b, a+b
		select {
		case <-done:
			close(c)
			return
		case c <- a:
		}
	}
}
