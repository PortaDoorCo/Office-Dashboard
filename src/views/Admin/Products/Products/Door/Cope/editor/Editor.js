import React, { useRef, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { Input, Button, Row, Col } from 'reactstrap'
import Parameters from './Parameters'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';





const EditorComponent = (props) => {
  const { code, edit } = props;
  const [text, setText] = useState(code);
  const editorRef = useRef(null);
  const woodtypes = props.woodtypes ? props.woodtypes[0] : []
  const designs = props.designs ? props.designs[0] : []
  const edges = props.edges ? props.edges[0] : []
  const panels = props.panels ? props.panels[0] : []
  const profiles = props.profiles ? props.profiles[0] : []
  const applied_profiles = props.applied_profiles ? props.applied_profiles[0] : []
  const userInput = {
    width: '',
    height: '',
    panelsH: '',
    panelsW: '',
    leftStile: '',
    rightStile: '',
    topRail: '',
    bottomRail: '',
    horizMull: '',
    vertMull: ''
  }

  const onBtnClick = (val) => {
    const startIndex = editorRef.current._input.selectionStart;
    const newVal = `${text.slice(0, startIndex)}${val}${text.slice(startIndex).replace(/\s+/, ' ')}`;
    setText(newVal);
    editorRef.current._input.value = newVal;
    editorRef.current._input.selectionStart = editorRef.current._input.selectionEnd = startIndex+1;
    editorRef.current._input.focus();
  }

  if (edit) {
    return (
      <div>
        <Row>
          <Col>
            <Editor
            //autoFocus
              ref={editorRef}
              value={text}
              onValueChange={c => setText(c.replace(/\s+/, ' '))}
              highlight={code => highlight(code, languages.js)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}
              onKeyPress={e => {
                e.persist();
                if (e.charCode !== 32) {
                  e.preventDefault();
                }
              }}
            />
          </Col>
        </Row>


        <Row className="mb-2">
          <Col>
            <Row>
              <Col>
                Operators
            </Col>
            </Row>
            <Row>
              <div className="col d-flex align-content-start flex-wrap">
                <Button onClick={() => onBtnClick('+')} outline color="danger">+</Button>
                <Button onClick={() => onBtnClick('-')} outline color="danger">-</Button>
                <Button onClick={() => onBtnClick('*')} outline color="danger">*</Button>
                <Button onClick={() => onBtnClick('/')} outline color="danger">/</Button>
                <Button onClick={() => onBtnClick('(')} outline color="danger">(</Button>
                <Button onClick={() => onBtnClick(')')} outline color="danger">)</Button>
              </div>
            </Row>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col>
            <Row>
              <Col>
                Product Attributes
            </Col>
            </Row>
            <Row>
              <div className="col d-flex align-content-start flex-wrap">
                <Parameters attributes={woodtypes} name="Woodtypes" />
                <Parameters attributes={designs} name="Designs" />
                <Parameters attributes={edges} name="Edges" />
                <Parameters attributes={profiles} name="Profiles" />
                <Parameters attributes={panels} name="Panels" />
                <Parameters attributes={applied_profiles} name="Applied Profiles" />
              </div>
            </Row>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col>
            <Row>
              <Col>
                User Input
            </Col>
            </Row>
            <Row>
              <div className="col d-flex align-content-start flex-wrap">
                <Button onClick={() => onBtnClick('width')} outline color="danger">Width</Button>
                <Button onClick={() => onBtnClick('height')} outline color="danger">Height</Button>
                <Button onClick={() => onBtnClick('panelsH')} outline color="danger">Panels High</Button>
                <Button onClick={() => onBtnClick('panelsW')} outline color="danger">Panels Wide</Button>
                <Button onClick={() => onBtnClick('leftStile')} outline color="danger">Left Stile</Button>
                <Button onClick={() => onBtnClick('rightStile')} outline color="danger">Right Stile</Button>
                <Button onClick={() => onBtnClick('topRail')} outline color="danger">Top Rail</Button>
                <Button onClick={() => onBtnClick('bottomRail')} outline color="danger">Bottom Rail</Button>
                <Button onClick={() => onBtnClick('vertMull')} outline color="danger">Vertical Mull</Button>
                <Button onClick={() => onBtnClick('horizMull')} outline color="danger">Horizontal Mull</Button>
              </div>
            </Row>
          </Col>
        </Row>


        <Row className="mt-3">
          <Col>
            <p style={{ color: 'red' }}>**WARNING ** <br />
              EDITING THESE VALUES MAY BREAK COMPONENTS IF NOT DONE CORRECTLY. <br />
              PLEASE MAKE SURE YOUR MATH IS COMPLETE</p>
          </Col>
        </Row>

      </div>

    );
  } else {
    return (
      <div>
        <Input type="textarea" disabled placeholder={props.code} />
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  woodtypes: state.part_list.woodtypes,
  designs: state.part_list.cope_designs,
  edges: state.part_list.edges,
  panels: state.part_list.panels,
  profiles: state.part_list.profiles,
  applied_profiles: state.part_list.applied_moulds
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {

    },
    dispatch
  );



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorComponent);


