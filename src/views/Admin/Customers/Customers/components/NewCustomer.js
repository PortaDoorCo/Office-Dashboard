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
  Collapse
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  reduxForm,
  Field,
  change,
  getFormValues
} from 'redux-form';
import { updateCustomer, submitCustomer } from '../../../../../redux/customers/actions';
import { renderField, renderDropdownList, renderCheckboxToggle, renderDropdownListFilter } from '../../../../../components/RenderInputs/renderInputs';
import Cookies from 'js-cookie';
import 'react-phone-number-input/style.css';
import normalizePhone from './normalizerPhone';
import states from '../../AddCustomer/states';
import FileUploader from '../../../../../components/FileUploader/FileUploader';

const cookie = Cookies.get('jwt');
const required = value => (value ? undefined : 'Required');

class Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Company: [],
      Contact: [],
      contactInfo: false,
      files: []
    };
  }

handleChange = e => {
  this.setState({ [e.target.name]: e.target.value });
};

toggleInfo = () => {
  this.setState({
    contactInfo: !this.state.contactInfo
  });
}

onUploaded = (e) => {
  const id = e.map((i) => i.id);
  const a = [...this.state.files, id];
  this.setState({ files: a });
};


submit = async (values, e) => {

  const data = {
    ...values,
    Company: values.Company.toUpperCase(),
    State: values.State && values.State.abbreviation,
    Shipping_State: values.Shipping_State && values.Shipping_State.abbreviation,
    PMT_TERMS: values.PMT_TERMS.NAME,
    files: this.state.files,
  };


  await this.props.submitCustomer(data, cookie);
  await this.props.reset();
  await this.props.toggle();
};

sameShipping = () => {
  
  const { formState, dispatch } = this.props;

  dispatch(
    change(
      'NewCustomer',
      'Shipping_Address1',
      formState && formState.Address1
    )
  );

  dispatch(
    change(
      'NewCustomer',
      'Shipping_Address2',
      formState && formState.Address2
    )
  );

  dispatch(
    change(
      'NewCustomer',
      'Shipping_Address2',
      formState && formState.Address2
    )
  );

  dispatch(
    change(
      'NewCustomer',
      'Shipping_City',
      formState && formState.City
    )
  );

  dispatch(
    change(
      'NewCustomer',
      'Shipping_State',
      formState && formState.State
    )
  );

  dispatch(
    change(
      'NewCustomer',
      'Shipping_Zip',
      formState && formState.Zip
    )
  );

  dispatch(
    change(
      'NewCustomer',
      'Shipping_Phone',
      formState && formState.Phone1
    )
  );

  

}

render() {

  const {
    handleSubmit,
    salesReps,
    shippingMethods,
    edit,
    paymentTerms
  } = this.props;

  return (
    <div className="animated resize">
      <Row>
        <Col />
        <Col sm="9">
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
                  <Col sm="6">
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
                  <Col sm="6">
                    <FormGroup>
                      <Label htmlFor="full-name">Contact Name</Label>
                      <Field
                        name={'Contact'}
                        type="text"
                        component={renderField}
                        label="company"
                        // validate={required}
                        edit={edit}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col sm="6">
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
                  <Col sm="6">
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
                </Row>
                <Row>
                
                  <Col sm="6">
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

                  <Col sm="6">
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

                <Row>
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
                </Row>

                <hr />


                <Button color='primary' onClick={this.toggleInfo} className="mb-3">More Info</Button>
                <Collapse isOpen={this.state.contactInfo}>

                  <Row>
                    <Col xs="12">
                      <h6>Contact Info</h6>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm="3">
                      <FormGroup>
                        <Label htmlFor="phone">Name</Label>
                        <Field
                          name={'Contact1'}
                          type="text"
                          component={renderField}
                          label="company"
                          edit={edit}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label htmlFor="phone">Phone</Label>
                        <Field
                          name={'Phone1'}
                          type="text"
                          component={renderField}
                          label="company"
                          edit={edit}
                          normalize={normalizePhone}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label htmlFor="phone">Email</Label>
                        <Field
                          name={'EMAIL'}
                          type="text"
                          component={renderField}
                          label="fax"
                          edit={edit}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label htmlFor="phone">Note</Label>
                        <Field
                          name={'Note1'}
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
                        <Label htmlFor="phone">Name</Label>
                        <Field
                          name={'Contact2'}
                          type="text"
                          component={renderField}
                          label="company"
                          edit={edit}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label htmlFor="phone">Phone</Label>
                        <Field
                          name={'Phone2'}
                          type="text"
                          component={renderField}
                          label="company"
                          edit={edit}
                          normalize={normalizePhone}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label htmlFor="phone">Email</Label>
                        <Field
                          name={'Email2'}
                          type="text"
                          component={renderField}
                          label="fax"
                          edit={edit}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label htmlFor="phone">Note</Label>
                        <Field
                          name={'Note2'}
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
                        <Label htmlFor="phone">Name</Label>
                        <Field
                          name={'Contact3'}
                          type="text"
                          component={renderField}
                          label="company"
                          edit={edit}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label htmlFor="phone">Phone</Label>
                        <Field
                          name={'Phone3'}
                          type="text"
                          component={renderField}
                          label="company"
                          edit={edit}
                          normalize={normalizePhone}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label htmlFor="phone">Email</Label>
                        <Field
                          name={'Email3'}
                          type="text"
                          component={renderField}
                          label="fax"
                          edit={edit}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label htmlFor="phone">Note</Label>
                        <Field
                          name={'Note3'}
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
                        <Label htmlFor="phone">Name</Label>
                        <Field
                          name={'Contact4'}
                          type="text"
                          component={renderField}
                          label="company"
                          edit={edit}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label htmlFor="phone">Phone</Label>
                        <Field
                          name={'Phone4'}
                          type="text"
                          component={renderField}
                          label="company"
                          edit={edit}
                          normalize={normalizePhone}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label htmlFor="phone">Email</Label>
                        <Field
                          name={'Email4'}
                          type="text"
                          component={renderField}
                          label="fax"
                          edit={edit}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label htmlFor="phone">Note</Label>
                        <Field
                          name={'Note4'}
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
                        <Label htmlFor="phone">Fax Number</Label>
                        <Field
                          name={'Fax'}
                          type="text"
                          component={renderField}
                          label="fax"
                          edit={edit}
                          normalize={normalizePhone}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* <Row>
                  <Col xs="12">
                    <h6>Email</h6>
                  </Col>
                </Row>

                <Row>
                  <Col sm="4">
                    <FormGroup>
                      <Label htmlFor="phone">Email 1</Label>
                      <Field
                        name={'EMAIL'}
                        type="text"
                        component={renderField}
                        label="company"
                        edit={edit}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="4">
                    <FormGroup>
                      <Label htmlFor="phone">Email 2</Label>
                      <Field
                        name={'EMAIL2'}
                        type="text"
                        component={renderField}
                        label="company"
                        edit={edit}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="4">
                    <FormGroup>
                      <Label htmlFor="phone">Email 3</Label>
                      <Field
                        name={'EMAIL3'}
                        type="text"
                        component={renderField}
                        label="company"
                        edit={edit}
                      />
                    </FormGroup>
                  </Col>
                </Row> */}
                </Collapse>

            
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
                  <Col xs="4">
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
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="state">State</Label>
                      <Field
                        name={'State'}
                        type="text"
                        data={states}
                        component={renderDropdownListFilter}
                        valueField="abbreviation"
                        textField="abbreviation"
                        label="company"
                        edit={edit}
                        validate={required}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="4">
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
                        data={states}
                        component={renderDropdownListFilter}
                        valueField="abbreviation"
                        textField="abbreviation"
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
                      <Label htmlFor="phone">Shipping Phone</Label>
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

                <Row>
                  <Col>
                    <Button color="primary" onClick={() => this.sameShipping()}>Same As Billing</Button>
                  </Col>
                </Row>

                <hr />

                <Row>
                  <Col>
                    <FormGroup>
                      <h6>Reminder</h6>
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
                <Row>
                  <Col>
                    <Card>
                      <CardBody>
                        <FormGroup>
                          <h3>Attachments</h3>
                          <FileUploader
                            onUploaded={this.onUploaded}
                            multi={true}
                          />
                        </FormGroup>
                      </CardBody>
                    </Card>
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
        </Col>
        <Col />
      </Row>


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
  paymentTypes: state.misc_items.paymentTypes,
  formState: getFormValues('NewCustomer')(state),
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
