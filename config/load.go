package config

import (
	"github.com/xdean/goex/xconfig"
	"github.com/xdean/goex/xgo"
	"gopkg.in/yaml.v2"
	"io/ioutil"
)

func (c *Config) Load(path string) error {
	content, err := ioutil.ReadFile(path)
	if err != nil {
		return err
	}
	err = yaml.Unmarshal(content, c)
	if err == nil {
		err = xconfig.Decode(c, SecretKey)
	}
	return err
}

func (c *Config) ToYaml() string {
	out, err := yaml.Marshal(c)
	xgo.MustNoError(err)
	return string(out)
}
