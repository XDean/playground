package config

import (
	"github.com/xdean/goex/xconfig"
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

func (c *Config) ToYaml() (string, error) {
	out, err := yaml.Marshal(c)
	return string(out), err
}
