import React, { useState } from 'react';
import { connect } from 'react-redux';
import { DropdownList } from 'react-widgets';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Input,
} from 'reactstrap';
import { bindActionCreators } from 'redux';
import {
  addPrinterOption,
  savePrinterOption,
} from '../../../redux/misc_items/actions';

const PrintModal = (props) => {
  const {
    buttonLabel,
    className,
    modal,
    toggle,
    printer_options,
    downloadPDF,
    user,
    orderType,
  } = props;

  const number_select = [0, 1, 2, 3, 4, 5];

  const [value, setValue] = useState(null);
  const [new_printer_option, set_new_printer_option] =
    useState(printer_options);
  const [printer_option, set_printer_option] = useState({
    id: '',
    NAME: printer_options[0].NAME,
    acknowledgement: printer_options[0].acknowledgement,
    invoice: printer_options[0].invoice,
    assembly_list: printer_options[0].assembly_list,
    packing_slip: printer_options[0].packing_slip,
    qc: printer_options[0].qc,
    door_labels: printer_options[0].door_labels || 0,
  });

  const change = (e, name) => {
    const value = e;
    set_printer_option((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleCreate = (name) => {
    let newOption = {
      NAME: name,
      id: new_printer_option.length + 1,
      acknowledgement: 1,
      invoice: 1,
      assembly_list: 1,
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
                  <DropdownList
                    filter
                    data={new_printer_option}
                    value={printer_option}
                    // allowCreate={true}
                    // onCreate={name => handleCreate(name)}
                    onChange={(value) => set_printer_option(value)}
                    textField="NAME"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>

          {user?.role?.type !== 'quality_control' ? (
            <div>
              <Row>
                <Col>
                  <Form>
                    <FormGroup>
                      <Label for="acknowledgement">Acknowledgement</Label>
                      <DropdownList
                        filter
                        data={number_select}
                        value={printer_option.acknowledgement}
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
                      <DropdownList
                        filter
                        data={number_select}
                        value={printer_option.invoice}
                        onChange={(e) => change(e, 'invoice')}
                        textField="invoice"
                        name="invoice"
                      />
                    </FormGroup>
                  </Form>
                </Col>
              </Row>

              <Row>
                {orderType !== 'Misc Items' ? (
                  <Col>
                    <Form>
                      <FormGroup>
                        <Label for="acknowledgement">Assembly List</Label>
                        <DropdownList
                          filter
                          data={number_select}
                          value={printer_option.assembly_list}
                          onChange={(e) => change(e, 'assembly_list')}
                          textField="assembly_list"
                          name="assembly_list"
                        />
                      </FormGroup>
                    </Form>
                  </Col>
                ) : null}
              </Row>
            </div>
          ) : null}

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="invoice">Packing Slip</Label>
                  <DropdownList
                    filter
                    data={number_select}
                    value={printer_option.packing_slip}
                    onChange={(e) => change(e, 'packing_slip')}
                    textField="packing_slip"
                    name="packing_slip"
                  />
                </FormGroup>
              </Form>
            </Col>

            <Col lg="6">
              <Form>
                <FormGroup>
                  <Label for="acknowledgement">QC</Label>
                  <DropdownList
                    filter
                    data={number_select}
                    value={printer_option.qc}
                    onChange={(e) => change(e, 'qc')}
                    textField="qc"
                    name="qc"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="labels">Door Labels</Label>

                  <Input
                    value={printer_option.door_labels}
                    name="door_labels"
                    onChange={(e) => change(e.target.value, 'door_labels')}
                  ></Input>

                  {/* <DropdownList filter
                    data={number_select}
                    value={printer_option.door_labels}
                    onChange={(e) => change(e, 'door_labels')}
                    textField="door_labels"
                    name="door_labels"
                  /> */}
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
          <Button
            color="primary"
            onClick={(e) => {
              downloadPDF(printer_option);
            }}
          >
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

const mapStateToProps = (state, prop) => ({
  user: state.users.user,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addPrinterOption,
      savePrinterOption,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(PrintModal);
