import {Language} from "../model/language";
import {corsHeader, resolveUrl} from "./util";

export function fetchLanguages(server: string, onSuccess: (a: Language[]) => void, onFail: (err: string) => void) {
    fetch(resolveUrl(server, "api/languages?details=true"), {
        headers: corsHeader,
    }).then(res => {
        res.text().then(body => {
            if (res.ok) {
                let languages: Language[] = JSON.parse(body);
                languages.forEach(l => {
                    l.templates.forEach(t => t.language = l)
                });
                onSuccess(languages)
            } else {
                onFail(body)
            }
        })
    }).catch(err => {
        onFail(err)
    })
}