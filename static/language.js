class Lang {
    constructor(name /*string*/, ext /*[]string*/, templates /*map[string]string*/) {
        this.name = name;
        this.ext = ext;
        this.templates = templates;
    }
}

let languages = []; /*[]Lang*/

function initLanguage(server = "", onSuccess = function (langs) {
    console.debug("Load language success: " + langs)
}, onFail = function (err) {
    console.log(err);
}) {
    languages = [];
    fetch(server + "api/languages?details=true")
        .then(res => {
            res.text().then(body => {
                let langs = JSON.parse(body);
                langs.forEach(e => {
                    languages.push(new Lang(e.name, e.ext, e.templates))
                });
                onSuccess(languages)
            })
        })
        .catch(err => {
            onFail(err)
        })
}

function fetchLanguageTemplates() {

}

let Language = {
    values: function () {
        return languages;
    },
    init: initLanguage,
};