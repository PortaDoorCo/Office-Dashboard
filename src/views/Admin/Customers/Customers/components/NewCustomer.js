import React, { Component } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  reduxForm,
  Field,
} from 'redux-form';
import { updateCustomer, submitCustomer } from '../../../../../redux/customers/actions';
import { renderField, renderDropdownList, renderSwitch, renderCheckboxToggle } from '../../../../../components/RenderInputs/renderInputs';
import Cookies from 'js-cookie';

const cookie = Cookies.get('jwt');
const required = value => (value ? undefined : 'Required');

class Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Company: [],
      Contact: []
    };
  }

handleChange = e => {
  this.setState({ [e.target.name]: e.target.value });
};

submit = async (values, e) => {
  const data = {
    Company: values.Company,
    Contact: values.Contact,
    EMAIL: values.EMAIL,
    PaymentMethod: values.PaymentMethod.NAME,
    Ship_Via: values.Ship_Via.NAME,
    sale: values.sale.id,
    TaxRate: values.TaxRate,
    PMT_TERMS: values.PMT_TERMS.NAME,
    Address1: values.Address1,
    Address2: values.Address2,
    City: values.City,
    State: values.State,
    Zip: values.Zip,
    Phone1: values.Phone1,
    Fax: values.Fax,
    Shipping_Address1: values.Shipping_Address1,
    Shipping_Address2: values.Shipping_Address2,
    Shipping_City: values.Shipping_City,
    Shipping_State: values.Shipping_State,
    Shipping_Zip: values.Shipping_Zip,
    Shipping_Phone: values.Shipping_Phone,
    Notes: values.Notes,
    Taxable: values.Taxable,
    Discount: values.Discount
  };

  await this.props.submitCustomer(data, cookie);
  await this.props.reset();
  await this.props.toggle();
};

render() {

  const {
    handleSubmit,
    salesReps,
    shippingMethods,
    edit,
    paymentTypes,
    paymentTerms
  } = this.props;

  return (
    <div className="animated resize">

      <Card>
        <CardHeader>
          <strong>Customer Profile</strong>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(this.submit)}>
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
                    name={'Company'}
                    type="text"
                    component={renderField}
                    label="company"
                    validate={required}
                    edit={edit}
                  />
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label htmlFor="full-name">Full Name</Label>
                  <Field
                    name={'Contact'}
                    type="text"
                    component={renderField}
                    label="company"
                    validate={required}
                    edit={edit}
                  />
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label htmlFor="full-name">Email</Label>
                  <Field
                    name={'EMAIL'}
                    type="text"
                    component={renderField}
                    label="company"
                    
                    edit={edit}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col sm="4">
                <FormGroup>
                  <Label htmlFor="companyName">Payment Method</Label>
                  <Field
                    name={'PaymentMethod'}
                    type="text"
                    component={renderDropdownList}
                    data={paymentTypes}
                    valueField="NAME"
                    textField="NAME"
                    label="company"
                    validate={required}
                    edit={edit}
                  />
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label htmlFor="full-name">Shipping Method</Label>
                  <Field
                    name={'Ship_Via'}
                    component={renderDropdownList}
                    data={shippingMethods}
                    valueField="NAME"
                    textField="NAME"
                    validate={required}
                    edit={edit}
                  />
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label htmlFor="full-name">Sales Rep</Label>
                  <Field
                    name={'sale'}
                    component={renderDropdownList}
                    data={salesReps}
                    valueField="id"
                    textField="fullName"
                    validate={required}
                    edit={edit}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="4">
                <FormGroup>
                  <Label htmlFor="companyName">Payment Terms</Label>
                  <Field
                    name={'PMT_TERMS'}
                    type="text"
                    component={renderDropdownList}
                    data={paymentTerms}
                    valueField="NAME"
                    textField="NAME"
                    label="company"
                    validate={required}
                    edit={edit}
                  />
                </FormGroup>
              </Col>
              <Col sm="2">
                <FormGroup>
                  <Label htmlFor="full-name">Sales Tax (%)</Label>
                  <Field
                    name={'TaxRate'}
                    type="text"
                    component={renderField}
                    label="tax_rate"
                    validate={required}
                    edit={edit}
                  />
                </FormGroup>
              </Col>
              <Col sm="2">
                <FormGroup>
                  <Label htmlFor="companyName">Taxable?</Label>
                  <Field
                    name={'Taxable'}
                    type="text"
                    component={renderCheckboxToggle}
                    edit={edit}
                  />
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <Label htmlFor="full-name">Discount (%)</Label>
                  <Field
                    name={'Discount'}
                    type="text"
                    component={renderField}
                    label="tax_rate"
                    validate={required}
                    edit={edit}
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
                    name={'Address1'}
                    type="text"
                    component={renderField}
                    label="company"
                    edit={edit}
                    validate={required}
                  />
                </FormGroup>
              </Col>

              <Col xs="6">
                <FormGroup>
                  <Label htmlFor="address2">Address 2</Label>
                  <Field
                    name={'Address2'}
                    type="text"
                    component={renderField}
                    label="company"
                    edit={edit}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="city">City</Label>
                  <Field
                    name={'City'}
                    type="text"
                    component={renderField}
                    label="company"
                    edit={edit}
                    validate={required}
                  />
                </FormGroup>
              </Col>
              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="state">State</Label>
                  <Field
                    name={'State'}
                    type="text"
                    component={renderField}
                    label="company"
                    edit={edit}
                    validate={required}
                  />
                </FormGroup>
              </Col>
              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="zipcode">Zip Code</Label>
                  <Field
                    name={'Zip'}
                    type="text"
                    component={renderField}
                    label="company"
                    edit={edit}
                    validate={required}
                  />
                </FormGroup>
              </Col>
              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Field
                    name={'Phone1'}
                    type="text"
                    component={renderField}
                    label="company"
                    edit={edit}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="phone">Fax Number</Label>
                  <Field
                    name={'Fax'}
                    type="text"
                    component={renderField}
                    label="fax"
                    edit={edit}
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
                    name={'Shipping_Address1'}
                    type="text"
                    component={renderField}
                    label="company"
                    edit={edit}
                  />
                </FormGroup>
              </Col>

              <Col xs="6">
                <FormGroup>
                  <Label htmlFor="address2">Address 2</Label>
                  <Field
                    name={'Shipping_Address2'}
                    type="text"
                    component={renderField}
                    label="company"
                    edit={edit}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="city">City</Label>
                  <Field
                    name={'Shipping_City'}
                    type="text"
                    component={renderField}
                    label="company"
                    edit={edit}
                  />
                </FormGroup>
              </Col>
              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="state">State</Label>
                  <Field
                    name={'Shipping_State'}
                    type="text"
                    component={renderField}
                    label="company"
                    edit={edit}
                  />
                </FormGroup>
              </Col>
              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="zipcode">Zip Code</Label>
                  <Field
                    name={'Shipping_Zip'}
                    type="text"
                    component={renderField}
                    label="company"
                    edit={edit}
                  />
                </FormGroup>
              </Col>
              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Field
                    name={'Shipping_Phone'}
                    type="text"
                    component={renderField}
                    label="company"
                    edit={edit}
                  />
                </FormGroup>
              </Col>
            </Row>

            <hr />

            <Row>
              <Col>
                <FormGroup>
                  <h6>Extra Notes</h6>
                  <Field
                    name={'Notes'}
                    type="text"
                    component={renderField}
                    label="notes"
                    edit={edit}
                  />
                </FormGroup>
              </Col>
            </Row>

            <div>
              <Button type="submit" color="primary" size="lg">
                    Submit
              </Button>
              <Button type="cancel" color="danger" size="lg" onClick={this.props.onEdit}>
                    Cancel
              </Button>
            </div>
  

          </form>
        </CardBody>
      </Card>

    </div>
  );
}
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: ownProps.selectedCompanies,
  salesReps: state.sales.salesReps,
  shippingMethods: state.misc_items.shippingMethods,
  test: ownProps,
  paymentTerms: state.misc_items.paymentTerms,
  paymentTypes: state.misc_items.paymentTypes
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateCustomer,
      submitCustomer
    },
    dispatch
  );

Edit = reduxForm({
  form: 'NewCustomer',
  enableReinitialize: true
})(Edit);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Edit);
