class PlayRequest {
    constructor(language/*string*/, filename/*string*/, args/*string[]*/, content /*string*/) {
        this.language = language;
        this.filename = filename;
        this.args = args;
        this.content = content;
    }
}

class PlayLine {
    constructor(text /*string*/, isSystem /*bool*/, isError /*bool*/, isCompile /*bool*/) {
        this.text = text;
        this.isSystem = isSystem;
        this.isError = isError;
        this.isCompile = isCompile;
    }

    static output(responseLine) {
        return new PlayLine(
            responseLine["text"],
            responseLine["is-system"],
            responseLine["is-error"],
            responseLine["is-compile"],
        );
    }

    static error(err) {
        return new PlayLine(
            err,
            true,
            true,
        );
    }

    static system(txt) {
        return new PlayLine(
            txt,
            true,
            false,
        );
    }
}

function httpPlay(server /*string*/, request /*PlayRequest*/, outputCallback /*PlayLine=>void*/) /*killCallback void=>void*/ {
    let controller = new AbortController();
    let signal = controller.signal;
    outputCallback(PlayLine.system("Program Start\n"));
    fetch(server + "api/play", {
        method: "POST",
        body: JSON.stringify(request),
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        signal: signal
    }).then(res => {
        res.text().then(body => {
            let o = JSON.parse(body);
            if (res.ok) {
                console.log(body);
                o.forEach(e => {
                    outputCallback(PlayLine.output(e))
                });
                outputCallback(PlayLine.system("\nProgram Exit\n"));
            } else {
                outputCallback(PlayLine.error(o.cause));
                outputCallback(PlayLine.system("\nProgram Error\n"));
            }
        })
    }).catch(err => {
        outputCallback(PlayLine.error(err));
        outputCallback(PlayLine.system("\nProgram Error\n"));
    });
    return function () {
        outputCallback(PlayLine.system("\nProgram Killed\n"));
        controller.abort();
    }
}


function socketPlay(server /*string*/, request /*PlayRequest*/, outputCallback /*PlayLine=>void*/) /*killCallback void=>void*/ {
    if (server.startsWith("http://")) {
        server = "ws://" + server.substring(7);
    }
    if (server.startsWith("https://")) {
        server = "wss://" + server.substring(8);
    }
    let ws = new WebSocket(server + "socket/play");
    ws.onopen = e => {
        ws.send(JSON.stringify(request));
    };
    ws.onmessage = e => {
        outputCallback(PlayLine.output(JSON.parse(e.data)));
    };
    ws.onerror = e => {
        outputCallback(PlayLine.error(e));
        outputCallback(PlayLine.system("\nProgram Error\n"));
    };
    ws.onclose = e => {
        outputCallback(PlayLine.system("\nProgram Exit\n"));
    };
    return function () {
        outputCallback(PlayLine.system("\nProgram Killed\n"));
        ws.close();
    };
}