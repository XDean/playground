import {Language, Template} from "./language";
import {PlayLine} from "./play";

import {SimpleProperty} from "xdean-util";

export class AppModel {
    languages = new SimpleProperty<Language[]>([]);
    language = new SimpleProperty<Language>(Language.EMPTY);
    template = new SimpleProperty<Template>(Template.EMPTY);
    useSocket = new SimpleProperty<boolean>(true);
    codeContent = new SimpleProperty<string>("");
    outputContent = new SimpleProperty<PlayLine[]>([]);
    showOutput = new SimpleProperty<boolean>(false);

    customTemplate = new Template(Language.EMPTY, "_custom", "");

    constructor() {
        this.languages.addListener((ob, o, n) => {
            if (this.language.value == Language.EMPTY && n.length > 0) {
                this.language.value = n[0]
            }
        });
        this.language.addListener((ob, o, n) => {
            if (n.templates.length > 0 && this.template.value != this.customTemplate) {
                this.template.value = n.templates[0]
            }
        });
        this.template.addListener((ob, o, n) => {
            this.codeContent.value = n.content;
        });
        this.codeContent.addListener((ob, o, n) => {
            if (this.template.value == this.customTemplate) {
                this.customTemplate.content = n;
            } else {
                if (this.template.value.content != n) {
                    this.customTemplate.content = n;
                    this.template.value = this.customTemplate;
                }
            }
        })
    }
}

export class AppProp {
    constructor(
        public model: AppModel
    ) {
    }
}