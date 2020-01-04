import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DrawerBoxInfo from './components/DrawerBoxInfo';
import JobInfo from '../OrderInfo/JobInfo';
import NotificationAlert from 'react-notification-alert';
import 'react-notifications/lib/notifications.css';
import {
  reduxForm,
  FormSection,
  getFormValues,
  change,
  FieldArray
} from 'redux-form';
import {
  submitOrder,
  loadCustomers,
} from '../../../../redux/orders/actions';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
  totalSelector,
  taxSelector,
  addPriceSelector
} from '../../../../selectors/drawerPricing';
import {
  getWoodtypes,
  getBoxThickness,
  getBoxBottoms,
  getAssembly,
  getNotch
} from '../../../../redux/part_list/actions';
import moment from 'moment';
import SideBar from './components/SideBar';
import Sticky from 'react-stickynode';

const dueDate = moment(new Date()).add(7, 'days').format();

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
      customerAddress: []
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
      orderNum,
      tax
    } = this.props;

    // const orderNum = 100 + orders.length + 1;

    const orderType = 'Drawer Order';

    const order = {
      part_list: values.part_list,
      jobInfo: values.job_info,
      status: values.job_info.status,
      companyprofile: values.job_info.customer.id,
      linePrice: prices,
      itemPrice: itemPrice,
      subTotals: subTotal,
      tax: tax,
      total: total,
      orderNum: orderNum,
      orderType: orderType,
      DueDate: values.job_info.DueDate
    };

    if (values.part_list[0].dimensions.length > 0) {
      submitOrder(order);
      reset();
      window.scrollTo(0, 0);
    } else {
      e.preventDefault();
    }
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (this.props.formState !== prevProps.formState) {
      if (this.props.formState) {
        const update = async () => {
          const form = await this.props.formState;
          const customer = await form.job_info.customer;
          const part_list = await form.part_list;

          this.props.dispatch(
            change(
              'DrawerOrder',
              'job_info.Address1',
              customer.Shipping_Address1 || customer.Address1
            )
          );
          this.props.dispatch(
            change(
              'DrawerOrder',
              'job_info.Address2',
              customer.Shipping_Address2 || customer.Address2
            )
          );
          this.props.dispatch(
            change(
              'DrawerOrder',
              'job_info.City',
              customer.Shipping_City || customer.City
            )
          );
          this.props.dispatch(
            change(
              'DrawerOrder',
              'job_info.State',
              customer.Shipping_State || customer.State
            )
          );
          this.props.dispatch(
            change(
              'DrawerOrder',
              'job_info.Zip',
              customer.Shipping_Zip || customer.Zip
            )
          );
          this.props.dispatch(
            change(
              'DrawerOrder',
              'job_info.Phone',
              customer.Shipping_Phone || customer.Phone1
            )
          );

          part_list.forEach((part, i) => {
            if (part.dimensions) {
              return part.dimensions.forEach((info, index) => {
                return this.props.dispatch(
                  change(
                    'DrawerOrder',
                    `part_list[${i}].dimensions[${index}].item`,
                    index + 1
                  )
                );
              });
            } else {
              return null;
            }
          });
        };
        update();
      }
    }
  }

  cancelOrder = e => {
    e.preventDefault();
    this.props.reset();
  };

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
      tax
    } = this.props;


    return (
      <div className="animated fadeIn resize">
        <NotificationAlert ref="notify" />
        <Row>
          <Col xs="12" sm="12" md="12" lg="7">
            <Card>
              <CardHeader>
                <strong>Door Order</strong>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit(this.submit)}>
                  {!submitted ? (
                    <FormSection name="job_info">
                      <JobInfo
                        customers={customers}
                        change={change}
                        address={address}
                        formState={formState}
                        loaded={this.state.loaded}
                        handleAddress={this.handleAddress}
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
                    assembly={assembly}
                    notchDrill={notchDrill}
                    drawerFinishes={drawerFinishes}
                    scoop={scoop}
                    dividers={dividers}
                    formState={formState}
                    prices={prices}
                    subTotal={subTotal}
                  />

                  <div className="mb-3" />

                  <hr />
                  <hr />
                  <Row>
                    <Col xs="4" />
                    <Col xs="5" />
                    <Col xs="3">
                      <strong>Tax: </strong>
                      <Input placeholder={'$' + tax.toFixed(2)} className="mb-2" />
                      <strong>Total: </strong>
                      <Input placeholder={'$' + total.toFixed(2)} className="mb-3" />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="4" />
                    <Col xs="5" />
                    <Col xs="3">
                      <Row>
                        <Col>
                          <Button color="primary" className="submit">Submit</Button>
                        </Col>
                        <Col>
                          <Button color="danger" onClick={this.cancelOrder} style={{ width: '100%' }}>
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
          <Col lg="4">
            {this.props.formState ? (
              this.props.formState.part_list.map((part, i) => {
                return (
                  <Sticky
                    top={100}
                    bottomBoundary={`#item-${i}`}
                    enabled={true}
                    key={i}
                  >
                    <SideBar key={i} i={i} part={part} />
                  </Sticky>
                );
              })
            ) : (
                <div />
              )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  woodtypes: state.part_list.woodtypes,
  boxBottomWoodtype: state.part_list.woodtypes,
  boxThickness: state.part_list.boxThickness,
  boxBottoms: state.part_list.boxBottoms,
  assembly: state.part_list.assembly,
  notchDrill: state.part_list.notchDrill,
  drawerFinishes: state.part_list.drawerFinishes,
  scoop: state.part_list.scoop,
  dividers: state.part_list.dividers,
  customers: state.Orders.customerDB,
  address: state.Orders.address,
  orderNum: state.Orders.orderNum,

  submitted: state.Orders.submitted,
  initialValues: {
    open: true,
    part_list: [
      {
        dimensions: [
          {
            scoop: state.part_list.scoop[0],
            dividers: state.part_list.dividers[0]
          }
        ],
        addPrice: 0
      }
    ],
    job_info: {
      customer: state.Orders.customerDB[0],
      jobName: '',
      status: 'Quote',
      poNum: '',
      Address1: '',
      Address2: '',
      City: '',
      State: '',
      Zip: '',
      Phone: '',
      DueDate: dueDate
    }
  },
  formState: getFormValues('DrawerOrder')(state),
  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
  total: totalSelector(state),
  tax: taxSelector(state),
  addPriceSelector: addPriceSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      submitOrder,
      getWoodtypes,
      loadCustomers,
      getBoxThickness,
      getBoxBottoms,
      getAssembly,
      getNotch
    },
    dispatch
  );

DoorOrders = reduxForm({
  form: 'DrawerOrder',
  enableReinitialize: true
})(DoorOrders);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoorOrders);
