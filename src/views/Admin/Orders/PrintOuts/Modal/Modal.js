import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, ModalFooter, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { DropdownList } from 'react-widgets';

const PrintModal = (props) => {
  const {
    buttonLabel,
    className,
    modal,
    toggle,
    printer_options
  } = props;

  const [value, setValue] = useState(null);
  const [printer_option, set_printer_option] = useState(printer_options[0]);
 
  const handleCreate = (name) => {

    // let newOption = {
    //   name,
    //   id: printerOption.length + 1
    // };

    // this.setState({
    //   value: newOption,  // select new option
    //   printerOption: [...printerOption, newOption] // add new option to our dataset
    // });
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
                    data={printer_options}
                    value={printer_option}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
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
                  <Label for="exampleSelect">Acknowledgement</Label>
                  <DropdownList filter
                    data={printer_options}
                    value={printer_option && printer_option.acknowledgement}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="acknowledgement"
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Invoice</Label>
                  <DropdownList filter
                    data={printer_options}
                    value={printer_option && printer_option.invoice}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="invoice"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Assembly List</Label>
                  <DropdownList filter
                    data={printer_options}
                    value={printer_option && printer_option.assembly_list}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="assembly_list"
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Panels</Label>
                  <DropdownList filter
                    data={printer_options}
                    value={printer_option && printer_option.panels}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="panels"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Stiles</Label>
                  <DropdownList filter
                    data={printer_options}
                    value={printer_option && printer_option.stiles}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="stiles"
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Rails</Label>
                  <DropdownList filter
                    data={printer_options}
                    value={printer_option && printer_option.rails}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="rails"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Material List</Label>
                  <DropdownList filter
                    data={printer_options}
                    value={printer_option && printer_option.materials}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="materials"
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Packing Slip</Label>
                  <DropdownList filter
                    data={printer_options}
                    value={printer_option && printer_option.packing_slip}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="packing_slip"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">QC</Label>
                  <DropdownList filter
                    data={printer_options}
                    value={printer_option && printer_option.qc}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={value => setValue(value)}
                    textField="qc"
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
          <Button color="primary" onClick={toggle}>
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
