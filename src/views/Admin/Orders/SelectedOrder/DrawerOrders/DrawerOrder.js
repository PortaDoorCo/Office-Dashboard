import React, { Component } from 'react';
import {
  Row,
  Col,
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
import CheckoutBox from '../CheckoutBox';
import StickyBox from 'react-sticky-box';
import { NotificationManager } from 'react-notifications';
import CancelModal from '../../../../../utils/Modal';
import moment from 'moment';

const cookie = Cookies.get('jwt');
const maxValue = max => value => value && value > max ? `Cannot be greater than ${max}%` : undefined;

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
      files: [],
      cancelModal: false,
      customerReminder: false,
    };
  }

  toggleReminderModal = () => {
    this.setState({ customerReminder: !this.state.customerReminder });
  };


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
      balance,
      status,
      tracking
    } = this.props;

    let newStatus = tracking;

    if (status !== values.job_info?.status?.value) {
      if(values.job_info?.status?.value){
        console.log('Status Updated');
        newStatus = [
          ...tracking,
          {
            date: moment().format(),
            status: values.job_info?.status?.value,
          },
        ];
      } else {
        console.log('Order Edited');
        newStatus = [
          ...tracking,
          {
            date: moment().format(),
            status: 'Order Edited',
          },
        ];
      }
    }


    const order = {
      ...values,
      job_info: values.job_info,
      Rush: values.job_info.Rush,
      Sample: values.job_info.Sample,
      companyprofile: values.job_info.customer.id,
      linePrice: prices,
      itemPrice: itemPrice,
      subTotals: subTotal,
      tax: tax,
      total: total,
      status: values.job_info.status.value,
      balance_due: balance,
      dueDate: values.job_info.DueDate,
      sale: values.job_info && values.job_info.customer && values.job_info.customer.sale && values.job_info.customer.sale.id,
      tracking: newStatus
    };


    const orderId = values.id;

    await updateOrder(orderId, order, cookie);
    await this.props.editable();
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  cancelOrder = (e) => {
    e.preventDefault();
    this.setState({ updateSubmit: false });
    this.toggleCancelModal();
    this.props.reset();
    this.props.editable();
  };

  toggleCancelModal = () => {
    this.setState({ cancelModal: !this.state.cancelModal });
  };

  onKeyPress(event) {
    if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
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
      box_assembly,
      user
    } = this.props;


    return (
      <div className="animated fadeIn">
        <CancelModal
          toggle={this.toggleCancelModal}
          modal={this.state.cancelModal}
          title={'Cancel Editing Order?'}
          message={<div>
            <p>Are you sure you want to cancel editing this order?</p>
            <p><strong>Your Changes Will Not Be Saved</strong></p>
          </div>}
          action={this.cancelOrder}
          actionButton={'Cancel Edit'}
          buttonColor={'danger'}
        />
        <NotificationAlert ref="notify" />
        <Row>
          <Col xs="12" sm="12" md="12" lg={user?.role?.type !== 'quality_control' ? '9' : '12'}>
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
                        toggleReminderModal={this.toggleReminderModal}
                        customerReminder={this.state.customerReminder}
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
                  {user?.role?.type !== 'quality_control' ? 
                    <Row>
                      <Col xs="9" />
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
                            validate={maxValue(100)}
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
                    </Row> : null }
                  {/* <Row>
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
                  </Row> */}
                </form>
              </CardBody>
            </Card>
          </Col>
          {user?.role?.type !== 'quality_control' ? 
            <Col lg="3">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <CheckoutBox
                  {...this.props}
                  {...this.state}
                  onSubNav={this.onSubNav}
                  handleSubmit={handleSubmit}
                  submit={this.submit}
                  toggleCancelModal={this.toggleCancelModal}
                  maxValue={maxValue}
                  onUploaded={this.onUploaded}
                />
              </StickyBox>
            </Col> : null}
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({

  initialValues: {
    ...state.Orders && state.Orders.selectedOrder,
    job_info: {
      ...state.Orders && state.Orders.selectedOrder && state.Orders.selectedOrder.job_info,
      status: state.Orders && state.Orders.selectedOrder && state.Orders.selectedOrder.status,
    }
  },
  order: state.Orders.selectedOrder,

  status: state.Orders && state.Orders.selectedOrder && state.Orders.selectedOrder.status,
  tracking: state.Orders && state.Orders.selectedOrder && state.Orders.selectedOrder.tracking,

  woodtypes: state.part_list.woodtypes,
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
  onSubmitFail: (errors, dispatch, submitError, props) => {
    const job_info_message = 'You are missing required info';
    if (errors) {
      NotificationManager.error(job_info_message, 'Error', 2000);
    } 
  },
})(DrawerOrder);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerOrder);
