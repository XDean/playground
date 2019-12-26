import {Property} from "../util/property"
import {Language, Template} from "./language";
import {PlayLine} from "./play";

export class AppModel {
    languages = new Property<Language[]>([]);
    language = new Property<Language>(Language.EMPTY);
    template = new Property<Template>(Template.EMPTY);
    useSocket = new Property<boolean>(true);
    codeContent = new Property<string>("");
    outputContent = new Property<PlayLine[]>([]);
    showOutput = new Property<boolean>(false);

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