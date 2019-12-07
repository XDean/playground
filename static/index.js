document.addEventListener('DOMContentLoaded', function () {
  languageCombo = document.getElementById("language-select");
  outputArea = document.getElementById("output");
  outputText = document.getElementById("output-content");
  initCodeArea();
  initLanguage();
}, false);

let languageCombo;
let codeMirror;
let outputArea;
let outputText;

let languages;
const codeTypeMap = {
  "java": "text/x-java",
};

function initCodeArea() {
  let area = document.getElementById("code-area");
  codeMirror = CodeMirror.fromTextArea(area, {
    lineNumbers: true,
  });
}

function initLanguage() {
  fetch("api/languages")
    .then(res => {
      res.text().then(body => {
        let langs = JSON.parse(body);
        Object.keys(langs).forEach(e => {
          let option = document.createElement("option");
          option.setAttribute("value", e);
          option.innerText = e;
          languageCombo.appendChild(option);
        });
        onLanguageChange(languageCombo);
      })
    })
    .catch(err => {
      console.log(err);
    })
}

function onLanguageChange(combo) {
  let lang = combo.value;
  let type = codeTypeMap[lang];
  codeMirror.setOption("mode", type || lang);
}

function run() {
  outputArea.style.display = "block";
  outputText.innerText = "";
  httpPlay(new PlayRequest(languageCombo.value, null, null, codeMirror.getValue()), e => {
    let line = document.createElement("span");
    switch (e.type) {
      case type_system:
        line.classList.add("output-system");
        break;
      case type_error:
        line.classList.add("output-error");
        break;
      case type_output:
        if (e.isError) {
          line.classList.add("output-stderr");
        } else {
          line.classList.add("output-stdout")
        }
        if (e.isCompile) {
          line.classList.add("output-compile");
        }
        break;
    }
    line.innerText = e.text;
    outputText.appendChild(line)
  }, null)
}

function closeOutput() {
  outputArea.style.display = "none";
}