import React, { Component, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { Input, Button, Row, Col } from 'reactstrap'
import Parameters from './Parameters'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';





const EditorComponent = (props) => {
  const { code } = props;
  const [edit, setEdit] = useState(false);

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


  if (edit) {
    return (
      <div>
        <Row>
          <Col>
            <Editor
              value={code}
              onValueChange={code => console.log(code)}
              highlight={code => highlight(code, languages.js)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
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
                <Button outline color="danger">+</Button>
                <Button outline color="danger">-</Button>
                <Button outline color="danger">*</Button>
                <Button outline color="danger">/</Button>
                <Button outline color="danger">(</Button>
                <Button outline color="danger">)</Button>
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
                <Parameters attributes={userInput} name="User Input" />
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
                <Button outline color="danger">Width</Button>
                <Button outline color="danger">Height</Button>
                <Button outline color="danger">Panels High</Button>
                <Button outline color="danger">Panels Wide</Button>
                <Button outline color="danger">Left Stile</Button>
                <Button outline color="danger">Right Stile</Button>
                <Button outline color="danger">Top Rail</Button>
                <Button outline color="danger">Bottom Rail</Button>
                <Button outline color="danger">Vertical Mullion</Button>
                <Button outline color="danger">Horizontal Mullion</Button>
              </div>
            </Row>
          </Col>
        </Row>



      </div>

    );
  } else {
    return (
      <div>
        <Input disabled placeholder={props.code} />
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


