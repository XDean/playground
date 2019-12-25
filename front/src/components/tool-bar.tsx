import * as React from "react";
import {AppProp} from "../model/app";
import {Language, Template} from "../model/language";

class ToolbarState {
    constructor(
        readonly languages: Language[],
        readonly language: Language,
        readonly template: Template,
        readonly useSocket: boolean,
    ) {
    }
}

export class ToolBar extends React.Component<AppProp, ToolbarState> {
    private languageSelect: HTMLSelectElement | null = null;
    private templateSelect: HTMLSelectElement | null = null;

    constructor(props: AppProp) {
        super(props);
        this.state = new ToolbarState(
            props.model.languages.value,
            props.model.language.value,
            props.model.template.value,
            props.model.useSocket.value);
        props.model.languages.addListener((ob, o, n) => {
            this.setState({languages:n})
        });
        props.model.language.addListener((ob, o, n) => {
            this.setState({language:n})
        });
        props.model.template.addListener((ob, o, n) => {
            this.setState({template:n})
        });
        props.model.useSocket.addListener((ob, o, n) => {
            this.setState({useSocket:n})
        });
    }

    render() {
        return <div id="tool-bar">
            <label htmlFor="language-select">Language:</label>
            <select id="language-select" ref={e => this.languageSelect = e}
                    onChange={this.onLanguageChange} value={this.state.language.name}>
                {
                    this.state.languages.map(l =>
                        <option key={l.name} value={l.name}>{l.name}</option>
                    )
                }
            </select>
            <label htmlFor="template-select">Template:</label>
            <select id="template-select" ref={e => this.templateSelect = e}
                    onChange={this.onTemplateChange} value={this.state.template.name}>
                {
                    this.state.language.templates.map(t =>
                        <option key={t.name} value={t.name}>{t.name}</option>
                    )
                }
            </select>
            <button id="run-button" onClick={this.run}>Run</button>
            <button id="kill-button" onClick={this.kill}>Kill</button>
            <input id="socket-button" type="checkbox" onChange={this.switchSocket} checked={this.state.useSocket}/>Socket
        </div>
    }

    private onLanguageChange = () => {
        if (this.languageSelect != null) {
            let value = this.languageSelect.value;
            let find = this.props.model.languages.value.find(e => e.name == value);
            if (find) {
                this.props.model.language.value = find
            }
        }
    };

    private onTemplateChange = () => {
        if (this.templateSelect != null) {
            let value = this.templateSelect.value;
            let find = this.props.model.language.value.templates.find(t => t.name == value);
            if (find) {
                this.props.model.template.value = find
            }
        }
    };

    private run = () => {

    };

    private kill = () => {

    };

    private switchSocket = () => {

    };
}