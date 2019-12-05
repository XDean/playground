package config

import (
	"net"
	"path/filepath"
)

var (
	Debug     bool
	SecretKey string
)

type (
	Config struct {
		Server Server
		Path   Path
	}

	Server struct {
		Host string
		Port string
	}

	Path struct {
		Base    string // where to find static files
		Content string // where to store files
	}
)

func (p Server) HttpAddr() string {
	return net.JoinHostPort(p.Host, p.Port)
}

func (p Path) Resources() string {
	return filepath.Join(p.Base, "resources")
}

func (p Path) Static() string {
	return filepath.Join(p.Base, "static")
}
