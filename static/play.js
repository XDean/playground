class PlayRequest {
  constructor(language/*string*/, filename/*string*/, args/*string[]*/, content /*string*/) {
    this.language = language;
    this.filename = filename;
    this.args = args;
    this.content = content;
  }
}

const type_output = 0;
const type_system = 1;
const type_error = 2;

class PlayLine {
  constructor(type, text /*string*/, isError /*boolean*/, isCompile /*boolean*/) {
    this.type = type;
    this.isError = isError;
    this.isCompile = isCompile;
    this.text = text;
  }

  static output(responseLine) {
    return new PlayLine(
      type_output,
      responseLine["text"],
      responseLine["is-error"],
      responseLine["is-compile"],
    );
  }

  static error(err) {
    return new PlayLine(
      type_error,
      err,
    );
  }

  static system(txt) {
    return new PlayLine(
      type_system,
      txt,
    );
  }
}

function httpPlay(request /*PlayRequest*/, outputCallback /*PlayLine=>void*/) /*killCallback void=>void*/ {
  let controller = new AbortController();
  let signal = controller.signal;
  outputCallback(PlayLine.system("Program Start\n"));
  fetch("api/play", {
    method: "POST",
    body: JSON.stringify(request),
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    signal: signal
  }).then(res => {
    res.text().then(body => {
      console.log(body);
      let outputs = JSON.parse(body);
      outputs.forEach(e => {
        outputCallback(PlayLine.output(e))
      })
      outputCallback(PlayLine.system("\nProgram Exit\n"));
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