export class PlayRequest {
    constructor(
        readonly content: string,
        readonly language?: string,
        readonly filename?: string,
        readonly args?: string[],
    ) {
    }
}

export class PlayLine {
    constructor(
        readonly text: string,
        readonly isSystem: boolean = false,
        readonly isError: boolean = false,
        readonly isCompile: boolean = false,
    ) {
    }

    static output(responseLine: any) {
        return new PlayLine(
            responseLine["text"],
            responseLine["is-system"],
            responseLine["is-error"],
            responseLine["is-compile"],
        );
    }

    static error(err: string) {
        return new PlayLine(
            err,
            true,
            true,
        );
    }

    static system(txt: string) {
        return new PlayLine(
            txt,
            true,
        );
    }
}