import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardBody,
  Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NotificationAlert from 'react-notification-alert';
import 'react-notifications/lib/notifications.css';
import {
  reduxForm,
  getFormValues,
  change,
  FieldArray
} from 'redux-form';
import {
  linePriceSelector,
  subTotalSelector,
  totalSelector,
  taxSelector,
  addPriceSelector
} from '../../../../selectors/drawerPricing';
import DrawerBoxInfo from './components/DrawerOrder/components/DrawerBoxInfo';
import JobInfo from './components/DrawerOrder/components/JobInfo';
import { updateOrder, loadOrders } from '../../../../redux/orders/actions';
import Cookies from "js-cookie";

const cookie = Cookies.get("jwt");

class DrawerOrders extends Component {
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

  // notify = () => {
  //   this.refs.notify.notificationAlert(options);
  // };

  submit = async (values, e) => {

    const { updateOrder, loadOrders, prices, itemPrice, subTotal,tax,total } = this.props;

    const order = {
      part_list: values.part_list,
      jobInfo: values.jobInfo,
      companyprofile: values.jobInfo.customer.id,
      linePrice: prices,
      itemPrice: itemPrice,
      subTotals: subTotal,
      tax: tax,
      total: total,
    };

    const orderId = values.id;

    await updateOrder(orderId, order, cookie);
    await this.props.reset();
    await this.props.toggle();
    await loadOrders(cookie);
  };

  componentDidUpdate(prevProps) {
    if (this.props.formState !== prevProps.formState) {
      const update = async () => {
        const customer = this.props.formState && this.props.formState.customer;
        if (customer && (customer !== (prevProps.formState && prevProps.formState.customer))) {
          this.props.dispatch(
            change(
              'DrawerOrders',
              'shippingAddress.Address1',
              customer.Shipping_Address1 || customer.Address1
            )
          );
          this.props.dispatch(
            change(
              'DrawerOrders',
              'shippingAddress.Address2',
              customer.Shipping_Address2 || customer.Address2
            )
          );
          this.props.dispatch(
            change(
              'DrawerOrders',
              'shippingAddress.City',
              customer.Shipping_City || customer.City
            )
          );
          this.props.dispatch(
            change(
              'DrawerOrders',
              'shippingAddress.State',
              customer.Shipping_State || customer.State
            )
          );
          this.props.dispatch(
            change(
              'DrawerOrders',
              'shippingAddress.Zip',
              customer.Shipping_Zip || customer.Zip
            )
          );
          this.props.dispatch(
            change(
              'DrawerOrders',
              'shippingAddress.Phone',
              customer.Shipping_Phone || customer.Phone1
            )
          );

        }

      };
      update();
    }
  }

  cancelOrder = async() => {
    await this.props.reset();
    await this.props.editable();
  };


  render() {
    const {
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
      formState,
      tax
    } = this.props;

  

    return (
      <div className="animated fadeIn resize">
        <NotificationAlert ref="notify" />
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <Card>
              <CardHeader>
                <strong>Door Order</strong>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit(this.submit)}>
                  <JobInfo name="jobInfo" customers={this.props.customers} />

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
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  props: props.selectedOrder,
  order: props.selectedOrder,
  woodtypes: state.part_list.woodtypes,
  boxBottomWoodtype: state.part_list.woodtypes,
  boxThickness: state.part_list.boxThickness,
  boxBottoms: state.part_list.boxBottoms,
  assembly: state.part_list.assembly,
  notchDrill: state.part_list.notchDrill,
  drawerFinishes: state.part_list.drawerFinishes,
  scoop: state.part_list.scoop,
  dividers: state.part_list.dividers,
  customers: state.customers.customerDB,
  address: state.Orders.address,
  orderNum: state.Orders.orderNum,

  submitted: state.Orders.submitted,
  initialValues: props.selectedOrder,
  formState: getFormValues('DrawerOrder')(state),
  prices: linePriceSelector(state),
  subTotal: subTotalSelector(state),
  total: totalSelector(state),
  tax: taxSelector(state),
  addPriceSelector: addPriceSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateOrder,
      loadOrders
    },
    dispatch
  );

DrawerOrders = reduxForm({
  form: 'DrawerOrder',
  enableReinitialize: true,
  destroyOnUnmount: false,
})(DrawerOrders);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerOrders);
