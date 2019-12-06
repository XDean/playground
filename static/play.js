document.addEventListener('DOMContentLoaded', function () {
  initCodeArea();
  initLanguage();
}, false);

let codeMirror;
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
        let languageCombo = document.getElementById("language-select");
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