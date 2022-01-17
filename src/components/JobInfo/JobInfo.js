import moment from 'moment-business-days';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-widgets/DatePicker';
import {
  Col,
  FormGroup,
  Label,
  Row,
  Button,
  Collapse,
  Card,
  CardBody,
  Input,
} from 'reactstrap';
import { change, Field, getFormValues } from 'redux-form';
import status from '../../utils/productionStatus';
// import momentLocaliser from 'react-widgets-moment';
import {
  renderCheckboxToggle,
  renderDropdownList,
  renderDropdownListNoPhoto,
  renderField,
  renderTextField,
} from '../RenderInputs/renderInputs';
import CustomerReminder from './CustomerReminder';
import otherStatus from '../../utils/other_status';
import orderEntryStatus from '../../utils/orderEntryStatus';

// momentLocaliser(moment);

const required = (value) => (value ? undefined : 'Required');

const renderDateTimePicker = ({
  input: { onChange, value },
  showTime,
  edit,
}) => (
  <div>
    <DatePicker
      onChange={onChange}
      time={showTime}
      value={!value ? null : new Date(value)}
      disabled={edit}
    />
  </div>
);

class JobInfo extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      loaded: false,
      collapse: false,
      dynamicStatus: orderEntryStatus,
    };
  }

  componentDidMount() {
    const { isEdit, formState } = this.props;

    const dateOrdered = formState?.tracking?.filter((x) => {
      return x.status === 'Ordered';
    });

    if (isEdit) {
      if (formState?.job_info?.Shipping_Scheduled) {
        return;
      } else {
        let dueDate = moment(new Date()).businessAdd(21)._d;

        if (formState?.DateOrdered || dateOrdered.length > 0) {
          dueDate = moment(
            new Date(formState?.DateOrdered || dateOrdered[0]?.date)
          ).businessAdd(21)._d;
        }

        this.props.dispatch(change('Order', 'job_info.DueDate', dueDate));
      }

    }


  }

  componentDidUpdate(prevProps) {
    const { formState } = this.props;
    if (formState?.job_info?.customer) {
      if (
        formState.job_info?.Sample !== prevProps.formState?.job_info?.Sample
      ) {
        if (formState.job_info.Sample) {
          this.props.dispatch(change('Order', 'discount', 50));
        } else {
          this.props.dispatch(
            change(
              'Order',
              'discount',
              formState?.job_info?.customer?.Discount || 0
            )
          );
        }
      }
      if (
        formState?.job_info?.customer?.id !==
        prevProps.formState?.job_info?.customer?.id
      ) {
        const customer = formState?.job_info?.customer;

        if (customer?.Notes !== '') {
          this.props.toggleReminderModal();
        }

        this.props.dispatch(
          change(
            'Order',
            'job_info.Address1',
            customer.Shipping_Address1 || customer.Address1
          )
        );
        this.props.dispatch(
          change(
            'Order',
            'job_info.Address2',
            customer.Shipping_Address2 || customer.Address2
          )
        );
        this.props.dispatch(
          change(
            'Order',
            'job_info.City',
            customer.Shipping_City || customer.City
          )
        );
        this.props.dispatch(
          change(
            'Order',
            'job_info.State',
            customer.Shipping_State || customer.State
          )
        );
        this.props.dispatch(
          change('Order', 'job_info.Zip', customer.Shipping_Zip || customer.Zip)
        );
        this.props.dispatch(
          change(
            'Order',
            'job_info.Phone',
            customer.Shipping_Phone || customer.Phone1
          )
        );
        this.props.dispatch(change('Order', 'Taxable', customer.Taxable));

        if (formState.job_info.Sample) {
          this.props.dispatch(change('Order', 'discount', 50));
        } else {
          this.props.dispatch(change('Order', 'discount', customer.Discount));
        }

        this.props.dispatch(change('Order', 'job_info.Notes', customer.Notes));
      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  toggle() {
    this.setState({ collapse: !this.state?.collapse });
  }

  render() {
    const {
      customers,
      edit,
      shippingMethods,
      formState,
      role,
      user,
      sales,
      paymentTerms,
    } = this.props;

    const dateDifference = moment(new Date()).businessDiff(
      moment(formState && formState.job_info && formState.job_info.DueDate)
    );

    const salesCompanies = customers?.filter(
      (x) => x?.sale?.id === user?.sale?.id
    );

    return (
      <div className="job-info-tour">
        <CustomerReminder
          {...this.props}
          toggle={this.props.toggleReminderModal}
          modal={this.props.customerReminder}
        />
        <Row>
          <Col lg="10">
            <FormGroup>
              <Label htmlFor="dueDate">Due Date Scheduled</Label>
              <Field
                name="Shipping_Scheduled"
                component={renderCheckboxToggle}
                edit={edit}
              />
            </FormGroup>
          </Col>
          <Col lg="1">
            <FormGroup>
              <Label htmlFor="dueDate">Sample</Label>
              <Field
                name="Sample"
                component={renderCheckboxToggle}
                edit={edit}
              />
            </FormGroup>
          </Col>
          <Col lg="1">
            <FormGroup>
              <Label htmlFor="dueDate">Rush</Label>
              <Field name="Rush" component={renderCheckboxToggle} edit={edit} />
            </FormGroup>
          </Col>
        </Row>


        <Row className="mb-3">
          <Col lg='3'>
            <FormGroup>
              <Label htmlFor="dueDate">Due Date</Label>
              <Field
                name="DueDate"
                showTime={false}
                component={renderDateTimePicker}
                edit={edit}
              />
              <p>{dateDifference} Business Day Lead Time</p>
            </FormGroup>
          </Col>

          {formState?.DateOrdered && (role?.type === 'authenticated' ||
            role?.type === 'owner' ||
            role?.type === 'administrator' ||
            role?.type === 'management') ? 
            <Col lg="3">
              <FormGroup>
                <Label htmlFor="dueDate">Date Ordered</Label>
                <Field
                  name="DateOrdered"
                  showTime={true}
                  component={renderDateTimePicker}
                  edit={edit}
                />
              </FormGroup>
            </Col> : <Col lg='3' />
          }



          <Col lg='3' />

          <Col xs="3">
            <FormGroup>
              <Label htmlFor="shipping_method">Shipping Method</Label>
              <Field
                name="shipping_method"
                component={renderDropdownList}
                data={shippingMethods}
                dataKey="value"
                edit={edit}
                validate={required}
                textField="NAME"
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>

        </Row>

        <Row>
          <Col xs="7">
            <FormGroup>
              <Label htmlFor="companyName">Customers</Label>
              <Field
                name="customer"
                component={renderDropdownListNoPhoto}
                data={role?.type === 'sales' ? salesCompanies : customers}
                dataKey="value"
                textField="Company"
                edit={edit}
                validate={required}
              />
            </FormGroup>
          </Col>
          <Col xs="3">
            <FormGroup>
              <Label htmlFor="poNum">PO #</Label>
              <Field
                name="poNum"
                component={renderField}
                dataKey="value"
                textField="name"
                edit={edit}
                validate={required}
              />
            </FormGroup>
          </Col>
          <Col xs="2">
            <FormGroup>
              <Label htmlFor="status">Status</Label>
              <Field
                name="status"
                component={renderDropdownList}
                data={
                  role?.type === 'authenticated' ||
                  role?.type === 'owner' ||
                  role?.type === 'administrator' ||
                  role?.type === 'management'
                    ? status
                    : otherStatus
                }
                dataKey="value"
                edit={edit}
                textField="value"
                // onBlur={(e) => console.log({testtttttttttt: e})}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs="6">
            <FormGroup>
              <Label htmlFor="phone">Customer Note</Label>
              <Field
                name={'Notes'}
                type="text"
                component={renderTextField}
                edit={true}
                label="Notes"
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label htmlFor="dueDate">Sales Rep</Label>
              <Input
                placeholder={
                  formState?.sale?.fullName
                    ? formState?.sale?.fullName
                    : formState?.job_info?.customer?.sale?.fullName
                }
                disabled={true}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label htmlFor="dueDate">Payment Terms</Label>
              <Input
                placeholder={formState?.job_info?.customer?.PMT_TERMS}
                disabled={true}
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
                name="Address1"
                type="text"
                component={renderField}
                edit={edit}
                label="Address1"
              />
            </FormGroup>
          </Col>

          <Col xs="6">
            <FormGroup>
              <Label htmlFor="address2">Address 2</Label>
              <Field
                name="Address2"
                type="text"
                component={renderField}
                edit={edit}
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
                name="City"
                type="text"
                component={renderField}
                edit={edit}
                label="City"
              />
            </FormGroup>
          </Col>
          <Col xs="3">
            <FormGroup>
              <Label htmlFor="state">State</Label>
              <Field
                name="State"
                type="text"
                component={renderField}
                edit={edit}
                label="State"
              />
            </FormGroup>
          </Col>
          <Col xs="3">
            <FormGroup>
              <Label htmlFor="zipcode">Zip Code</Label>
              <Field
                name="Zip"
                type="text"
                component={renderField}
                edit={edit}
                label="Zip"
              />
            </FormGroup>
          </Col>
          <Col xs="3">
            <FormGroup>
              <Label htmlFor="phone">Phone Number</Label>
              <Field
                name="Phone"
                type="text"
                component={renderField}
                edit={edit}
                label="Phone"
              />
            </FormGroup>
          </Col>
        </Row>

        <Button
          color="primary"
          onClick={this.toggle}
          style={{ marginBottom: '1rem' }}
        >
          Show Emails
        </Button>

        <Collapse isOpen={this.state.collapse}>
          <Card>
            <CardBody>
              <p>{formState?.job_info?.customer?.EMAIL}</p>
              <p>{formState?.job_info?.customer?.Email2}</p>
              <p>{formState?.job_info?.customer?.Email3}</p>
              <p>{formState?.job_info?.customer?.Email4}</p>
            </CardBody>
          </Card>
        </Collapse>

        <hr />

        <Row>
          <Col xs="6">
            <FormGroup>
              <Label htmlFor="phone">Shop Notes</Label>
              <Field
                name={'Shop_Notes'}
                type="textarea"
                component={renderTextField}
                edit={edit}
                onKeyPress={(e) => {
                  e.target.keyCode === 13 && e.preventDefault();
                }}
                label="Notes"
              />
            </FormGroup>
          </Col>
        </Row>

        <hr />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  formState: getFormValues('Order')(state),
  shippingMethods: state.misc_items.shippingMethods,
  role: state?.users?.user?.role,
  user: state?.users?.user,
  sales: state?.sales?.salesReps,
  paymentTerms: state.misc_items.paymentTerms,
});

export default connect(mapStateToProps, null)(JobInfo);
