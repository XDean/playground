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
    Language.init("", function (langs) {
        langs.forEach(e => {
            let option = document.createElement("option");
            option.setAttribute("value", e.name);
            option.innerText = e.name;
            option.language = e;
            option.language.mime = codeTypeMap[e.name]
            languageCombo.appendChild(option);
        });
        onLanguageChange(languageCombo);
    });
}

let oldLanguage = null;

function onLanguageChange(combo) {
    let option = combo.selectedOptions[0];
    codeMirror.setOption("mode", option.language.mime || option.language.name);
    let text = codeMirror.getValue();
    if (text === "" || (oldLanguage && oldLanguage.helloworld === text)) {
        codeMirror.setValue(option.language.helloworld)
    }
    oldLanguage = option.language;
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