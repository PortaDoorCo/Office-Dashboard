import React, { Component, Suspense } from 'react';
import {
  Row,
  Col,
  Button,
  Card,
  Input,
  CardHeader,
  CardBody,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NotificationAlert from 'react-notification-alert';
import 'react-notifications/lib/notifications.css';
import {
  reduxForm,
  FormSection,
  getFormValues,
  change,
  FieldArray,
  Field
} from 'redux-form';
import { submitOrder } from '../../../redux/orders/actions';
import { loadCustomers } from '../../../redux/customers/actions';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
  totalSelector,
  taxSelector,
  addPriceSelector,
  miscTotalSelector
} from '../../../selectors/drawerPricing';
import moment from 'moment-business-days';
import Cookies from 'js-cookie';
import { renderField, renderCheckboxToggle } from '../../../components/RenderInputs/renderInputs';
import MiscItems from '../../../components/DrawerOrders/MiscItems';
import FileUploader from '../../../components/FileUploader/FileUploader';
import NumberFormat from 'react-number-format';
import { createNumberMask } from 'redux-form-input-masks';

const DrawerBoxInfo = React.lazy(() => import('../../../components/DrawerOrders/DrawerBoxInfo'));
const JobInfo = React.lazy(() => import('../../../components/JobInfo/DrawerJobInfo'));

const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

const cookie = Cookies.get('jwt');
const maxValue = max => value => value && value > max ? `Cannot be greater than ${max}%` : undefined;

const currencyMask = createNumberMask({
  decimalPlaces: 2,
  locale: 'en-US',
});

const dueDate = moment(new Date()).businessAdd(7)._d;

let options = {};
options = {
  place: 'br',
  message: (
    <div>
      <div>Order Submitted Successfuly</div>
    </div>
  ),
  type: 'primary',
  icon: 'now-ui-icons ui-1_bell-53',
  autoDismiss: 3
};

class DoorOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
      loaded: false,
      customerAddress: [],
      files: []
    };
  }

  reloadPage = () => {
    // return this.props.history.push('/dashboard')
    window.location.reload();
  };

  notify = () => {
    this.refs.notify.notificationAlert(options);
  };

  submit = async (values, e) => {
    const {
      reset,
      prices,
      itemPrice,
      subTotal,
      total,
      submitOrder,
      tax,
      user
    } = this.props;

    const orderType = 'Drawer Order';

    const jobInfo = {
      ...values.job_info,
      customer: {
        id: values.job_info.customer.id,
        Company: values.job_info.customer.Company,
        TaxRate: values.job_info.customer.TaxRate,
        sale: values.job_info.customer.sale.id,
        Taxable: values.job_info.customer.Taxable
      },
    };

    const order = {
      ...values,
      status: values.job_info.status,
      Rush: values.job_info.Rush,
      Sample: values.job_info.Sample,
      job_info: jobInfo,
      companyprofile: values.job_info.customer.id,
      linePrice: prices,
      itemPrice: itemPrice,
      subTotals: subTotal,
      tax: tax,
      total: total,
      balance_due: total,
      orderType: orderType,
      dueDate: values.job_info.DueDate,
      Date: new Date(),
      user: user.id,
      userName: user.username,
      files: this.state.files,
      submittedBy: user.FirstName,
      tracking: [
        {
          'status': values.job_info.status,
          'date': new Date()
        }
      ],
      balance_history: [
        {
          'balance_paid': values.balance_paid,
          'date': new Date()
        }
      ],
      sale: values.job_info.customer.sale.id,
    };

    if (values.part_list[0].dimensions.length > 0) {
      submitOrder(order, cookie);
      reset();
      window.scrollTo(0, 0);
    } else {
      e.preventDefault();
    }
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  cancelOrder = e => {
    e.preventDefault();
    this.props.reset();
  };

  onKeyPress(event) {
    if (event.which === 13 /* Enter */) {
      event.preventDefault();
    }
  }

  onUploaded = (e) => {
    const id = e.map(i => (i.id));
    const a = [...this.state.files, id];
    this.setState({ files: a });
  }

  render() {
    const {
      submitted,
      handleSubmit,
      prices,
      subTotal,
      total,
      woodtypes,
      boxBottomWoodtype,
      boxBottoms,
      boxThickness,
      notchDrill,
      scoop,
      dividers,
      drawerFinishes,
      box_assembly,
      customers,
      formState,
      address,
      tax
    } = this.props;

    return (
      <div className="animated fadeIn">
        <NotificationAlert ref="notify" />
        <div className="orderForm">
          <div className="orderFormCol1">
            <Card>
              <CardHeader>
                <strong>Drawer Order</strong>
              </CardHeader>
              <CardBody>
                <form
                  onKeyPress={this.onKeyPress}
                  onSubmit={handleSubmit(this.submit)}
                >
                  {!submitted ? (
                    <FormSection name="job_info">
                      <Suspense fallback={loading()}>
                        <JobInfo
                          customers={customers}
                          change={change}
                          address={address}
                          formState={formState}
                          loaded={this.state.loaded}
                          handleAddress={this.handleAddress}
                        />
                      </Suspense>
                    </FormSection>
                  ) : null}

                  <Suspense fallback={loading()}>
                    <FieldArray
                      name="part_list"
                      component={DrawerBoxInfo}
                      woodtypes={woodtypes}
                      boxBottomWoodtype={boxBottomWoodtype}
                      boxThickness={boxThickness}
                      boxBottoms={boxBottoms}
                      notchDrill={notchDrill}
                      drawerFinishes={drawerFinishes}
                      scoop={scoop}
                      dividers={dividers}
                      formState={formState}
                      prices={prices}
                      subTotal={subTotal}
                      box_assembly={box_assembly}
                    />
                  </Suspense>

                  <div className="mb-3" />

                  <hr />
                  <hr />
                  <Row>
                    <Col xs="4" />
                    <Col xs="5" />
                    <Col xs="3">

                      <Row className='mb-0'>
                        <Col xs='9' />
                        {/* <Col>
                          <FormGroup>
                            <Label htmlFor="companyName">Taxable?</Label>
                            <Field
                              name={'Taxable'}
                              component={renderCheckboxToggle}
                            />
                          </FormGroup>
                        </Col> */}

                      </Row>

                      <strong>Discount: </strong>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>%</InputGroupText>
                        </InputGroupAddon>
                        <Field
                          name={'discount'}
                          type="text"
                          edit={true}
                          component={renderField}
                          label="discount"
                        />
                      </InputGroup>
                      <strong>Tax: </strong>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <NumberFormat thousandSeparator={true} value={tax} disabled={true} customInput={Input} {...currencyMask} prefix={'$'} />
                      </InputGroup>


                      <strong>Total: </strong>
                      <InputGroup className='mb-3'>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <NumberFormat thousandSeparator={true} value={total} disabled={true} customInput={Input} {...currencyMask} prefix={'$'} />
                      </InputGroup>
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col xs="4" />
                    <Col xs="5" />
                    <Col xs="3">
                      <Row>
                        <Col>
                          <Button
                            color="primary"
                            className="submit"
                            style={{ width: '100%' }}
                          >
                            Submit
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            color="danger"
                            onClick={this.cancelOrder}
                            style={{ width: '100%' }}
                          >
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row> */}
                </form>
              </CardBody>
            </Card>
          </div>


          <div className="orderFormCol2">
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <FormGroup>
                      <h3>Upload Files</h3>
                      <FileUploader onUploaded={this.onUploaded} multi={true} />
                    </FormGroup>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <MiscItems />
                    <hr />
                    <form
                      onKeyPress={this.onKeyPress}
                      onSubmit={handleSubmit(this.submit)}
                    >
                      <Row>
                        <Col xs="8" />
                        <Col xs="4">

                          <Row className='mb-0'>
                            <Col xs='9' />
                            <Col>
                              <FormGroup>
                                <Label htmlFor="companyName">Taxable?</Label>
                                <Field
                                  name={'Taxable'}
                                  component={renderCheckboxToggle}
                                />
                              </FormGroup>
                            </Col>

                          </Row>

                          <strong>Discount: </strong>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>%</InputGroupText>
                            </InputGroupAddon>
                            <Field
                              name={'discount'}
                              type="text"
                              component={renderField}
                              label="discount"
                              validate={maxValue(100)}
                            />
                          </InputGroup>
                          <strong>Tax: </strong>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>$</InputGroupText>
                            </InputGroupAddon>
                            <NumberFormat thousandSeparator={true} value={tax} disabled={true} customInput={Input} {...currencyMask} prefix={'$'} />
                          </InputGroup>


                          <strong>Total: </strong>
                          <InputGroup className='mb-3'>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>$</InputGroupText>
                            </InputGroupAddon>
                            <NumberFormat thousandSeparator={true} value={total} disabled={true} customInput={Input} {...currencyMask} prefix={'$'} />
                          </InputGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="4" />
                        <Col xs="5" />
                        <Col xs="3">
                          <Row>
                            <Col>
                              <Button
                                color="primary"
                                className="submit"
                                style={{ width: '100%' }}
                              >
                            Submit
                              </Button>
                            </Col>
                            <Col>
                              <Button
                                color="danger"
                                onClick={this.cancelOrder}
                                style={{ width: '100%' }}
                              >
                            Cancel
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  woodtypes: state.part_list.box_woodtypes,
  boxBottomWoodtype: state.part_list.box_bottom_woodtypes,
  boxThickness: state.part_list.box_thickness,
  boxBottoms: state.part_list.box_bottom_thickness,
  notchDrill: state.part_list.box_notch,
  drawerFinishes: state.part_list.box_finish,
  box_assembly: state.part_list.box_assembly,
  scoop: state.part_list.box_scoop,
  dividers: state.part_list.dividers,
  customers: state.customers.customerDB,
  address: state.Orders.address,

  user: state.users.user,

  submitted: state.Orders.submitted,
  initialValues: {
    open: true,
    balance_paid: 0,
    misc_items: [],
    discount: 0,
    Taxable: state.customers.customerDB[0].Taxable ? state.customers.customerDB[0].Taxable : false,
    part_list: [
      {
        box_assembly: state.part_list.box_assembly[0],
        dimensions: [],
        addPrice: 0
      }
    ],
    job_info: {
      customer: state.customers.customerDB[0],
      jobName: '',
      status: 'Quote',
      poNum: '',
      Address1: state.customers.customerDB[0].Address1,
      Address2: state.customers.customerDB[0].Address2,
      City: state.customers.customerDB[0].City,
      State: state.customers.customerDB[0].State,
      Zip: state.customers.customerDB[0].Zip,
      Phone: state.customers.customerDB[0].Phone,
      DueDate: dueDate,
      ShippingMethod: state.misc_items.shippingMethods[0],
      PaymentMethod: {
        NAME: state.customers.customerDB[0].PaymentMethod
      }
    }
  },
  formState: getFormValues('DrawerOrder')(state),
  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
  total: totalSelector(state),
  tax: taxSelector(state),
  addPriceSelector: addPriceSelector(state),
  miscTotalSelector: miscTotalSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      submitOrder,
      // getWoodtypes,
      loadCustomers
      // getBoxThickness,
      // getBoxBottoms,
      // getAssembly,
      // getNotch
    },
    dispatch
  );

DoorOrders = reduxForm({
  form: 'DrawerOrder',
  enableReinitialize: true
})(DoorOrders);

export default connect(mapStateToProps, mapDispatchToProps)(DoorOrders);
