export class Language {
    static EMPTY = new Language("", [], []);

    constructor(
        readonly name: string,
        readonly ext: string[],
        readonly templates: Template[],
    ) {
    }
}

export class Template {
    static EMPTY = new Template("", "");

    constructor(
        readonly name: string,
        readonly content: string
    ) {
    }
}
