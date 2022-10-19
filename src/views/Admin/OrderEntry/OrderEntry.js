import Cookies from 'js-cookie';
import moment from 'moment-business-days';
import React, { Component, Suspense } from 'react';
import { NotificationManager } from 'react-notifications';
// import DoorInfo from './components/DoorInfo/DoorInfo';
// import JobInfo from './components/JobInfo/JobInfo';
import 'react-notifications/lib/notifications.css';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import StickyBox from 'react-sticky-box';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from 'reactstrap';
import { bindActionCreators } from 'redux';
import {
  Field,
  FieldArray,
  FormSection,
  getFormValues,
  reduxForm,
  startAsyncValidation,
  touch,
  initialize,
  isDirty,
  getFormMeta,
} from 'redux-form';
import thickness from '../../../components/DoorOrders/DoorInfo/thickness';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { renderField } from '../../../components/RenderInputs/renderInputs';
import {
  loadOrders,
  setOrderType,
  submitOrder,
  updateOrder,
  setSelectedOrder,
} from '../../../redux/orders/actions';
import { saveEmail } from '../../../redux/customers/actions';
import {
  addPriceSelector,
  balanceSelector,
  balanceTotalSelector,
  miscTotalSelector,
  subTotalSelector,
  taxSelector,
  totalSelector,
  linePriceSelector,
  itemPriceSelector,
  qtySelector,
} from '../../../selectors/pricing';
import currencyMask from '../../../utils/currencyMask';
import CancelModal from '../../../utils/Modal';
import EditCheckoutBox from '../Orders/CheckoutBox';
import CheckoutBox from './components/CheckoutBox';
import validate from './components/validate';
import Sticky from 'react-stickynode';
import CustomerReminder from '../../../utils/Modal';
import PriceChangeModal from '../../../utils/Modal';
import io from 'socket.io-client';
import db_url from '../../../redux/db_url';

const socket = io(db_url);

const DoorInfo = React.lazy(() =>
  import('../../../components/DoorOrders/DoorInfo/DoorInfo')
);
const DrawerInfo = React.lazy(() =>
  import('../../../components/DrawerOrders/DrawerBoxInfo')
);
const Mouldings = React.lazy(() =>
  import('../../../components/Mouldings/MouldingsInfo')
);
const MiscItems = React.lazy(() =>
  import('../../../components/MiscItems/MiscItemsInfo')
);
const FF_Info = React.lazy(() =>
  import('../../../components/DoorOrders/DoorInfo/FFInfo')
);

const Flat_Stock = React.lazy(() =>
  import('../../../components/Flat_Stock/Flat_Stock')
);

const JobInfo = React.lazy(() => import('../../../components/JobInfo/JobInfo'));

const loading = () => (
  <div className="animated fadeIn pt-1 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const cookie = Cookies.get('jwt');

const maxValue = (max) => (value) =>
  value && value > max ? `Cannot be greater than ${max}%` : undefined;

const dueDate = moment(new Date()).businessAdd(21)._d;

class OrderEntry extends Component {
  constructor(props) {
    super(props);
    this.makerJS = React.createRef();
    this.state = {
      collapse: true,
      loaded: false,
      customerAddress: [],
      updateSubmit: false,
      files: [],
      subNavModal: false,
      subNavPage: 'misc',
      customerReminder: false,
      cancelModal: false,
      openedReminder: false,
      priceChange: false,
      priceChangeModal: false,
    };
  }

  async componentDidUpdate(prevProps) {
    const { formState, total } = this.props;

    console.log({ prev: prevProps.total });
    console.log({ total });

    console.log({ formState });

    if (formState?.job_info?.status?.value !== 'Quote') {
      if (!this.state.priceChange) {
        if (prevProps.total !== 0) {
          if (prevProps?.total !== this.props?.total) {
            this.setState({ priceChange: true });
            this.togglePriceChangeModal();
          }
        }
      }
    }
  }

  toggleReminderModal = () => {
    this.setState({
      customerReminder: !this.state?.customerReminder,
    });
  };

  togglePriceChangeModal = () => {
    this.setState({
      priceChangeModal: !this.state?.priceChangeModal,
    });
  };

  toggleSubmitModal = () => {
    this.setState({
      customerReminder: !this.state?.customerReminder,
      openedReminder: true,
    });
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    const {
      dispatch,
      setOrderType,
      route,
      isEdit,
      selectedOrder,
      setSelectedOrder,
      reset,
      load,
    } = this.props;

    if (isEdit) {
      // console.log({ selectedOrder });

      // const order = selectedOrder;

      // socket.on('order_updated', (res) => {
      //   console.log({ res });
      //   console.log({ order });
      //   if (res.id === selectedOrder.id) {
      //     console.log('fire');
      //     // setSelectedOrder(res);
      //     // initialize('Order', res);
      //   }
      // });
      return null;
    } else {
      setOrderType(route?.type);
    }

    dispatch(touch('Order', 'job_info.poNum'));

    dispatch(touch('Order', 'job_info.shipping_method'));

    dispatch(startAsyncValidation('Order'));

    // this.toggleReminderModal();
  }

  reloadPage = () => {
    window.location.reload();
  };

  submit = async (values, e) => {
    const {
      reset,
      prices,
      itemPrice,
      subTotals,
      tax,
      total,
      submitOrder,
      user,
      orderType,
      isEdit,
      balance,
      status,
      tracking,
      updateOrder,
      formState,
      qty,
      orders,
      fieldMeta,
    } = this.props;

    // const orderType = orderType;

    let order = {};

    let newStatus = tracking;

    let DateOrdered = formState?.DateOrdered;
    let DateInProduction = formState?.DateInProduction;
    let DateInvoiced = formState?.DateInvoiced;
    let DateShipped = formState?.DateShipped;
    let DateCompleted = formState?.DateCompleted;

    if (isEdit) {
      if (status !== values.job_info?.status?.value) {
        if (values.job_info?.status?.value) {
          newStatus = [
            ...tracking,
            {
              date: moment().format(),
              status: values.job_info?.status?.value,
              user: user?.FirstName,
              changes: fieldMeta,
            },
          ];

          if (values.job_info?.status?.value === 'Ordered') {
            if (values.DateOrdered) {
              DateOrdered = values.DateOrdered;
            } else {
              DateOrdered = new Date();
            }
          } else if (values.job_info?.status?.value === 'In Production') {
            if (values.DateInProduction) {
              DateInProduction = values.DateInProduction;
            } else {
              DateInProduction = new Date();
            }
          } else if (values.job_info?.status?.value === 'Invoiced') {
            if (values.DateInvoiced) {
              DateInvoiced = values.DateInvoiced;
            } else {
              DateInvoiced = new Date();
            }
          } else if (values.job_info?.status?.value === 'Shipped') {
            if (values.job_info?.DateShipped) {
              DateShipped = values.DateShipped;
            } else {
              DateShipped = new Date();
            }
          } else if (values.job_info?.status?.value === 'Complete') {
            if (values.DateCompleted) {
              DateCompleted = values.DateCompleted;
            } else {
              DateCompleted = new Date();
            }
          }
        }
      } else {
        newStatus = [
          ...tracking,
          {
            date: moment().format(),
            status: 'Order Edited',
            user: user?.FirstName,
            changes: fieldMeta,
          },
        ];
      }
    }

    if (!isEdit) {
      order = {
        ...values,
        status: values.job_info.status.value,
        poNum: values.job_info.poNum,
        Rush: values.job_info.Rush,
        Sample: values.job_info.Sample,
        job_info: {
          ...values.job_info,
          status: values.job_info.status.value,
          Notes: values.job_info.Notes,
        },
        companyprofile: values.job_info.customer.id,
        linePrice: prices,
        itemPrice: itemPrice,
        subTotals: subTotals,
        tax: tax,
        total: total,
        balance_due: total,
        qty: qty,
        orderType: orderType,
        dueDate: values?.job_info?.DueDate,
        Shipping_Scheduled: values?.job_info?.Shipping_Scheduled,
        Date: new Date(),
        user: user.id,
        userName: user.username,
        files: this.state.files,
        submittedBy: user.FirstName,
        tracking: [
          {
            status: values.job_info?.status?.value,
            date: new Date(),
            user: user?.FirstName,
          },
        ],
        balance_history: [
          {
            balance_paid: values.balance_paid,
            date: new Date(),
          },
        ],
        sale: values.job_info?.customer?.sale?.id,
      };
    } else {
      order = {
        ...values,
        job_info: values.job_info,
        poNum: values.job_info.poNum,
        DateOrdered: DateOrdered,
        DateInProduction: DateInProduction,
        DateShipped: DateShipped,
        DateInvoiced: DateInvoiced,
        DateCompleted: DateCompleted,
        part_list: values.part_list,
        Rush: values.job_info?.Rush,
        Sample: values.job_info?.Sample,
        companyprofile: values.job_info?.customer?.id,
        linePrice: prices,
        itemPrice: itemPrice,
        subTotals: subTotals,
        qty: qty,
        tax: tax,
        total: total,
        balance_due:
          total -
          values.balance_history
            .slice(0)
            .map((i, index) => {
              return parseFloat(i.balance_paid);
            })
            .reduce((acc, item) => acc + item, 0) -
          values.balance_history
            .slice(0)
            .map((i, index) => {
              return parseFloat(i.deposit_paid);
            })
            .reduce((acc, item) => acc + item, 0),
        status: values.job_info?.status?.value,
        dueDate: values.job_info?.DueDate,
        Shipping_Scheduled: values?.job_info?.Shipping_Scheduled,
        sale: values.job_info?.customer?.sale?.id,
        tracking: newStatus,
      };
    }

    let canSubmit = false;

    if (orderType === 'Mouldings' || orderType === 'Misc Items') {
      canSubmit = true;
    } else {
      const check = values.part_list.filter((x) => {
        if (x.dimensions.length < 1) {
          return true;
        }
      });

      if (check.length > 0) {
        canSubmit = false;
      } else {
        canSubmit = true;
      }
    }

    console.log({ order });

    if (!isEdit) {
      if (canSubmit) {
        const customer = formState?.job_info?.customer;

        await submitOrder(order, cookie);
        this.setState({ updateSubmit: !this.state.updateSubmit });
        reset();
        window.scrollTo(0, 0);

        this.setState({
          customerReminder: false,
          openedReminder: false,
        });

        return;
      } else {
        alert('Submission Error: You are missing dimensions');
        return;
      }
    } else {
      if (canSubmit) {
        const orderId = values.id;
        await updateOrder(orderId, order, cookie);
        this.setState({ updateSubmit: !this.state.updateSubmit });
        await this.props.editable();
      } else {
        alert('Submission Error: You are missing dimensions');
        return;
      }
    }
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

  onKeyPress(event) {
    if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
      event.preventDefault();
    }
  }

  onUploaded = (e) => {
    const id = e.map((i) => i.id);
    const a = [...this.state.files, id];
    this.setState({ files: a });
  };

  onSubNav = (nav) => {
    this.setState({
      subNavModal: !this.state.subNavModal,
      subNavPage: nav,
    });
  };

  render() {
    const {
      submitted,
      handleSubmit,
      customers,
      formState,
      isValid,
      address,
      total,
      dispatch,
      tax,
      addPriceSelector,
      route,
      orderType,
      edit,
      isEdit,
      user,
      saveEmail,
      role,
      prices,
      orders,
    } = this.props;

    const customer = formState?.job_info?.customer;
    const status = formState?.job_info?.status?.value;
    const order_lock = formState?.Order_Lock;

    return (
      <div className="animated fadeIn order-tour">
        <CancelModal
          toggle={this.toggleCancelModal}
          modal={this.state.cancelModal}
          title={'Cancel Edit?'}
          message={'Are you sure you want to this cancel this order edit?'}
          action={this.cancelOrder}
          actionButton={'Cancel Edit'}
          buttonColor={'danger'}
        />
        <CustomerReminder
          {...this.props}
          toggle={this.toggleReminderModal}
          modal={this.state.customerReminder}
          title={'Please double check your order'}
          message={customer?.Notes}
          action={
            this.state.openedReminder
              ? () => this.submit(formState ? formState : null)
              : false
          }
          actionButton={this.state.openedReminder ? 'Submit' : null}
          orders={orders}
          isEdit={isEdit}
        />
        <PriceChangeModal
          {...this.props}
          toggle={this.togglePriceChangeModal}
          modal={this.state.priceChangeModal}
          title={'Pricing has been Changed!'}
          message={
            <div>
              <center>
                <p>
                  This Order is <strong>No Longer a Quote</strong>
                </p>
                <p>
                  Prices <strong>Do Not Match</strong> the original quote.
                </p>

                <p>Please double check the Order and make adjustments</p>
              </center>
            </div>
          }
          action={null}
          actionButton={null}
          orders={orders}
          isEdit={isEdit}
        />
        <div className="orderForm">
          <div className={isEdit ? 'editFormCol1' : 'orderFormCol1'}>
            <Card>
              <CardHeader>
                <strong>{orderType}</strong>
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
                          formState={formState}
                          address={address}
                          loaded={this.state.loaded}
                          handleAddress={this.handleAddress}
                          toggleReminderModal={this.toggleReminderModal}
                          customerReminder={this.state.customerReminder}
                          edit={!edit}
                          isEdit={isEdit}
                          saveEmail={saveEmail}
                          cookie={cookie}
                        />
                      </Suspense>
                    </FormSection>
                  ) : null}

                  {!isEdit ? (
                    <Row>
                      <Col>
                        <Card>
                          <CardBody>
                            <FormGroup>
                              <h3>Upload Files</h3>
                              <p>
                                Please Upload Sketches with Design References
                              </p>
                              <FileUploader
                                onUploaded={this.onUploaded}
                                multi={true}
                              />
                            </FormGroup>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  ) : null}

                  <Suspense fallback={loading()}>
                    {orderType === 'Door Order' ? (
                      <FieldArray
                        name="part_list"
                        component={DoorInfo}
                        // prices={prices}
                        formState={formState}
                        // subTotal={subTotal}
                        addPriceSelector={addPriceSelector}
                        dispatch={dispatch}
                        isValid={isValid}
                        edit={!edit && order_lock === false}
                        updateSubmit={this.state.updateSubmit}
                      />
                    ) : orderType === 'Drawer Order' ? (
                      <FieldArray
                        name="part_list"
                        component={DrawerInfo}
                        dispatch={dispatch}
                        formState={formState}
                        edit={!edit && order_lock === false}
                      />
                    ) : orderType === 'Face Frame' ? (
                      <FieldArray
                        name="part_list"
                        component={FF_Info}
                        // prices={prices}
                        formState={formState}
                        // subTotal={subTotal}
                        addPriceSelector={addPriceSelector}
                        dispatch={dispatch}
                        isValid={isValid}
                        updateSubmit={this.state.updateSubmit}
                        edit={!edit && order_lock === false}
                      />
                    ) : orderType === 'Mouldings' ? (
                      <FieldArray
                        name="mouldings"
                        component={Mouldings}
                        dispatch={dispatch}
                        formState={formState}
                        edit={!edit && order_lock === false}
                      />
                    ) : orderType === 'Misc Items' ? (
                      <FieldArray
                        name="misc_items"
                        component={MiscItems}
                        dispatch={dispatch}
                        formState={formState}
                        edit={!edit && order_lock === false}
                      />
                    ) : orderType === 'Flat Stock' ? (
                      <FieldArray
                        name="flat_stock"
                        component={Flat_Stock}
                        dispatch={dispatch}
                        formState={formState}
                        edit={!edit && order_lock === false}
                      />
                    ) : null}
                  </Suspense>

                  <div className="mb-3" />

                  <hr />
                  <hr />
                  {user.role?.type === 'quality_control' ? null : (
                    <Row>
                      <Col xs="9" />
                      <Col xs="3">
                        <Row className="mb-0">
                          <Col xs="9" />
                        </Row>

                        {orderType === 'misc_items' ? null : (
                          <div>
                            <strong>Discount: </strong>
                            <InputGroup>
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>%</InputGroupText>
                              </InputGroupAddon>
                              <Field
                                name={'discount'}
                                type="text"
                                edit={!edit}
                                component={renderField}
                                label="discount"
                              />
                            </InputGroup>
                          </div>
                        )}

                        <strong>Tax: </strong>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>$</InputGroupText>
                          </InputGroupAddon>
                          <NumberFormat
                            thousandSeparator={true}
                            value={tax}
                            disabled={true}
                            customInput={Input}
                            {...currencyMask}
                            prefix={'$'}
                          />
                        </InputGroup>

                        <strong>Total: </strong>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>$</InputGroupText>
                          </InputGroupAddon>
                          <NumberFormat
                            thousandSeparator={true}
                            value={total}
                            disabled={true}
                            customInput={Input}
                            {...currencyMask}
                            prefix={'$'}
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  )}
                </form>
              </CardBody>
            </Card>
          </div>

          {user.role?.type === 'quality_control' ? null : (
            <div className={isEdit ? 'editFormCol2' : 'orderFormCol2'}>
              {this.props.isEdit ? (
                <StickyBox offsetTop={20} offsetBottom={20}>
                  <EditCheckoutBox
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
              ) : (
                <Sticky
                  top={100}
                  // bottomBoundary={`#item-${i}`}
                  enabled={true}
                  // key={i}
                >
                  {/* {this.props.orderType === 'Misc Items' ? null :  */}
                  <CheckoutBox
                    {...this.props}
                    {...this.state}
                    onSubNav={this.onSubNav}
                    handleSubmit={handleSubmit}
                    submit={
                      this.state.openedReminder
                        ? this.submit
                        : this.toggleSubmitModal
                    }
                    toggleCancelModal={this.toggleCancelModal}
                    maxValue={maxValue}
                    onUploaded={this.onUploaded}
                  />
                  {/* } */}
                </Sticky>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  orders: state.Orders.orders,
  customers: state.customers.customerDB,
  customerDBLoaded: state.customers.customerDBLoaded,
  user: state.users.user,
  submitted: state.Orders.submitted,
  orderType: state.Orders.orderType,
  initialValues:
    props.isEdit === true
      ? {
          ...(state.Orders && state.Orders.selectedOrder),
          DateOrdered: state.Orders?.selectedOrder?.DateOrdered,
          DateInvoiced: state.Orders?.selectedOrder?.DateInvoiced,
          DateShipped: state.Orders?.selectedOrder?.DateShipped,
          DateCompleted: state.Orders?.selectedOrder?.DateCompleted,
          DateInProduction: state.Orders?.selectedOrder?.DateInProduction,
          payment_type:
            state.Orders?.selectedOrder?.balance_history?.length < 2
              ? { name: 'Deposit', value: 'deposit' }
              : { name: 'Balance', value: 'balance' },
          job_info: {
            ...(state.Orders &&
              state.Orders.selectedOrder &&
              state.Orders.selectedOrder.job_info),
            status: {
              label: state.Orders?.selectedOrder?.status,
              value: state.Orders?.selectedOrder?.status,
            },
            salesRep: state.Orders?.selectedOrder?.job_info?.salesRep
              ? state.Orders?.selectedOrder?.job_info?.salesRep
              : state.sales?.salesReps?.filter(
                  (x) =>
                    x.id ===
                    state.Orders?.selectedOrder?.job_info?.customer?.sale
                )[0],

            EMAIL: state.Orders?.selectedOrder?.job_info?.customer?.EMAIL,
            Email2: state.Orders?.selectedOrder?.job_info?.customer?.Email2,
            Email3: state.Orders?.selectedOrder?.job_info?.customer?.Email3,
            Email4: state.Orders?.selectedOrder?.job_info?.customer?.Email4,
            Email5: state.Orders?.selectedOrder?.job_info?.customer?.Email5,
            Email6: state.Orders?.selectedOrder?.job_info?.customer?.Email6,

            Contact1: state.Orders?.selectedOrder?.job_info?.customer?.Contact1,
            Contact2: state.Orders?.selectedOrder?.job_info?.customer?.Contact2,
            Contact3: state.Orders?.selectedOrder?.job_info?.customer?.Contact3,
            Contact4: state.Orders?.selectedOrder?.job_info?.customer?.Contact4,
            Contact5: state.Orders?.selectedOrder?.job_info?.customer?.Contact5,
            Contact6: state.Orders?.selectedOrder?.job_info?.customer?.Contact6,
            Phone1: state.Orders?.selectedOrder?.job_info?.customer?.Phone1,
            Phone2: state.Orders?.selectedOrder?.job_info?.customer?.Phone2,
            Phone3: state.Orders?.selectedOrder?.job_info?.customer?.Phone3,
            Phone4: state.Orders?.selectedOrder?.job_info?.customer?.Phone4,
            Phone5: state.Orders?.selectedOrder?.job_info?.customer?.Phone5,
            Phone6: state.Orders?.selectedOrder?.job_info?.customer?.Phone6,
            Note1: state.Orders?.selectedOrder?.job_info?.customer?.Note1,
            Note2: state.Orders?.selectedOrder?.job_info?.customer?.Note2,
            Note3: state.Orders?.selectedOrder?.job_info?.customer?.Note3,
            Note4: state.Orders?.selectedOrder?.job_info?.customer?.Note4,
            Note5: state.Orders?.selectedOrder?.job_info?.customer?.Note5,
            Note6: state.Orders?.selectedOrder?.job_info?.customer?.Note6,
          },
          Order_Lock: true,
        }
      : {
          misc_items: [],
          balance_paid: 0,
          open: true,
          discount: 0,
          Order_Lock: false,
          Taxable: state.customers.customerDB[0].Taxable
            ? state.customers.customerDB[0].Taxable
            : false,
          part_list:
            state.Orders.orderType === 'Door Order'
              ? [
                  {
                    construction: {
                      name: 'Cope And Stick',
                      value: 'Cope',
                    },
                    orderType: {
                      name: 'Door Order',
                      value: 'Door',
                    },
                    thickness: {
                      name: '4/4 Standard Grade',
                      thickness_1: '4/4',
                      thickness_2: '3/4',
                      db_name: 'STANDARD_GRADE',
                      grade_name: '',
                      value: 1,
                      thickness_values: 0.75,
                    },
                    dimensions: [],
                    addPrice: 0,
                  },
                ]
              : state.Orders.orderType === 'Drawer Order'
              ? [
                  {
                    box_assembly: state.part_list.box_assembly[0],
                    dimensions: [],
                    addPrice: 0,
                  },
                ]
              : state.Orders.orderType === 'Face Frame'
              ? [
                  {
                    orderType: {
                      name: 'Face Frame',
                      value: 'Face_Frame',
                    },
                    thickness: thickness[0],
                    door_piece_number: state.part_list.door_piece_number[0],
                    dimensions: [],
                    addPrice: 0,
                  },
                ]
              : [],
          mouldings:
            state.Orders.orderType === 'Mouldings'
              ? [
                  {
                    linearFT: '0',
                    price: 0,
                  },
                ]
              : [],
          flat_stock:
            state.Orders.orderType === 'Flat Stock'
              ? [
                  {
                    width: 0,
                    length: 0,
                  },
                ]
              : [],
          job_info: {
            customer: state.customers?.customerDB[0],
            jobName: '',
            status: { label: 'Quote', value: 'Quote' },
            poNum: '',
            Address1: state.customers.customerDB[0]?.Address1,
            Address2: state.customers.customerDB[0]?.Address2,
            City: state.customers.customerDB[0]?.City,
            State: state.customers.customerDB[0]?.State,
            Zip: state.customers.customerDB[0]?.Zip,
            Phone: state.customers.customerDB[0]?.Shipping_Phone
              ? state.customers.customerDB[0]?.Shipping_Phone
              : state.customers.customerDB[0]?.Phone1
              ? state.customers.customerDB[0]?.Phone1
              : state.customers.customerDB[0]?.Phone,
            DueDate: dueDate,
            Notes: state.customers.customerDB[0]?.Notes,
            salesRep: state.customers.customerDB[0]?.sale,
            pmtTerms: state.customers.customerDB[0]?.PMT_TERMS,
            EMAIL: state.customers.customerDB[0]?.EMAIL,
            Email2: state.customers.customerDB[0]?.Email2,
            Email3: state.customers.customerDB[0]?.Email3,
            Email4: state.customers.customerDB[0]?.Email4,
            Email5: state.customers.customerDB[0]?.Email5,
            Email6: state.customers.customerDB[0]?.Email6,
            Contact1: state.customers.customerDB[0]?.Contact1,
            Contact2: state.customers.customerDB[0]?.Contact2,
            Contact3: state.customers.customerDB[0]?.Contact3,
            Contact4: state.customers.customerDB[0]?.Contact4,
            Contact5: state.customers.customerDB[0]?.Contact5,
            Contact6: state.customers.customerDB[0]?.Contact6,
            Phone1: state.customers.customerDB[0]?.Phone1,
            Phone2: state.customers.customerDB[0]?.Phone2,
            Phone3: state.customers.customerDB[0]?.Phone3,
            Phone4: state.customers.customerDB[0]?.Phone4,
            Phone5: state.customers.customerDB[0]?.Phone5,
            Phone6: state.customers.customerDB[0]?.Phone6,
            Note1: state.customers.customerDB[0]?.Note1,
            Note2: state.customers.customerDB[0]?.Note2,
            Note3: state.customers.customerDB[0]?.Note3,
            Note4: state.customers.customerDB[0]?.Note4,
            Note5: state.customers.customerDB[0]?.Note5,
            Note6: state.customers.customerDB[0]?.Note6,
            // PaymentMethod: {
            //   NAME: state.customers.customerDB[0].PaymentMethod
            // }
          },
        },
  status: state.Orders?.selectedOrder?.status,
  tracking: state.Orders?.selectedOrder?.tracking,
  role: state?.users?.user?.role,
  formState: getFormValues('Order')(state),
  fieldMeta: getFormMeta('Order')(state),
  total: totalSelector(state),
  tax: taxSelector(state),
  prices: linePriceSelector(state),
  subTotals: subTotalSelector(state),
  itemPrice: itemPriceSelector(state),
  qty: qtySelector(state),
  addPriceSelector: addPriceSelector(state),
  miscTotalSelector: miscTotalSelector(state),
  balance: balanceSelector(state),
  balanceTotal: balanceTotalSelector(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      submitOrder,
      loadOrders,
      setOrderType,
      updateOrder,
      saveEmail,
      setSelectedOrder,
    },
    dispatch
  );

// eslint-disable-next-line no-class-assign
OrderEntry = reduxForm({
  form: 'Order',
  enableReinitialize: true,
  // keepDirtyOnReinitialize: true,
  validate,
  onSubmitFail: (errors, dispatch, submitError, props) => {
    const job_info_message = 'You are missing required info';
    if (errors) {
      NotificationManager.error(job_info_message, 'Error', 2000);
    }
  },
})(OrderEntry);

export default connect(mapStateToProps, mapDispatchToProps)(OrderEntry);
