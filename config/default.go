package config

var Default = Config{
	Server: Server{
		Host: "127.0.0.1",
		Port: "3999",
	},
	Path: Path{
		Base:    ".",
		Content: ".",
	},
}
