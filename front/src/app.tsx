import React from 'react';
import ReactDOM from 'react-dom';
import {AppModel} from "./model/app";
import {ToolBar} from "./components/tool-bar";
import {CodeArea} from "./components/code-area";
import {OutputArea} from "./components/output-area";
import {fetchLanguages} from "./fetch/language";
import "./app.css"

export const serverUrl: string = process.env.SERVER_URL || '';

document.body.appendChild(function component(): Element {
    const element = document.createElement('div');
    element.id = "render-root";
    element.className = 'container';
    return element;
}());

class App extends React.Component {
    model = new AppModel();

    render() {
        return <div id="root">
            <div id="header">
                <label id="title">
                    XDean's Code Playground
                </label>
            </div>
            <ToolBar model={this.model}/>
            <div id="code-output-container">
                <CodeArea model={this.model}/>
                <OutputArea model={this.model}/>
            </div>
        </div>;
    }

    componentDidMount(): void {
        fetchLanguages(serverUrl, res => {
                console.debug("Got languages", res)
                this.model.languages.value = res
            }, err => {
                console.log("Fail to fetch languages", err)
            }
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('render-root')
);