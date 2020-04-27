import React, { Component } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

const code = `function add(a, b) {
  return a + b;
}
`;



class EditorComponent extends Component {
  state = { code };
  render() {

    console.log(typeof (this.state.code))
    return (
      <div>
        <h3 className="mt-3">Stiles</h3>
        <Editor
          value={this.state.code}
          onValueChange={code => this.setState({ code })}
          highlight={code => highlight(code, languages.js)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
          }}
        />
      </div>

    );
  }
}

export default EditorComponent;

