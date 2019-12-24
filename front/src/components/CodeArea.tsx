import * as React from "react";
import {AppProp} from "../model/app";

require('codemirror/lib/codemirror.css');

let CodeMirror = require('react-codemirror');

class CodeAreaState {
    constructor(public content: string) {
    }
}

export class CodeArea extends React.Component<AppProp, CodeAreaState> {
    constructor(props: AppProp) {
        super(props);
        this.state = new CodeAreaState(props.model.codeContent.value)
    }

    render() {
        return <CodeMirror value={this.state.content} onChange={(e: string) => this.onCodeUpdate(e)}
                           options={{lineNumbers: true}}/>
    }

    private onCodeUpdate(content: string) {
        this.props.model.codeContent.value = content;
    }
}