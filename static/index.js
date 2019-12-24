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
    customTemplate.template = {};
    initState();
    initCodeArea();
    initLanguage();
}, false);
var serverUrl = document.location.href + "/../";
var languageCombo;
var templateCombo;
var customTemplate;
var codeMirror;
var outputArea;
var outputText;
var runButton;
var killButton;
var socketButton;
var currentLanguage;
var currentTemplate;
var currentRunKiller;
var useSocket = true;
var codeTypeMap = {
    "java": "text/x-java"
};
function initState() {
    runButton.disabled = false;
    killButton.disabled = true;
    socketButton.checked = useSocket;
}
function initCodeArea() {
    var area = document.getElementById("code-area");
    codeMirror = CodeMirror.fromTextArea(area, {
        lineNumbers: true
    });
    codeMirror.on("change", function () {
        if (!currentLanguage || currentTemplate.content === codeMirror.getValue()) {
            return;
        }
        currentTemplate = "Custom";
        templateCombo.value = "Custom";
        customTemplate.template.content = codeMirror.getValue();
    });
}
function initLanguage() {
    Language.init(serverUrl, function (langs) {
        langs.forEach(function (e) {
            var option = document.createElement("option");
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
    language.templates.forEach(function (e) {
        var option = document.createElement("option");
        option.setAttribute("value", e.name);
        option.innerText = e.name;
        option.template = e;
        templateCombo.appendChild(option);
    });
}
function onLanguageChange() {
    var option = languageCombo.selectedOptions[0];
    var oldLanguage = currentLanguage;
    currentLanguage = option.language;
    updateTemplateOptions(option.language);
    codeMirror.setOption("mode", option.language.mime || option.language.name);
    var text = codeMirror.getValue();
    if (text === "" || (oldLanguage && currentTemplate.content === text)) {
        var newTemplate = option.language.templates[0];
        if (newTemplate) {
            currentTemplate = newTemplate;
            codeMirror.setValue(newTemplate.content);
            templateCombo.value = currentTemplate.name;
        }
    }
}
function onTemplateChange() {
    var option = templateCombo.selectedOptions[0];
    currentTemplate = option.template;
    codeMirror.setValue(option.template.content);
}
function run() {
    outputArea.style.display = "block";
    outputText.innerText = "";
    runButton.disabled = true;
    killButton.disabled = false;
    currentRunKiller = (useSocket ? socketPlay : httpPlay)(serverUrl, new PlayRequest(languageCombo.value, null, null, codeMirror.getValue()), function (e) {
        var line = document.createElement("span");
        if (e.isSystem) {
            if (e.isError) {
                line.classList.add("output-error");
            }
            else {
                line.classList.add("output-system");
            }
        }
        else {
            if (e.isError) {
                line.classList.add("output-stderr");
            }
            else {
                line.classList.add("output-stdout");
            }
            if (e.isCompile) {
                line.classList.add("output-compile");
            }
        }
        line.innerText = e.text;
        outputText.appendChild(line);
    }, function () {
        currentRunKiller = null;
        killButton.disabled = true;
        runButton.disabled = false;
    }, null);
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
