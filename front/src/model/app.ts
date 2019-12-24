import {Property} from "../util/property"
import {Language, Template} from "./language";

export class AppModel {
    static CUSTOM_TEMPLATE = new Template(Language.EMPTY, "custom", "");

    languages = new Property<Language[]>([]);
    language = new Property<Language>(Language.EMPTY);
    template = new Property<Template>(Template.EMPTY);
    useSocket = new Property<boolean>(true);
    codeContent = new Property<string>("");

    constructor() {
        this.languages.addListener((ob, o, n) => {
            if (this.language.value == Language.EMPTY && n.length > 0) {
                this.language.value = n[0]
            }
        });
        this.language.addListener((ob, o, n) => {
            if (n.templates.length > 0 && (this.codeContent.value === '' || this.codeContent.value === this.template.value.content)) {
                this.template.value = n.templates[0]
            }
        });
        this.template.addListener((ob, o, n) => {
            if (n != AppModel.CUSTOM_TEMPLATE) {
                this.codeContent.value = n.content;
            }
        });
        this.codeContent.addListener((ob, o, n) => {
            if (this.template.value != AppModel.CUSTOM_TEMPLATE) {
                if (this.template.value.content != n) {
                    this.template.value = AppModel.CUSTOM_TEMPLATE;
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