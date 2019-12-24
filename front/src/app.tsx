import React from 'react';
import ReactDOM from 'react-dom';
import {AppModel} from "./model/app";
import {ToolBar} from "./components/tool-bar";
import {CodeArea} from "./components/code-area";
import {OutputArea} from "./components/output-area";
import {fetchLanguages} from "./fetch/language";
import "./app.css"


document.body.appendChild(function component(): Element {
    const element = document.createElement('div');
    element.id = "root";
    return element;
}());

const serverUrl: string = process.env.SERVER_URL || '';

class App extends React.Component {
    model = new AppModel();

    render() {
        return <div id="AppRoot">
            <div id="header">
                <label id="title">
                    XDean's Code Playground
                </label>
            </div>
            <ToolBar model={this.model}/>
            <CodeArea model={this.model}/>
            <OutputArea model={this.model}/>
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
    document.getElementById('root')
);