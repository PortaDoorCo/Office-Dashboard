import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, ModalFooter, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { DropdownList } from 'react-widgets';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addPrinterOption, savePrinterOption } from '../../../redux/misc_items/actions';
import Cookies from 'js-cookie';
import axios from 'axios';
import db_url from '../../../redux/db_url';


const cookie = Cookies.get('jwt');

const PrintModal = (props) => {
  const {

    className,
    modal,
    toggle,
    printer_options,
    downloadPDF,
    addPrinterOption,
    savePrinterOption,
    user
  } = props;

  const number_select = [0,1,2,3,4,5];

  const [printer_option, set_printer_option] = useState({
    id: '',
    NAME: printer_options[0].NAME,
    acknowledgement: printer_options[0].acknowledgement,
    invoice: printer_options[0].invoice,
    assembly_list: printer_options[0].assembly_list,
    panels: printer_options[0].panels,
    profiles: printer_options[0].profiles,
    stiles: printer_options[0].stiles,
    rails: printer_options[0].rails,
    materials: printer_options[0].materials,
    packing_slip: printer_options[0].packing_slip,
    qc: printer_options[0].qc
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
 
  const handleCreate = async (name) => {
    let newOption = {
      NAME: name,
      acknowledgement: 0,
      invoice: 0,
      assembly_list: 0,
      panels: 0,
      profiles: 0,
      stiles: 0,
      rails: 0,
      materials: 0,
      packing_slip: 0,
      qc: 0
    };


    const res = await axios.post(`${db_url}/printer-options`, newOption,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res;
    await addPrinterOption(data.data);
    await set_printer_option(data.data);
  };

  const saveOption = async () => {
    const id = printer_option.id;
    await savePrinterOption(id, printer_option, cookie);
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
                    // allowCreate={true}
                    // onCreate={name => handleCreate(name)}
                    onChange={value => set_printer_option(value)}
                    textField="NAME"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>

          {user?.role?.type !== 'quality_control' ? 
            <Row>
              <Col>
                <Form>
                  <FormGroup>
                    <Label for="acknowledgement">Acknowledgement</Label>
                    <DropdownList filter
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
                    <DropdownList filter
                      data={number_select}
                      value={printer_option.invoice}
                      onChange={(e) => change(e, 'invoice')}
                      textField="invoice"
                      name="invoice"
                    />
                  </FormGroup>
                </Form>
              </Col>
            </Row> : null}

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="assembly_list">Assembly List</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option.assembly_list}
                    onChange={(e) => change(e, 'assembly_list')}
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
                    value={printer_option.panels}
                    onChange={(e) => change(e, 'panels')}
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
                    value={printer_option.stiles}
                    onChange={(e) => change(e, 'stiles')}
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
                    value={printer_option.rails}
                    onChange={(e) => change(e, 'rails')}
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
                  <Label for="profiles">Profiles</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option.profiles}
                    onChange={(e) => change(e, 'profiles')}
                    textField="profiles"
                    name="profiles"
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="material_list">Material List</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option.materials}
                    onChange={(e) => change(e, 'materials')}
                    textField="materials"
                    name="materials"
                  />
                </FormGroup>
              </Form>
            </Col>
           
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="packing_slip">Packing Slip</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option.packing_slip}
                    onChange={(e) => change(e, 'packing_slip')}
                    textField="packing_slip"
                    name="packing_slip"
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="qc">QC</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option && printer_option.qc}
                    onChange={(e) => change(e, 'qc')}
                    textField="qc"
                    name="qc"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <Button color="primary" onClick={saveOption}>Save</Button>
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


const mapStateToProps = (state, prop) => ({
  user: state.users.user
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addPrinterOption,
      savePrinterOption
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(PrintModal);
