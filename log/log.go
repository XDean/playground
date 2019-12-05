package log

import (
	"github.com/sirupsen/logrus"
)

var Logger = logrus.StandardLogger()

func init() {
	Logger.SetFormatter(&logrus.TextFormatter{})
}
