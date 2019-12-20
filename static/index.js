document.addEventListener('DOMContentLoaded', function () {
    languageCombo = document.getElementById("language-select");
    templateCombo = document.getElementById("template-select");
    outputArea = document.getElementById("output");
    outputText = document.getElementById("output-content");
    runButton = document.getElementById("run-button");
    killButton = document.getElementById("kill-button");
    socketButton = document.getElementById("socket-button");

    customTemplate = document.createElement("option");
    customTemplate.setAttribute("value", "Custom");
    customTemplate.innerText = "Custom";

    initState();
    initCodeArea();
    initLanguage();
}, false);

const serverUrl = document.location.href + "/../";

let languageCombo;
let templateCombo;
let customTemplate;
let codeMirror;
let outputArea;
let outputText;
let runButton;
let killButton;
let socketButton;

let currentLanguage;
let currentTemplate;
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
    codeMirror.on("change", function () {
        if (!currentLanguage || currentLanguage.templates[currentTemplate] === codeMirror.getValue()) {
            return;
        }
        currentTemplate = "Custom";
        templateCombo.value = "Custom";
        customTemplate.templateContent = codeMirror.getValue();
    })
}

function initLanguage() {
    Language.init(serverUrl, function (langs) {
        langs.forEach(e => {
            let option = document.createElement("option");
            option.setAttribute("value", e.name);
            option.innerText = e.name;
            option.language = e;
            option.language.mime = codeTypeMap[e.name];
            languageCombo.appendChild(option);
        });
        onLanguageChange(languageCombo);
    });
}

function updateTemplateOptions(language) {
    templateCombo.innerHTML = "";

    templateCombo.appendChild(customTemplate);

    Object.entries(language.templates).forEach(e => {
        let option = document.createElement("option");
        option.setAttribute("value", e[0]);
        option.innerText = e[0];
        option.templateContent = e[1];
        templateCombo.appendChild(option);
    });
}

function onLanguageChange() {
    let option = languageCombo.selectedOptions[0];
    let oldLanguage = currentLanguage;
    currentLanguage = option.language;
    updateTemplateOptions(option.language);
    codeMirror.setOption("mode", option.language.mime || option.language.name);

    let text = codeMirror.getValue();
    if (text === "" || (oldLanguage && oldLanguage.templates[currentTemplate] === text)) {
        let templateName = Object.keys(option.language.templates)[0];
        if (templateName) {
            codeMirror.setValue(option.language.templates[templateName]);
            currentTemplate = templateName;
            templateCombo.value = currentTemplate;
        }
    }
}

function onTemplateChange() {
    let option = templateCombo.selectedOptions[0];
    currentTemplate = option.value;
    codeMirror.setValue(option.templateContent);
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