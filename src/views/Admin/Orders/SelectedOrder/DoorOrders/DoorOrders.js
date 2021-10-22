import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  FormGroup,
  Label
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DoorInfo from '../../../../../components/DoorOrders/DoorInfo/DoorInfo';
import JobInfo from '../../../../../components/JobInfo/JobInfo';
import 'react-notifications/lib/notifications.css';
import {
  reduxForm,
  FormSection,
  getFormValues,
  change,
  FieldArray,
  Field,
} from 'redux-form';
import {
  submitOrder,
  loadOrders,
  updateOrder,
  updateSelectedOrder
} from '../../../../../redux/orders/actions';
import {
  loadCustomers
} from '../../../../../redux/customers/actions';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
  taxSelector,
  totalSelector,
  miscTotalSelector,
  balanceSelector,
  balanceTotalSelector
} from '../../../../../selectors/doorPricing';
import 'react-notifications/lib/notifications.css';
import Cookies from 'js-cookie';
import { renderField, renderCheckboxToggle } from '../../../../../components/RenderInputs/renderInputs';
import CheckoutBox from '../CheckoutBox';
import StickyBox from 'react-sticky-box';
import { NotificationManager } from 'react-notifications';
import CancelModal from '../../../../../utils/Modal';
import moment from 'moment';

const cookie = Cookies.get('jwt');

const maxValue = max => value => value && value > max ? `Cannot be greater than ${max}%` : undefined;

class DoorOrders extends Component {
  constructor(props) {
    super(props);
    this.makerJS = React.createRef();
    this.state = {
      collapse: true,
      loaded: false,
      customerAddress: [],
      updateSubmit: false,
      files: [],
      cancelModal: false,
      customerReminder: false,
    };
  }



  reloadPage = () => {
    window.location.reload();
  };

  submit = async (values, dispatch) => {
    const {
      prices,
      itemPrice,
      subTotal,
      tax,
      total,
      updateOrder,
      balance,
      status,
      tracking
    } = this.props;


    let newStatus = tracking;

    if(status !== values.status.value){
      newStatus = [
        ...tracking,
        {
          date: moment().format(),
          status: values.job_info?.status?.value,
        }
      ];
    }

    

    const order = {
      ...values,
      job_info: values.job_info,
      part_list: values.part_list,
      Rush: values.job_info.Rush,
      Sample: values.job_info.Sample,
      companyprofile: values.job_info.customer.id,
      linePrice: prices,
      itemPrice: itemPrice,
      subTotals: subTotal,
      tax: tax,
      total: total,
      balance_due: balance,
      status: values.job_info.status.value,
      dueDate: values.job_info.DueDate,
      sale: values.job_info && values.job_info.customer && values.job_info.customer.sale && values.job_info.customer.sale.id,
      tracking: newStatus
    };



    

    
    

    const orderId = values.id;
    await updateOrder(orderId, order, cookie);
    this.setState({ updateSubmit: !this.state.updateSubmit });
    await this.props.editable();


  };

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

  toggleReminderModal = () => {
    this.setState({ customerReminder: !this.state.customerReminder });
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
      handleSubmit,
      prices,
      customers,
      formState,
      isValid,
      address,
      edit,
      shippingMethods,
      total,
      dispatch,
      tax,
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
        <Row>
          <Col xs="12" sm="12" md="10" lg={user?.role?.type !== 'quality_control' ? '9' : '12'}>
            <Card>
              <CardHeader>
                <strong>Door Order</strong>
              </CardHeader>
              <CardBody>
                <form onKeyPress={this.onKeyPress} onSubmit={handleSubmit(this.submit)}>
                  <FormSection name="job_info">
                    <JobInfo
                      customers={customers}
                      change={change}
                      address={address}
                      loaded={this.state.loaded}
                      handleAddress={this.handleAddress}
                      edit={edit}
                      shippingMethods={shippingMethods}
                      toggleReminderModal={this.toggleReminderModal}
                      customerReminder={this.state.customerReminder}
                    />
                  </FormSection>

                  <FieldArray
                    name="part_list"
                    component={DoorInfo}
                    prices={prices}
                    formState={formState}
                    dispatch={dispatch}
                    isValid={isValid}
                    edit={edit}
                    updateSubmit={this.state.updateSubmit}
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
                    </Row> : null
                  }

                  {/* <Row>
                    <Col xs="9" />
                    <Col xs="3">
                      {!edit ?
                        <Row>
                          <Col>
                            <Button color="primary" className="submit" style={{ width: '100%' }}>Submit</Button>
                          </Col>
                          <Col>
                            <Button color="danger" onClick={this.cancelOrder} style={{ width: '100%' }}>
                              Cancel
                            </Button>
                          </Col>
                        </Row> :
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
            </Col> : null
        
          }
          
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {


  return {
    initialValues: {
      ...state.Orders && state.Orders.selectedOrder,
      job_info: {
        ...state.Orders && state.Orders.selectedOrder && state.Orders.selectedOrder.job_info,
        status: state.Orders && state.Orders.selectedOrder && state.Orders.selectedOrder.status,
      }
    },
    order: state.Orders.selectedOrder,
    customers: state.customers.customerDB,
    customerDBLoaded: state.customers.customerDBLoaded,

    status: state.Orders && state.Orders.selectedOrder && state.Orders.selectedOrder.status,
    tracking: state.Orders && state.Orders.selectedOrder && state.Orders.selectedOrder.tracking,

    user: state.users.user,

    woodtypes: state.part_list.woodtypes,
    cope_designs: state.part_list.cope_designs,
    edges: state.part_list.edges,
    finishes: state.part_list.finish,
    panels: state.part_list.panels,
    profiles: state.part_list.profiles,
    applied_moulds: state.part_list.applied_profiles,
    submitted: state.Orders.submitted,
    shippingMethods: state.Orders.shippingMethods,
    formState: getFormValues('DoorOrder')(state),
    prices: linePriceSelector(state),
    itemPrice: itemPriceSelector(state),
    subTotal: subTotalSelector(state),
    total: totalSelector(state),
    tax: taxSelector(state),
    miscTotalSelector: miscTotalSelector(state),
    balance: balanceSelector(state),
    balanceTotal: balanceTotalSelector(state)
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadCustomers,
      submitOrder,
      loadOrders,
      updateOrder,
      updateSelectedOrder
    },
    dispatch
  );

// eslint-disable-next-line no-class-assign


DoorOrders = reduxForm({
  form: 'DoorOrder',
  onSubmitFail: (errors, dispatch, submitError, props) => {
    const job_info_message = 'You are missing required info';
    if (errors) {
      NotificationManager.error(job_info_message, 'Error', 2000);
    } 
  },
})(DoorOrders);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoorOrders);
