import {PlayLine, PlayRequest} from "../model/play";
import {resolveUrl} from "./util";

export function httpPlay(server: string, request: PlayRequest, outputCallback: (l: PlayLine) => void, exitCallback: () => void): () => void {
    let controller = new AbortController();
    let signal = controller.signal;
    let kill = false;
    outputCallback(PlayLine.system("Program Start\n\n"));
    fetch(resolveUrl(server, "api/play"), {
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
                o.forEach((e: any) => {
                    outputCallback(PlayLine.output(e))
                });
                outputCallback(PlayLine.system("\nProgram Exit\n"));
            } else {
                outputCallback(PlayLine.error(o.cause));
                outputCallback(PlayLine.system("\nProgram Error\n"));
            }
            exitCallback();
        })
    }).catch(err => {
        if (!kill) {
            outputCallback(PlayLine.error(err));
            outputCallback(PlayLine.system("\nProgram Error\n"));
            exitCallback();
        }
    });
    return function () {
        kill = true;
        outputCallback(PlayLine.system("\nProgram Killed\n"));
        controller.abort();
    }
}


export function socketPlay(server: string, request: PlayRequest, outputCallback: (l: PlayLine) => void, exitCallback: () => void): () => void {
    if (server.startsWith("http://")) {
        server = "ws://" + server.substring(7);
    }
    if (server.startsWith("https://")) {
        server = "wss://" + server.substring(8);
    }
    let ws = new WebSocket(resolveUrl(server, "socket/play"));
    let kill = false;
    ws.onopen = e => {
        ws.send(JSON.stringify(request));
    };
    ws.onmessage = e => {
        outputCallback(PlayLine.output(JSON.parse(e.data)));
    };
    ws.onclose = e => {
        if (!kill) {
            outputCallback(PlayLine.system("\nProgram Exit\n"));
            exitCallback();
        }
    };
    outputCallback(PlayLine.system("Program Start\n\n"));
    return function () {
        outputCallback(PlayLine.system("\nProgram Killed\n"));
        kill = true;
        ws.close()
    };
}