import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
  Label
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DrawerBoxInfo from '../../../../../components/DrawerOrders/DrawerBoxInfo';
import JobInfo from '../../../../../components/JobInfo/DrawerJobInfo';
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
import {
  submitOrder,
  loadOrders,
  updateOrder
} from '../../../../../redux/orders/actions';
import {
  loadCustomers
} from '../../../../../redux/customers/actions';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
  totalSelector,
  taxSelector,
  addPriceSelector,
  miscTotalSelector,
  balanceSelector,
  balanceTotalSelector
} from '../../../../../selectors/drawerPricing';
import Cookies from 'js-cookie';
import { renderField, renderCheckboxToggle } from '../../../../../components/RenderInputs/renderInputs';

const cookie = Cookies.get('jwt');

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

class DrawerOrder extends Component {
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
      prices,
      itemPrice,
      subTotal,
      total,
      tax,
      updateOrder,
      balance
    } = this.props;



    const jobInfo = {
      jobName: values.job_info.jobName,
      status: values.job_info.status,
      poNum: values.job_info.poNum,
      Address1: values.job_info.Address1,
      Address2: values.job_info.Address2,
      City: values.job_info.City,
      State: values.job_info.State,
      Zip: values.job_info.Zip,
      Phone: values.job_info.Phone,
      DueDate: values.job_info.DueDate,
      customer: {
        Company: values.job_info.customer.Company,
        TaxRate: values.job_info.customer.TaxRate,
      },
      ShippingMethod: values.job_info.ShippingMethod,
      PaymentMethod: values.job_info.PaymentMethod,
      Rush: values.job_info.Rush,
      Sample: values.job_info.Sample,
    };

    const order = {
      ...values,
      job_info: jobInfo,
      linePrice: prices,
      itemPrice: itemPrice,
      subTotals: subTotal,
      tax: tax,
      total: total,
      balance_due: balance,
    };

    const orderId = values.id;

    await updateOrder(orderId, order, cookie);
    await this.props.editable();
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  cancelOrder = async (e) => {
    e.preventDefault();
    await this.props.reset();
    await this.props.editable();
  };

  onKeyPress(event) {
    if (event.which === 13 /* Enter */) {
      event.preventDefault();
    }
  }

  onUploaded = (e) => {
    const data = JSON.parse(e.request.response);
    const id = data[0].id;
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
      assembly,
      scoop,
      dividers,
      drawerFinishes,
      customers,
      formState,
      address,
      tax,
      edit,
      box_assembly
    } = this.props;


    return (
      <div className="animated fadeIn">
        <NotificationAlert ref="notify" />
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <Card>
              <CardHeader>
                <strong>Door Order</strong>
              </CardHeader>
              <CardBody>
                <form onKeyPress={this.onKeyPress} onSubmit={handleSubmit(this.submit)}>
                  {!submitted ? (
                    <FormSection name="job_info">
                      <JobInfo
                        customers={customers}
                        change={change}
                        address={address}
                        formState={formState}
                        loaded={this.state.loaded}
                        handleAddress={this.handleAddress}
                        edit={edit}
                      />
                    </FormSection>
                  ) : null}

                  <FieldArray
                    name="part_list"
                    component={DrawerBoxInfo}
                    woodtypes={woodtypes}
                    boxBottomWoodtype={boxBottomWoodtype}
                    boxThickness={boxThickness}
                    boxBottoms={boxBottoms}
                    box_assembly={box_assembly}
                    notchDrill={notchDrill}
                    drawerFinishes={drawerFinishes}
                    scoop={scoop}
                    dividers={dividers}
                    formState={formState}
                    prices={prices}
                    subTotal={subTotal}
                    edit={edit}
                  />

                  <div className="mb-3" />

                  <hr />
                  <hr />
                  <Row>
                    <Col xs="4" />
                    <Col xs="5" />
                    <Col xs="3">

                      <Row className='mb-0'>
                        <Col xs='9' />
                        <Col>
                          <FormGroup>
                            <Label htmlFor="companyName">Taxable?</Label>
                            <Field
                              name={'Taxable'}
                              component={renderCheckboxToggle}
                              edit={edit}
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
                          edit={edit}
                          label="discount"
                        />
                      </InputGroup>
                      <strong>Tax: </strong>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <Input disabled placeholder={tax.toFixed(2)} />
                      </InputGroup>

                      <strong>Total: </strong>
                      <InputGroup className='mb-3'>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <Input disabled placeholder={total.toFixed(2)} />
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="4" />
                    <Col xs="5" />
                    <Col xs="3">
                      {!edit
                        ?
                        <Row>
                          <Col>
                            <Button color="primary" className="submit" style={{ width: '100%' }}>Submit</Button>
                          </Col>
                          <Col>
                            <Button color="danger" onClick={this.cancelOrder} style={{ width: '100%' }}>
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                        :
                        <div />
                      }

                    </Col>
                  </Row>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({

  initialValues: state.Orders.selectedOrder,
  order: state.Orders.selectedOrder,

  woodtypes: state.part_list.box_woodtypes,
  boxBottomWoodtype: state.part_list.box_bottom_woodtypes,
  boxThickness: state.part_list.box_thickness,
  boxBottoms: state.part_list.box_bottom_thickness,
  notchDrill: state.part_list.box_notch,
  drawerFinishes: state.part_list.box_finish,
  scoop: state.part_list.box_scoop,
  dividers: state.part_list.dividers,
  customers: state.customers.customerDB,
  address: state.Orders.address,
  orderNum: state.Orders.orderNum,
  box_assembly: state.part_list.box_assembly,
  user: state.users.user,

  submitted: state.Orders.submitted,

  formState: getFormValues('DrawerOrder')(state),
  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
  total: totalSelector(state),
  tax: taxSelector(state),
  addPriceSelector: addPriceSelector(state),
  miscTotalSelector: miscTotalSelector(state),
  balance: balanceSelector(state),
  balanceTotal: balanceTotalSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      submitOrder,
      loadCustomers,
      loadOrders,
      updateOrder
    },
    dispatch
  );

DrawerOrder = reduxForm({
  form: 'DrawerOrder',
  enableReinitialize: true
})(DrawerOrder);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerOrder);
