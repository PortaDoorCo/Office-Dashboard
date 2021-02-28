import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, ModalFooter, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { DropdownList } from 'react-widgets';

const PrintModal = (props) => {
  const {
    buttonLabel,
    className,
    modal,
    toggle,
    printer_options,
    downloadPDF
  } = props;

  const number_select = [0,1,2,3,4,5];

  const [value, setValue] = useState(null);
  const [new_printer_option, set_new_printer_option] = useState(printer_options);
  const [printer_option, set_printer_option] = useState(printer_options[0]);
 
  const handleCreate = (name) => {

    let newOption = {
      NAME: name,
      id: new_printer_option.length + 1,
      acknowledgement: 1,
      invoice: 1,
      assembly_list: 1,
      panels: 1,
      stiles: 1,
      rails: 1,
      materials: 1,
      packing_slip: 1,
      qc: 1
    };

    set_new_printer_option([...new_printer_option, newOption]);

  };


  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Print</ModalHeader>
        <ModalBody>
          <h2>Print</h2>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="printer_settings">Settings</Label>
                  <DropdownList filter
                    data={new_printer_option}
                    value={printer_option}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => set_printer_option(value)}
                    textField="NAME"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="acknowledgement">Acknowledgement</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option && printer_option.acknowledgement}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="acknowledgement"
                    name="acknowledgement"
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="invoice">Invoice</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option && printer_option.invoice}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="invoice"
                    name="invoice"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="assembly_list">Assembly List</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option && printer_option.assembly_list}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="assembly_list"
                    name="assembly_list"
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="panels">Panels</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option && printer_option.panels}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="panels"
                    name="panels"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="stiles">Stiles</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option && printer_option.stiles}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="stiles"
                    name="stiles"
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="rails">Rails</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option && printer_option.rails}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="rails"
                    name="rails"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="material_list">Material List</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option && printer_option.materials}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="materials"
                    name="materials"
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="packing_slip">Packing Slip</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option && printer_option.packing_slip}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="packing_slip"
                    name="packing_slip"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="qc">QC</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option && printer_option.qc}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="qc"
                    name="qc"
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col />
          </Row>

          <Row className="mt-3">
            <Col>
              <Button color="primary">Save</Button>
            </Col>
            <Col />
          </Row>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => {
            downloadPDF(printer_option);
          }}>
            Print
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default PrintModal;
