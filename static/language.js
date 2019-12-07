class Lang {
    constructor(name /*string*/, ext /*[]string*/, helloworld /*string*/) {
        this.name = name;
        this.ext = ext;
        this.helloworld = helloworld;
    }
}

let languages = []; /*[]Lang*/

function initLanguage(server = "", onSuccess = function (langs) {
    console.debug("Load language success: " + langs)
}, onFail = function (err) {
    console.log(err);
}) {
    languages = [];
    fetch(server + "api/languages")
        .then(res => {
            res.text().then(body => {
                let langs = JSON.parse(body);
                langs.forEach(e => {
                    languages.push(new Lang(e.name, e.ext, e["hello-world"]))
                });
                onSuccess(languages)
            })
        })
        .catch(err => {
            onFail(err)
        })
}

let Language = {
    values: function () {
        return languages;
    },
    init: initLanguage,
};