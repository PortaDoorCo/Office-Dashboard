import React, { useRef, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { Input, Button, Row, Col, Collapse, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Parameters from './Parameters'
import Cookies from "js-cookie";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateBreakdowns, getBreakdowns } from '../../../../../../redux/part_list/actions'

const cookie = Cookies.get("jwt");



const EditorComponent = (props) => {

  const {
    buttonLabel,
    className,
    breakdowns,
    name,
    toggleEdit
  } = props;

  const { code, edit } = props;
  const [text, setText] = useState(code);
  const editorRef = useRef(null);
  const [modal, setModal] = useState(false)

  const wood = ['wood']
  const designs = ['design']
  const edges = ['edge']
  const panels = ['panel']
  const applied_profiles = ['applied_profile']
  const finish = ['finish']
  const lites = ['lites']
  const face_frame = ['openings', 'ff_opening_cost', 'ff_top_rail_design', 'furniture_feet']

  const toggle = () => {
    setModal(!modal)
  };


  const submit = async () => {

    const id = breakdowns.id

    const bd = {
      ...breakdowns,
      [name]: text
    }

    await props.updateBreakdowns(id, bd, cookie)
    await setModal(!modal)
    await toggleEdit()
  }


  const onBtnClick = (val) => {
    const startIndex = editorRef.current._input.selectionStart;
    const newVal = `${text.slice(0, startIndex)}${val}${text.slice(startIndex).replace(/\s+/, ' ')}`;
    setText(newVal);
    editorRef.current._input.value = newVal;
    editorRef.current._input.selectionStart = editorRef.current._input.selectionEnd = startIndex + val.length;
    editorRef.current._input.focus();
  }
  return (
    <div>

      <Row>
        <Col>
          <Editor
            //autoFocus
            disabled={!edit}
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
              if (e.charCode < 48 && e.charCode !== 32 && e.charCode !== 40 && e.charCode !== 41 && e.charCode !== 46 && e.charCode !== 43 && e.charCode !== 45 || e.charCode > 57) {
                e.preventDefault();
              }
            }}
          />
        </Col>
      </Row>

      <Collapse isOpen={edit}>
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
              <Parameters onBtnClick={onBtnClick} attributes={wood} name="Wood" />
              <Parameters onBtnClick={onBtnClick} attributes={designs} name="Designs" />
                <Parameters onBtnClick={onBtnClick} attributes={edges} name="Edges" />
                <Parameters onBtnClick={onBtnClick} attributes={panels} name="Panels" />
                <Parameters onBtnClick={onBtnClick} attributes={finish} name="Finish" />
                <Parameters onBtnClick={onBtnClick} attributes={applied_profiles} name="Applied Profiles" />
                <Parameters onBtnClick={onBtnClick} attributes={lites} name="Lites" />
              </div>
            </Row>
            <Row>
            <div className="col d-flex align-content-start flex-wrap">
              <Parameters onBtnClick={onBtnClick} attributes={face_frame} name="Face Frame" />
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
              </div>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button color="danger" onClick={toggle}>SUBMIT CHANGES</Button>
          </Col>
        </Row>

      </Collapse>


      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Are You Sure?</ModalHeader>
        <ModalBody>
          Are you sure you want to change this setting?
          </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={submit}>Submit</Button>
          <Button color="danger" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>


    </div>

  );


}

const mapStateToProps = (state) => ({
  breakdowns: state.part_list.breakdowns[0]
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateBreakdowns,
      getBreakdowns
    },
    dispatch
  );



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorComponent);


