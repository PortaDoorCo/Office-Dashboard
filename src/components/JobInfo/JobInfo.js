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
import {
  totalDiscountSelector,
  totalSelector,
  rushTotal,
} from '../../selectors/pricing';

// momentLocaliser(moment);

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

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
      disabled={!edit}
    />
  </div>
);

class JobInfo extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    // this.saveEmails = this.saveEmails.bind(this);
    this.scheduleDueDate = this.scheduleDueDate.bind(this);
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

  async componentDidUpdate(prevProps) {
    const { formState, orderType, total } = this.props;
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
      // if (formState.job_info?.Rush !== prevProps.formState?.job_info?.Rush) {
      //   if (formState.job_info.Sample) {
      //     this.props.dispatch(change('Order', 'discount', 0));
      //   } else {
      //     await this.props.dispatch(change('Order', 'discount', 0));
      //     await sleep(500);
      //     await this.props.dispatch(
      //       change('Order', 'misc_items', [
      //         ...formState?.misc_items,
      //         {
      //           qty: 1,
      //           item2: 'RUSH',
      //           price: total / 2 > 150 ? total / 2 : 150,
      //           category: 'custom',
      //           pricePer: total / 2 > 150 ? total / 2 : 150,
      //         },
      //       ])
      //     );
      //   }
      // }
      if (
        formState?.job_info?.customer?.id !==
        prevProps.formState?.job_info?.customer?.id
      ) {
        const customer = formState?.job_info?.customer;

        if (customer?.Notes?.length) {
          this.props.toggleReminderModal();
        }

        this.props.dispatch(
          change('Order', 'job_info.salesRep', customer.sale)
        );

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
        this.props.dispatch(change('Order', 'job_info.EMAIL', customer.EMAIL));
        this.props.dispatch(
          change('Order', 'job_info.Email2', customer.Email2)
        );
        this.props.dispatch(
          change('Order', 'job_info.Email3', customer.Email3)
        );
        this.props.dispatch(
          change('Order', 'job_info.Email4', customer.Email4)
        );
        this.props.dispatch(
          change('Order', 'job_info.Email5', customer.Email5)
        );
        this.props.dispatch(
          change('Order', 'job_info.Email6', customer.Email6)
        );

        this.props.dispatch(
          change('Order', 'job_info.Contact1', customer.Contact1)
        );
        this.props.dispatch(
          change('Order', 'job_info.Contact2', customer.Contact1)
        );
        this.props.dispatch(
          change('Order', 'job_info.Contact3', customer.Contact1)
        );
        this.props.dispatch(
          change('Order', 'job_info.Contact4', customer.Contact1)
        );
        this.props.dispatch(
          change('Order', 'job_info.Contact5', customer.Contact1)
        );
        this.props.dispatch(
          change('Order', 'job_info.Contact6', customer.Contact6)
        );

        this.props.dispatch(
          change('Order', 'job_info.Phone1', customer.Phone1)
        );
        this.props.dispatch(
          change('Order', 'job_info.Phone2', customer.Phone2)
        );
        this.props.dispatch(
          change('Order', 'job_info.Phone3', customer.Phone3)
        );
        this.props.dispatch(
          change('Order', 'job_info.Phone4', customer.Phone4)
        );
        this.props.dispatch(
          change('Order', 'job_info.Phone5', customer.Phone5)
        );
        this.props.dispatch(
          change('Order', 'job_info.Phone6', customer.Phone6)
        );

        this.props.dispatch(change('Order', 'job_info.Fax', customer.Fax));

        this.props.dispatch(change('Order', 'job_info.Note1', customer.Note1));
        this.props.dispatch(change('Order', 'job_info.Note2', customer.Note2));
        this.props.dispatch(change('Order', 'job_info.Note3', customer.Note3));
        this.props.dispatch(change('Order', 'job_info.Note4', customer.Note4));
        this.props.dispatch(change('Order', 'job_info.Note5', customer.Note5));
        this.props.dispatch(change('Order', 'job_info.Note6', customer.Note6));

        this.props.dispatch(change('Order', 'Taxable', customer.Taxable));

        if (orderType === 'Misc Items' || orderType === 'Mouldings') {
          this.props.dispatch(change('Order', 'discount', 0));
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

  scheduleDueDate() {
    const { formState, edit } = this.props;

    if (edit) {
      if (
        !formState?.job_info?.Shipping_Scheduled &&
        (formState?.job_info?.status === 'Quote' ||
          formState?.job_info?.status?.value === 'Quote')
      ) {
        this.props.dispatch(
          change('Order', 'job_info.status', {
            label: 'Ordered',
            value: 'Ordered',
          })
        );
      } else {
        return null;
      }
    }
  }

  // saveEmails() {
  //   const { formState, saveEmail, cookie } = this.props;

  //   const jobInfo = formState?.job_info;
  //   const customer = formState?.job_info?.customer;

  //   console.log('EMMMMAIIILL');

  //   const emails = {
  //     EMAIL: jobInfo.EMAIL,
  //     Email2: jobInfo.Email2,
  //     Email3: jobInfo.Email3,
  //     Email4: jobInfo.Email4,
  //     Email5: jobInfo.Email5,
  //     Email6: jobInfo.Email6,
  //   };

  //   saveEmail(customer?.id, emails, cookie);
  // }

  rushOrder = async (e) => {
    const { formState, total, totalDiscount } = this.props;

    if (!formState?.job_info?.Rush) {
      await this.props.dispatch(change('Order', 'discount', 0));
      await this.props.dispatch(
        change('Order', 'misc_items', [
          ...formState?.misc_items,
          {
            qty: 1,
            item2: 'RUSH',
            price: total / 2 > 150 ? total / 2 : 150,
            category: 'custom',
            pricePer: total / 2 > 150 ? total / 2 : 150,
          },
        ])
      );
    } else {
      await this.props.dispatch(
        change(
          'Order',
          'discount',
          formState?.job_info?.customer?.Discount || 0
        )
      );
    }
  };

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
      orders,
    } = this.props;

    const dateDifference = moment(new Date()).businessDiff(
      moment(formState && formState.job_info && formState.job_info.DueDate)
    );

    const salesCompanies = customers?.filter(
      (x) => x?.sale?.id === user?.sale?.id
    );

    return (
      <div className="job-info-tour">
        <Row>
          <Col lg="10">
            <FormGroup>
              <Label htmlFor="dueDate">Due Date Scheduled</Label>
              <Field
                name="Shipping_Scheduled"
                component={renderCheckboxToggle}
                edit={edit}
                onClick={this.scheduleDueDate}
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
              <Field
                name="Rush"
                component={renderCheckboxToggle}
                edit={edit}
                onClick={(e) => this.rushOrder(e)}
              />
            </FormGroup>
          </Col>
        </Row>

        {/* {formState?.Shipping_Scheduled &&
        (role?.type === 'authenticated' ||
          role?.type === 'owner' ||
          role?.type === 'administrator' ||
          role?.type === 'management' ||
          role?.type === 'office') ? (
            <Row>
              <Col lg="9" />
              <Col>
                <FormGroup>
                  <Label htmlFor="dueDate">Date Shipped</Label>
                  <Field
                    name="DateShipped"
                    showTime={true}
                    component={renderDateTimePicker}
                    edit={edit}
                  />
                </FormGroup>
              </Col>
            </Row>
          ) : null} */}

        <Row className="mb-3">
          <Col lg="3">
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

          {/* {role?.type === 'authenticated' ||
          role?.type === 'owner' ||
          role?.type === 'administrator' ||
          role?.type === 'management' ||
          role?.type === 'office' ? 
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
            </Col> : null
          }  */}

          <Col lg="6" />

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
                  role?.type === 'management' ||
                  role?.type === 'office'
                    ? status
                    : otherStatus
                }
                dataKey="value"
                edit={
                  role?.type === 'authenticated' ||
                  role?.type === 'owner' ||
                  role?.type === 'administrator' ||
                  role?.type === 'management' ||
                  role?.type === 'office'
                    ? edit
                    : false
                }
                textField="value"
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
                edit={false}
                label="Notes"
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
          <Col>
            <FormGroup>
              <Label htmlFor="dueDate">Sales Rep</Label>
              <Field
                name="salesRep"
                component={renderDropdownList}
                data={sales}
                edit={
                  formState?.job_info?.customer?.id === 1 ||
                  role?.type === 'owner' ||
                  role?.type === 'administrator' ||
                  role?.type === 'management'
                    ? edit
                    : false
                }
                validate={required}
                textField="fullName"
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
          More Info
        </Button>

        <Collapse isOpen={this.state.collapse}>
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
                  // normalize={normalizePhone}
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
                  // normalize={normalizePhone}
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
                  // normalize={normalizePhone}
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
                  // normalize={normalizePhone}
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
                <Label htmlFor="phone">Name</Label>
                <Field
                  name={'Contact5'}
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
                  name={'Phone5'}
                  type="text"
                  component={renderField}
                  label="company"
                  edit={edit}
                  // normalize={normalizePhone}
                />
              </FormGroup>
            </Col>
            <Col sm="3">
              <FormGroup>
                <Label htmlFor="phone">Email</Label>
                <Field
                  name={'Email5'}
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
                  name={'Note5'}
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
                  name={'Contact6'}
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
                  name={'Phone6'}
                  type="text"
                  component={renderField}
                  label="company"
                  edit={edit}
                  // normalize={normalizePhone}
                />
              </FormGroup>
            </Col>
            <Col sm="3">
              <FormGroup>
                <Label htmlFor="phone">Email</Label>
                <Field
                  name={'Email6'}
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
                  name={'Note6'}
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
                  // normalize={normalizePhone}
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
  orderType: state.Orders.orderType,
  orders: state.Orders.orders,
  total: rushTotal(state),
  totalDiscount: totalDiscountSelector(state),
});

export default connect(mapStateToProps, null)(JobInfo);
