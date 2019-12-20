package play

type (
	Languages []Language
	Language  interface {
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
		Order   int    `json:"-"`
	}
)

func (l Languages) Len() int {
	return len(l)
}

func (l Languages) Less(i, j int) bool {
	return l[i].Name() < l[j].Name()
}

func (l Languages) Swap(i, j int) {
	l[i], l[j] = l[j], l[i]
}

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
	if t[i].Order == t[j].Order {
		return t[i].Name < t[j].Name
	} else {
		return t[i].Order < t[j].Order
	}
}

func (t Templates) Swap(i, j int) {
	t[i], t[j] = t[j], t[i]
}
