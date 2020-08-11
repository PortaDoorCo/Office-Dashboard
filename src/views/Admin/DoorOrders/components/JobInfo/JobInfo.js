import React, { Component } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Label
} from 'reactstrap';
import { Field, change, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import { renderField, renderDropdownList, renderDropdownListFilter } from '../../../../../components/RenderInputs/renderInputs';

momentLocaliser(moment);


const status = ['Quote', 'Ordered', 'Shipped', 'RUSH'];

const required = value => value ? undefined : 'Required';


const renderDateTimePicker = ({ input: { onChange, value }, showTime }) =>
  <DateTimePicker
    onChange={onChange}
    time={showTime}
    value={!value ? null : new Date(value)}
  />;


class JobInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentDidUpdate(prevProps) {
    const { formState } = this.props;
    if (formState && formState.job_info && formState.job_info.customer) {
      if (formState.job_info.customer !== prevProps.formState.job_info.customer) {

        const customer = formState.job_info.customer;

        this.props.dispatch(
          change(
            'DoorOrder',
            'job_info.Address1',
            customer.Shipping_Address1 || customer.Address1
          )
        );
        this.props.dispatch(
          change(
            'DoorOrder',
            'job_info.Address2',
            customer.Shipping_Address2 || customer.Address2
          )
        );
        this.props.dispatch(
          change(
            'DoorOrder',
            'job_info.City',
            customer.Shipping_City || customer.City
          )
        );
        this.props.dispatch(
          change(
            'DoorOrder',
            'job_info.State',
            customer.Shipping_State || customer.State
          )
        );
        this.props.dispatch(
          change(
            'DoorOrder',
            'job_info.Zip',
            customer.Shipping_Zip || customer.Zip
          )
        );
        this.props.dispatch(
          change(
            'DoorOrder',
            'job_info.Phone',
            customer.Shipping_Phone || customer.Phone1
          )
        );
        this.props.dispatch(
          change(
            'DoorOrder',
            'discount',
            customer.Discount
          )
        );
      }
    }
  }


  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }


  render() {
    const { customers, shippingMethods } = this.props;



    return (
      <div>
        <Row className="mb-3">
          <Col>
            <FormGroup>
              <Label htmlFor="dueDate">Due Date</Label>

              <Field
                name="DueDate"
                showTime={false}
                component={renderDateTimePicker}
              />
              <p>7 Business Day Lead Time</p>
            </FormGroup>
          </Col>
          <Col xs="5" />
          <Col xs='3'>
            <FormGroup>
              <Label htmlFor="shipping_method">Shipping Method</Label>
              <Field
                name="ShippingMethod"
                component={renderDropdownList}
                data={shippingMethods}
                valueField="value"
                textField="NAME" />
            </FormGroup>
          </Col>
        </Row>



        <Row>
          <Col xs="3">
            <FormGroup>
              <Label htmlFor="jobName">Job Name</Label>
              <Field
                name='jobName'
                type="text"
                component={renderField}
                label="JobName" />
            </FormGroup>
          </Col>
          <Col xs="5">
            <FormGroup>
              <Label htmlFor="companyName">Customers</Label>
              <Field
                name="customer"
                component={renderDropdownListFilter}
                data={customers}
                valueField="value"
                textField="Company"
                validate={required} />

            </FormGroup>
          </Col>
          <Col xs="2">
            <FormGroup>
              <Label htmlFor="status">Status</Label>
              <Field
                name="status"
                component={renderDropdownList}
                data={status}
                valueField="value"
                textField="name"
              />
            </FormGroup>
          </Col>
          <Col xs="2">
            <FormGroup>
              <Label htmlFor="poNum">PO #</Label>
              <Field
                name="poNum"
                component={renderField}
                valueField="value"
                textField="name"
              />
            </FormGroup>
          </Col>
        </Row>

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
                name='Address1'
                type="text"
                component={renderField}
                label="Address1" />
            </FormGroup>
          </Col>





          <Col xs="6">
            <FormGroup>
              <Label htmlFor="address2">Address 2</Label>
              <Field
                name='Address2'
                type="text"
                component={renderField}
                label="Address2" />
            </FormGroup>
          </Col>

        </Row>



        <Row>
          <Col xs="3">
            <FormGroup>
              <Label htmlFor="city">City</Label>
              <Field
                name='City'
                type="text"
                component={renderField}
                label="City" />
            </FormGroup>
          </Col>
          <Col xs="3">
            <FormGroup>
              <Label htmlFor="state">State</Label>
              <Field
                name='State'
                type="text"
                component={renderField}
                label="State" />
            </FormGroup>
          </Col>
          <Col xs="3">
            <FormGroup>
              <Label htmlFor="zipcode">Zip Code</Label>
              <Field
                name='Zip'
                type="text"
                component={renderField}
                label="Zip" />
            </FormGroup>
          </Col>
          <Col xs="3">
            <FormGroup>
              <Label htmlFor="phone">Phone Number</Label>
              <Field
                name='Phone'
                type="text"
                component={renderField}
                label="Phone" />
            </FormGroup>
          </Col>
        </Row>

        <hr />


      </div>
    );
  }
}


const mapStateToProps = state => ({
  formState: getFormValues('DoorOrder')(state),
  shippingMethods: state.misc_items.shippingMethods
});


export default connect(
  mapStateToProps,
  null
)(JobInfo);



