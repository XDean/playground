package play

type (
	Language interface {
		Name() string
		Ext() []string
		Run(args []string, code string) (Result, error)
		Template() Templates
	}

	Result struct {
		Output <-chan Line
		Done   <-chan bool
		Kill   chan<- bool
	}

	Line struct {
		IsError   bool
		IsCompile bool
		Text      string
	}

	Templates []Template
	Template  struct {
		Name    string `json:"name"`
		Content string `json:"content"`
	}
)

func (t Templates) Find(name string) (Template, bool) {
	for _, v := range t {
		if v.Name == name {
			return v, true
		}
	}
	return Template{}, false
}

func (t Templates) Len() int {
	return len(t)
}

func (t Templates) Less(i, j int) bool {
	return t[i].Name < t[j].Name
}

func (t Templates) Swap(i, j int) {
	t[i], t[j] = t[j], t[i]
}
