import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { DropdownList } from 'react-widgets';
import { Button, Col, Form, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import db_url from '../../../redux/db_url';
import { addPrinterOption, savePrinterOption } from '../../../redux/misc_items/actions';


const cookie = Cookies.get('jwt');

const PrintModal = (props) => {
  const {
    buttonLabel,
    className,
    modal,
    toggle,
    printer_options,
    downloadPDF,
    user
  } = props;

  const number_select = [0,1,2,3,4,5];

  const [value, setValue] = useState(null);
  const [new_printer_option, set_new_printer_option] = useState(printer_options);
  const [printer_option, set_printer_option] = useState({
    id: '',
    NAME: printer_options[0].NAME,
    acknowledgement: printer_options[0].acknowledgement,
    invoice: printer_options[0].invoice,
    assembly_list: printer_options[0].assembly_list,
    box_sides: printer_options[0].box_sides,
    box_bottoms: printer_options[0].box_bottoms,
    packing_slip: printer_options[0].packing_slip,
    box_labels: printer_options[0].box_labels
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
      box_sides: 0,
      box_bottoms: 0,
      packing_slip: 0,
      box_labels: 0
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
                    data={new_printer_option}
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

            <div>
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
              </Row>

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
                      <Label for="box_sides">Box Sides</Label>
                      <DropdownList filter
                        data={number_select}
                        value={printer_option.box_sides}
                        onChange={(e) => change(e, 'box_sides')}
                        textField="box_sides"
                        name="box_sides"
                      />
                    </FormGroup>
                  </Form>
                </Col>

                <Col>
                  <Form>
                    <FormGroup>
                      <Label for="box_bottoms">Box Bottoms</Label>
                      <DropdownList filter
                        data={number_select}
                        value={printer_option.box_bottoms}
                        onChange={(e) => change(e, 'box_bottoms')}
                        textField="box_bottoms"
                        name="box_bottoms"
                      />
                    </FormGroup>
                  </Form>
                </Col>
              </Row>


            </div>
            : null}

         


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
                  <Label for="qc">Box Labels</Label>
                  <DropdownList filter
                    data={number_select}
                    value={printer_option && printer_option.box_labels}
                    onChange={(e) => change(e, 'box_labels')}
                    textField="box_labels"
                    name="box_labels"
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