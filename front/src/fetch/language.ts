import {Language} from "../model/language";

export function fetchLanguages(server: string, onSuccess: (a: Language[]) => void, onFail: (err: string) => void) {
    fetch(server + "api/languages?details=true")
        .then(res => {
            res.text().then(body => {
                let languages: Language[] = JSON.parse(body);
                onSuccess(languages)
            })
        })
        .catch(err => {
            onFail(err)
        })
}