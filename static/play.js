document.addEventListener('DOMContentLoaded', function () {
  initLanguage();
  let area = document.getElementById("code-area");
  let cmArea = CodeMirror.fromTextArea(area, {
    lineNumbers: true,
  });
}, false);

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
        })
      })
    })
    .catch(err => {
      console.log(err);
    })
}