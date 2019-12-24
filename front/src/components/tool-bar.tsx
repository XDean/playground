import * as React from "react";
import {ChangeEvent} from "react";
import {AppModel, AppProp} from "../model/app";

class ToolbarState {
    constructor(
        readonly model: AppModel
    ) {
    }
}

export class ToolBar extends React.Component<AppProp, ToolbarState> {
    constructor(props: AppProp) {
        super(props);
        this.state = new ToolbarState(props.model);
    }

    render() {
        return <div id="tool-bar">
            <label htmlFor="language-select">Language:</label>
            <select id="language-select" onChange={this.onLanguageChange} value={this.props.model.language.value.name}>
                {
                    this.props.model.languages.value.map(l =>
                        <option key={l.name} value={l.name}>{l.name}</option>
                    )
                }
            </select>
            <label htmlFor="template-select">Template:</label>
            <select id="template-select" onChange={this.onTemplateChange} value={this.props.model.template.value.name}>
                {
                    this.props.model.language.value.templates.map(t =>
                        <option key={t.name} value={t.name}>{t.name}</option>
                    )
                }
            </select>
            <button id="run-button" onClick={this.run}>Run</button>
            <button id="kill-button" onClick={this.kill}>Kill</button>
            <input id="socket-button" type="checkbox" onChange={this.switchSocket}/>Socket
        </div>
    }

    private onLanguageChange(event: ChangeEvent) {
        console.log(event.target)
    }

    private onTemplateChange(event: ChangeEvent) {
        console.log(event.target)
    }

    private run() {

    }

    private kill() {

    }

    private switchSocket() {

    }
}