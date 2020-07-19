import React, { Component, Fragment } from "react";
import {
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import {
  reduxForm,
  getFormValues,
  Field,
} from 'redux-form';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DropdownList from "react-widgets/lib/DropdownList";
import { states } from './states.js';
import { payment, shipping_method, discount } from './dropwdowns'
import { submitCustomer } from '../../../../redux/orders/actions'

const required = value => (value ? undefined : "Required");

const renderField = ({
  input,
  props,
  meta: { touched, error, warning },
  ...custom
}) => (
    <Fragment>
      <Input {...(touched ? { valid: !error } : {})} {...input} {...custom} />
      {/* {error && <FormFeedback>{error}</FormFeedback>}
    {!error && warning && <FormText>{warning}</FormText>} */}
    </Fragment>
  );

const renderDropdownList = ({
  input,
  data,
  valueField,
  textField,
  meta: { touched, error, warning }
}) => (
    <div>
      <DropdownList
        {...input}
        data={data}
        valueField={valueField}
        textField={textField}
        onChange={input.onChange}
      />
      {touched &&
        ((error && <span style={{ color: "red" }}>{error}</span>) ||
          (warning && <span style={{ color: "red" }}>{warning}</span>))}
    </div>
  );






class AddCustomer extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }



  submit = async (values, e) => {
    // e.preventDefault();

    const { submitCustomer, reset, toggle, CUSTNO } = this.props;


    const company = {
      Company: values.Company,
      Contact: values.Contact,
      Email: values.Email,

      Address1: values.Address1,
      Address2: values.Address2,
      City: values.City,
      State: values.State.abbreviation,
      Zip: values.Zip,
      Phone1: values.Phone1,

      "sale": values.SalesPerson._id,
      PMT_TERMS: values.PaymentType.value,
      Discount: values.Discount.value,
      CUSTNO: CUSTNO,

      Shipping_Address1: values.Shipping_Address1,
      Shipping_Address2: values.Shipping_Address2,
      Shipping_City: values.Shipping_City,
      Shipping_State: values.Shipping_State,
      Shipping_Zip: values.Shipping_Zip,
      Shipping_Phone: values.Shipping_Phone,
      Ship_Via: values.Ship_Via.value,
      Notes: values.Notes
    };


    await submitCustomer(company);
    await reset()
    await toggle()




  };

  render() {

    const { handleSubmit, modal, toggle, salesReps } = this.props;

  

    return (
      <div className="animated fadeIn">



        <Modal isOpen={modal} toggle={toggle} className="modal-lg">
          <ModalHeader toggle={toggle}>Companies</ModalHeader>
          <ModalBody>

            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <strong>Customer Profile</strong>
                  </CardHeader>
                  <CardBody>
                    <Form
                      onSubmit={handleSubmit(this.submit)}
                    >

                      <Row>
                        <Col xs="12">
                          <h6>Company Info</h6>
                        </Col>
                      </Row>


                      <Row>
                        <Col sm="4">
                          <FormGroup>
                            <Label htmlFor="companyName">Company Name</Label>
                            <Field
                              name={`Company`}
                              type="text"
                              component={renderField}
                              label="companyName"
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="4">
                          <FormGroup>
                            <Label htmlFor="full-name">Full Name</Label>
                            <Field
                              name={`Contact`}
                              type="text"
                              component={renderField}
                              label="fullName"
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="4">
                          <FormGroup>
                            <Label htmlFor="full-name">Email</Label>
                            <Field
                              name={`Email`}
                              type="text"
                              component={renderField}
                              label="email"
                            />
                          </FormGroup>
                        </Col>
                      </Row>




                      <Row>
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="payment-method">Payment Method</Label>
                            <Field
                              name={`PaymentType`}
                              component={renderDropdownList}
                              data={payment}
                              valueField="value"
                              textField="name"
                              validate={required}
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="full-name">Shipping Method</Label>
                            <Field
                              name={`Ship_Via`}
                              component={renderDropdownList}
                              data={shipping_method}
                              valueField="value"
                              textField="name"
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="salesRep">Sales Rep</Label>
                            <Field
                              name={`SalesPerson`}
                              component={renderDropdownList}
                              data={salesReps}
                              valueField="value"
                              textField="fullName"
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="salesRep">Discount</Label>
                            <Field
                              name={`Discount`}
                              component={renderDropdownList}
                              data={discount}
                              valueField="value"
                              textField="name"
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <hr />


                      <Row>
                        <Col xs="12">
                          <h6>Billing Address</h6>
                        </Col>
                      </Row>




                      <Row>
                        <Col xs="6">
                          <FormGroup>
                            <Label htmlFor="address1">Address 1</Label>
                            <Field
                              name={`Address1`}
                              type="text"
                              component={renderField}
                              label="Address1"
                            />
                          </FormGroup>
                        </Col>





                        <Col xs="6">
                          <FormGroup>
                            <Label htmlFor="address2">Address 2</Label>
                            <Field
                              name={`Address2`}
                              type="text"
                              component={renderField}
                              label="Address2"
                            />
                          </FormGroup>
                        </Col>

                      </Row>



                      <Row>
                        <Col xs="3">
                          <FormGroup>
                            <Label htmlFor="city">City</Label>
                            <Field
                              name={`City`}
                              type="text"
                              component={renderField}
                              label="City"
                            />
                          </FormGroup>
                        </Col>
                        <Col xs="3">
                          <FormGroup>
                            <Label htmlFor="state">State</Label>
                            <Field
                              name={`State`}
                              component={renderDropdownList}
                              data={states}
                              valueField="abbreviation"
                              textField="abbreviation"
                              validate={required}
                            />
                          </FormGroup>
                        </Col>
                        <Col xs="3">
                          <FormGroup>
                            <Label htmlFor="zipcode">Zip Code</Label>
                            <Field
                              name={`Zip`}
                              type="number"
                              component={renderField}
                              label="Zip"
                            />
                          </FormGroup>
                        </Col>
                        <Col xs="3">
                          <FormGroup>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Field
                              name={`Phone1`}
                              type="text"
                              component={renderField}
                              label="Phone1"
                            />
                          </FormGroup>
                        </Col>
                      </Row>


                      <hr />

                      <Row>
                        <Col xs="12">
                          <h6>Shipping Address</h6>
                        </Col>
                      </Row>




                      <Row>
                        <Col xs="6">
                          <FormGroup>
                            <Label htmlFor="address1">Address 1</Label>
                            <Field
                              name={`Shipping_Address1`}
                              type="text"
                              component={renderField}
                              label="Shipping_Address1"
                            />
                          </FormGroup>
                        </Col>





                        <Col xs="6">
                          <FormGroup>
                            <Label htmlFor="address2">Address 2</Label>
                            <Field
                              name={`Shipping_Address2`}
                              type="text"
                              component={renderField}
                              label="Shipping_Address2"
                            />
                          </FormGroup>
                        </Col>

                      </Row>



                      <Row>
                        <Col xs="3">
                          <FormGroup>
                            <Label htmlFor="city">City</Label>
                            <Field
                              name={`Shipping_City`}
                              type="text"
                              component={renderField}
                              label="Shipping_City"
                            />
                          </FormGroup>
                        </Col>
                        <Col xs="3">
                          <FormGroup>
                            <Label htmlFor="state">State</Label>
                            <Field
                              name={`Shipping_State`}
                              component={renderDropdownList}
                              data={states}
                              valueField="abbreviation"
                              textField="abbreviation"
                            />
                          </FormGroup>
                        </Col>
                        <Col xs="3">
                          <FormGroup>
                            <Label htmlFor="zipcode">Zip Code</Label>
                            <Field
                              name={`Shipping_Zip`}
                              type="text"
                              component={renderField}
                              label="Shipping_Zip"
                            />
                          </FormGroup>
                        </Col>
                        <Col xs="3">
                          <FormGroup>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Field
                              name={`Shipping_Phone`}
                              type="text"
                              component={renderField}
                              label="Shipping_Phone"
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      {/* <Row>
                        <Col xs="3">
                          <FormGroup>
                            <Label htmlFor="address1">Ship Via</Label>
                            <Field
                              name={`Ship_Via`}
                              type="text"
                              component={renderField}
                              label="Ship_Via"
                            />
                          </FormGroup>
                        </Col>
                      </Row> */}


                      <hr />


                      <Row>
                        <Col>
                          <FormGroup>
                            <h6>Extra Notes</h6>
                            <Field
                              name={`Notes`}
                              type="text"
                              component={renderField}
                              label="Extra-Info"
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Button color="primary" size="lg">Submit</Button>{' '}
                    </Form>
                  </CardBody>
                </Card>
              </Col>

            </Row>



          </ModalBody>
          <ModalFooter>

            <Button color="secondary" onClick={toggle}>Close</Button>
          </ModalFooter>
        </Modal>



      </div>
    );
  }
}



const mapStateToProps = (state, prop) => ({
  initialValues: {
    Discount: discount[0],
    SalesPerson: state.Orders.salesReps[10],
    PaymentType: payment[0],
    Ship_Via: shipping_method[2]
  },
  formState: getFormValues("Customer")(state),
  salesReps: state.Orders.salesReps,
  CUSTNO: state.customers.customerDB[state.customers.customerDB.length - 1].CUSTNO + 1

});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      submitCustomer
    },
    dispatch
  );

AddCustomer = reduxForm({
  form: "Customer",
  enableReinitialize: true
})(AddCustomer);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCustomer);
