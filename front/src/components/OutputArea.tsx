import * as React from "react";
import {AppModel, AppProp} from "../model/app";

export class OutputArea extends React.Component<AppProp, AppModel> {
    render() {
        return <div id="output" style={{display: "none"}}>
            <a id="output-close" href="javascript:void(0)" onClick={this.closeOutput}>×</a>
            <pre id="output-content"></pre>
        </div>
    }

    private closeOutput() {

    }
}