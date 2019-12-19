package main

import (
	"errors"
	"fmt"
	"github.com/XDean/playground/config"
	"github.com/XDean/playground/web"
	"github.com/sirupsen/logrus"
	"github.com/urfave/cli"
	"log"
	"os"
)

func main() {
	app := cli.NewApp()

	app.Name = "XDean's Code Playground"

	app.Flags = []cli.Flag{
		cli.StringFlag{
			Name:        "setting,s",
			Usage:       "Setting file path",
			Destination: &config.ConfigFile,
		},
		cli.StringFlag{
			Name:        "key,k",
			Usage:       "Secret key",
			Destination: &config.SecretKey,
		},
		cli.BoolFlag{
			Name:        "debug,d",
			Usage:       "Debug mode",
			Destination: &config.Debug,
		},
	}

	app.Action = func(c *cli.Context) error {
		if config.ConfigFile == "" {
			return errors.New("Please specify setting file")
		}
		err := config.Inst.Load(config.ConfigFile)
		if err != nil {
			return err
		}
		if config.Debug {
			logrus.SetLevel(logrus.DebugLevel)
		}
		fmt.Println("Config", config.Inst.ToYaml())
		web.Run()
		return nil
	}
	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
