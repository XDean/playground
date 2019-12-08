document.addEventListener('DOMContentLoaded', function () {
    languageCombo = document.getElementById("language-select");
    outputArea = document.getElementById("output");
    outputText = document.getElementById("output-content");
    runButton = document.getElementById("run-button");
    killButton = document.getElementById("kill-button");
    socketButton = document.getElementById("socket-button");

    initState();
    initCodeArea();
    initLanguage();
}, false);

const serverUrl = document.location.href + "/../";

let languageCombo;
let codeMirror;
let outputArea;
let outputText;
let runButton;
let killButton;
let socketButton;

let currentLanguage;
let currentRunKiller;
let useSocket = true;

const codeTypeMap = {
    "java": "text/x-java",
};

function initState() {
    runButton.disabled = false;
    killButton.disabled = true;
    socketButton.checked = useSocket;
}

function initCodeArea() {
    let area = document.getElementById("code-area");
    codeMirror = CodeMirror.fromTextArea(area, {
        lineNumbers: true,
    });
}

function initLanguage() {
    Language.init(serverUrl, function (langs) {
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

function onLanguageChange(combo) {
    let option = combo.selectedOptions[0];
    codeMirror.setOption("mode", option.language.mime || option.language.name);
    let text = codeMirror.getValue();
    if (text === "" || (currentLanguage && currentLanguage.helloworld === text)) {
        codeMirror.setValue(option.language.helloworld)
    }
    currentLanguage = option.language;
}

function run() {
    outputArea.style.display = "block";
    outputText.innerText = "";
    runButton.disabled = true;
    killButton.disabled = false;
    currentRunKiller = (useSocket ? socketPlay : httpPlay)(serverUrl, new PlayRequest(languageCombo.value, null, null, codeMirror.getValue()), e => {
        let line = document.createElement("span");
        if (e.isSystem) {
            if (e.isError) {
                line.classList.add("output-error");
            } else {
                line.classList.add("output-system");
            }
        } else {
            if (e.isError) {
                line.classList.add("output-stderr");
            } else {
                line.classList.add("output-stdout")
            }
            if (e.isCompile) {
                line.classList.add("output-compile");
            }
        }
        line.innerText = e.text;
        outputText.appendChild(line)
    }, () => {
        currentRunKiller = null;
        killButton.disabled = true;
        runButton.disabled = false;
    }, null)
}

function kill() {
    if (currentRunKiller) {
        currentRunKiller();
        killButton.disabled = true;
        runButton.disabled = false;
    }
}

function closeOutput() {
    outputArea.style.display = "none";
}

function switchSocket() {
    useSocket = !useSocket;
}