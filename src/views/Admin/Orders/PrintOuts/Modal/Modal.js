import React from 'react';
import { Modal, ModalHeader, ModalBody, Button, ModalFooter, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';

const PrintModal = (props) => {
  const {
    buttonLabel,
    className,
    modal,
    toggle
  } = props;
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
                  <Label for="exampleSelect">Settings</Label>
                  <Input type="select" name="select" id="exampleSelect">
                    <option>Default</option>
                  </Input>
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Acknowledgement</Label>
                  <Input type="select" name="select" id="exampleSelect">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Input>
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Invoice</Label>
                  <Input type="select" name="select" id="exampleSelect">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Input>
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Assembly List</Label>
                  <Input type="select" name="select" id="exampleSelect">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Input>
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Panels</Label>
                  <Input type="select" name="select" id="exampleSelect">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Input>
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Stiles</Label>
                  <Input type="select" name="select" id="exampleSelect">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Input>
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Rails</Label>
                  <Input type="select" name="select" id="exampleSelect">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Input>
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Material List</Label>
                  <Input type="select" name="select" id="exampleSelect">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Input>
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Packing Slip</Label>
                  <Input type="select" name="select" id="exampleSelect">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Input>
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">QC</Label>
                  <Input type="select" name="select" id="exampleSelect">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Input>
                </FormGroup>
              </Form>
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
