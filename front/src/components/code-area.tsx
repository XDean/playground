import * as React from "react";
import {RefObject} from "react";
import {AppProp} from "../model/app";

import * as codemirror from 'codemirror';
import {UnControlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/idea.css'

import 'codemirror/mode/clike/clike'
import 'codemirror/mode/go/go'
import 'codemirror/mode/python/python'
import {Language} from "../model/language";
import "./code-area.css"

const codeTypeMap: { [key: string]: string } = {
    "java": "text/x-java"
};

class CodeAreaState {
    constructor(
        readonly content: string,
        readonly mode: string,
        readonly cursor: codemirror.Position | undefined,
    ) {
    }
}

export class CodeArea extends React.Component<AppProp, CodeAreaState> {
    private ref: RefObject<CodeMirror> = {current: null};

    constructor(props: AppProp) {
        super(props);
        this.state = new CodeAreaState(props.model.codeContent.value, this.getMode(props.model.language.value), undefined);
        props.model.codeContent.addListener((ob, o, n) => {
            this.setState({content: n})
        });
        props.model.language.addListener((ob, o, n) => {
            this.setState({mode: this.getMode(n)})
        });
    }

    render() {
        return <CodeMirror
            className="code-area-container"
            value={this.state.content}
            onChange={this.onCodeUpdate}
            cursor={this.state.cursor}
            options={{
                lineNumbers: true,
                mode: this.state.mode,
            }}/>
    }

    private onCodeUpdate = (editor: codemirror.Editor, data: codemirror.EditorChange, value: string) => {
        this.setState({cursor: editor.getCursor()});
        this.props.model.codeContent.value = value;
    };

    private getMode = (lang: Language) => {
        return codeTypeMap[lang.name] || lang.name
    };
}