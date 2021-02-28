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
  const [printer_option, set_printer_option] = useState({
    id: '',
    NAME: printer_options[0].NAME,
    acknowledgement: printer_options[0].acknowledgement,
    invoice: printer_options[0].invoice,
  });

  const change = (e, name) => {
    const value = e;
    set_printer_option((prevState) => {
      return ({
        ...prevState,
        [name]: value
      });
    });
  };
 
  const handleCreate = (name) => {

    let newOption = {
      NAME: name,
      id: new_printer_option.length + 1,
      acknowledgement: 1,
      invoice: 1,
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
                    value={printer_option.acknowledgement}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={(e) => change(e, 'acknowledgement')}
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
                    value={printer_option.invoice}
                    allowCreate={true}
                    onCreate={name => handleCreate(name)}
                    onChange={(e) => change(e, 'invoice')}
                    textField="invoice"
                    name="invoice"
                  />
                </FormGroup>
              </Form>
            </Col>
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
