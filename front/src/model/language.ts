export class Language {
    static EMPTY = new Language("", [], []);

    constructor(
        public name: string,
        public ext: string[],
        public templates: Template[],
    ) {
    }
}

export class Template {
    static EMPTY = new Template(Language.EMPTY, "", "");

    constructor(
        public language: Language,
        public name: string,
        public content: string,
    ) {
    }
}
