import React, { Component, Fragment } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  FormText,
} from 'reactstrap';
import toPercent from 'decimal-to-percent'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  reduxForm,
  Field,
} from 'redux-form';
import DropdownList from 'react-widgets/lib/DropdownList';
import { updateCustomer } from '../../../../../redux/customers/actions'

import { renderField, renderDropdownList } from '../../../../../components/RenderInputs/renderInputs'

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
    const id = values.id

    const data = {
      ...values,
      Ship_Via: values.Ship_Via.Name,
      sale: values.sale.id
    }
    await this.props.updateCustomer(id, data)
    await this.props.onEdit()
  };

  render() {

    const props = this.props

    const {
      handleSubmit,
      salesReps,
      shippingMethods,
      edit
    } = this.props;


    return (
      <div className="animated resize">
        <Row>
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
                  <Col sm="3">
                    <FormGroup>
                      <Label htmlFor="companyName">Payment Method</Label>
                      <Field
                        name={'PaymentMethod'}
                        type="text"
                        component={renderField}
                        label="company"
                        edit={edit}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="3">
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
                  <Col sm="3">
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
                  <Col sm="3">
                    <FormGroup>
                      <Label htmlFor="full-name">Sales Tax</Label>
                      <Field
                        name={'TaxRate'}
                        type="text"
                        component={renderField}
                        label="tax_rate"
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
                        component={renderField}
                        label="company"
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
                      <Input disabled={edit} />
                    </FormGroup>
                  </Col>
                </Row>

                {edit ? 
                <div>
                  <Button onClick={this.props.onEdit} color="primary" size="lg">
                    Edit
                  </Button>
                </div> :
                <div>
                  <Button color="primary" size="lg">
                    Submit
                  </Button>
                  <Button color="primary" size="lg" onClick={this.props.onEdit}>
                    Cancel
                  </Button>
                </div>
              }

              </form>
            </CardBody>
          </Card>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: ownProps.selectedCompanies,
  salesReps: state.Orders.salesReps,
  shippingMethods: state.misc_items.shippingMethods,
  test: ownProps
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateCustomer
    },
    dispatch
  );

Edit = reduxForm({
  form: 'CustomerEdit',
  enableReinitialize: true
})(Edit);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Edit);
