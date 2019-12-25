import * as React from "react";
import {AppProp} from "../model/app";
import {PlayLine} from "../model/play";
import "./output-area.css"

class OutputAreaState {
    constructor(
        readonly shown: boolean = true,
        readonly lines: PlayLine[],
    ) {
    }
}

export class OutputArea extends React.Component<AppProp, OutputAreaState> {
    constructor(props: AppProp) {
        super(props);
        this.state = new OutputAreaState(props.model.showOutput.value, props.model.outputContent.value);
        props.model.showOutput.addListener((ob, o, n) => {
            this.setState({shown: n})
        });
        props.model.outputContent.addListener((ob, o, n) => {
            this.setState({lines: n})
        });
    }

    render() {
        return <div id="output-container">
            {
                !this.state.shown &&
                <div id="output-show-container">
                    <button onClick={this.showOutput}>Show</button>
                </div>
            }
            {
                this.state.shown &&
                <div id="output-content-container">
                    <a id="output-close" href="#" onClick={this.closeOutput}>×</a>
                    <pre id="output-content">
                {
                    this.state.lines.map((line, index) => {
                            let classList: string[] = []
                            if (line.isSystem) {
                                if (line.isError) {
                                    classList.push('output-error')
                                } else {
                                    classList.push('output-system')
                                }
                            } else {
                                if (line.isError) {
                                    classList.push('output-stderr')
                                } else {
                                    classList.push('output-stdout')
                                }
                                if (line.isCompile) {
                                    classList.push('output-compile')
                                }
                            }
                            return <span key={index} className={classList.join(' ')}>{line.text}</span>
                        }
                    )
                }
                </pre>
                </div>
            }
        </div>
    }

    private showOutput = () => {
        this.props.model.showOutput.value = true;
    };

    private closeOutput = () => {
        this.props.model.showOutput.value = false;
    }
}