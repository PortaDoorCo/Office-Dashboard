import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  FormGroup
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DoorInfo from './components/DoorInfo/DoorInfo';
import JobInfo from './components/JobInfo/JobInfo';
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
  addToCart,
  loadCustomers,
  shippingAddress,
  submitOrder,
  loadOrders,
} from '../../../redux/orders/actions';
import {
  pricingSelector,
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
  taxSelector,
  totalSelector,
  addPriceSelector,
  stileRailSelector,
  miscTotalSelector
} from '../../../selectors/doorPricing';

import PropTypes from 'prop-types';
import 'react-notifications/lib/notifications.css';
import SideBar from './components/SideBar';
import Ratio from 'lb-ratio'
import Sticky from 'react-stickynode';
import moment from 'moment-business-days'
import Cookies from "js-cookie";
import { FileUploader } from 'devextreme-react';
import { renderField } from './components/RenderInputs/renderInputs'
import MiscItems from './components/MiscItems'


const cookie = Cookies.get("jwt");
const header = { 'Authorization': 'Bearer ' + cookie };



const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};


const dueDate = moment(new Date()).businessAdd(7)._d

class DoorOrders extends Component {
  constructor(props) {
    super(props);
    this.makerJS = React.createRef();
    this.state = {
      collapse: true,
      loaded: false,
      customerAddress: [],
      updateSubmit: false,
      files: []
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  reloadPage = () => {
    window.location.reload();
  };

  submit = async (values, e) => {
    const {
      reset,
      prices,
      itemPrice,
      subTotal,
      tax,
      total,
      submitOrder,
      user,
      orders
    } = this.props;

    const orderType = 'Door Order';


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
        id: values.job_info.customer.id,
        Company: values.job_info.customer.Company,
        TaxRate: values.job_info.customer.TaxRate,
        sale: values.job_info.customer.sale.id
      },
      ShippingMethod: values.job_info.ShippingMethod
    }

    const order = {
      part_list: values.part_list,
      status: values.job_info.status,
      job_info: jobInfo,
      companyprofile: values.job_info.customer.id,
      linePrice: prices,
      itemPrice: itemPrice,
      subTotals: subTotal,
      misc_items: values.misc_items,
      tax: tax,
      total: total,
      balance_paid: values.balance_paid,
      balance_due: total,
      orderType: orderType,
      dueDate: values.job_info.DueDate,
      user: user.id,
      userName: user.username,
      files: this.state.files,
      submittedBy: user.FirstName,
      tracking: [
        {
          "status": values.job_info.status,
          "date": new Date()
        }
      ],
      balance_history: [
        {
          "balance_due": total,
          "balance_paid": values.balance_paid,
          "date": new Date()
        }
      ],
      sale: values.job_info.customer.sale.id
    };

    if (values.part_list[0].dimensions.length > 0) {
      await submitOrder(order, cookie);
      this.setState({ updateSubmit: !this.state.updateSubmit })
      reset();
      window.scrollTo(0, 0);
    } else {
      return
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.formState !== prevProps.formState) {
      if (this.props.formState) {
        const update = async () => {
          const form = await this.props.formState;
          const customer = await form.job_info.customer;
          const part_list = await form.part_list;

          this.props.dispatch(
            change(
              'DoorOrder',
              'balance_paid',
              0
            )
          );

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
        };
        update();
      }
    }
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
    const data = JSON.parse(e.request.response);
    const id = data[0].id;
    const a = [...this.state.files, id]
    this.setState({ files: a })
  }

  render() {


    const {
      submitted,
      handleSubmit,
      prices,
      subTotal,


      customers,
      formState,
      isValid,
      address,

      total,
      dispatch,
      tax
    } = this.props;



    return (
      <div className="animated fadeIn resize">
        <Row>
          <Col xs="12" sm="12" md="12" lg="7">
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
                        formState={formState}
                        address={address}
                        loaded={this.state.loaded}
                        handleAddress={this.handleAddress}
                      />
                    </FormSection>
                  ) : null}

                  <FieldArray
                    name="part_list"
                    component={DoorInfo}
                    // prices={prices}
                    formState={formState}
                    // subTotal={subTotal}
                    dispatch={dispatch}
                    isValid={isValid}
                    updateSubmit={this.state.submit}
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
                          <Button color="primary" className="submit" style={{ width: "100%" }}>Submit</Button>
                        </Col>
                        <Col>
                          <Button color="danger" onClick={this.cancelOrder} style={{ width: "100%" }}>
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
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <FormGroup>
                      <h3>Upload Files</h3>
                      <form id="form" ref={this.formElement} method="post" action="" encType="multipart/form-data">
                        <FileUploader name="files" uploadMode="instantly" uploadHeaders={header} multiple={true} onUploaded={this.onUploaded} uploadUrl="https://server.portadoor.com/upload" />
                      </form>
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
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {(this.props.formState && this.props.formState.part_list) ? (
              this.props.formState.part_list.map((part, i) => {
                return (
                  <div>
                    <Row style={{ height: '100%' }}>
                      <Col>
                        <Sticky
                          top={100}
                          bottomBoundary={`#item-${i}`}
                          enabled={true}
                          key={i}
                        >
                          <SideBar key={i} i={i} part={part} />
                        </Sticky>
                      </Col>
                    </Row>
                    <Row>
                      <Col>

                      </Col>
                    </Row>
                  </div>
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

const mapStateToProps = state => ({

  customers: state.Orders.customerDB,
  customerDBLoaded: state.Orders.customerDBLoaded,

  user: state.users.user,

  submitted: state.Orders.submitted,
  initialValues: {
    misc_items:[],
    open: true,
    part_list: [
      {
        construction: {
          name: 'Cope And Stick',
          value: 'Cope'
        },
        orderType: {
          name: 'Door Order',
          value: 'Door'
        },
        thickness: {
          name: '4/4',
          value: 0.75
        },
        dimensions: [],
        addPrice: 0,
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
      DueDate: dueDate,
      ShippingMethod: state.Orders.shippingMethods[0]
    }
  },
  formState: getFormValues('DoorOrder')(state),
  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
  total: totalSelector(state),
  tax: taxSelector(state),
  addPriceSelector: addPriceSelector(state),
  stileRailSelector: stileRailSelector(state),
  miscTotalSelector: miscTotalSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addToCart,
      loadCustomers,
      submitOrder,
      loadOrders,
    },
    dispatch
  );

// eslint-disable-next-line no-class-assign
DoorOrders = reduxForm({
  form: 'DoorOrder',
  enableReinitialize: true
})(DoorOrders);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoorOrders);
