import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  FormGroup
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DrawerBoxInfo from './components/DrawerBoxInfo';
import JobInfo from './components/JobInfo/JobInfo';
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
  submitOrder
} from '../../../redux/orders/actions';
import { loadCustomers } from '../../../redux/customers/actions'
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
  totalSelector,
  taxSelector,
  addPriceSelector
} from '../../../selectors/drawerPricing';
// import {
//   getWoodtypes,
//   getBoxThickness,
//   getBoxBottoms,
//   getAssembly,
//   getNotch
// } from '../../../../redux/part_list/actions';
import moment from 'moment-business-days'
import SideBar from './components/SideBar';
import Sticky from 'react-stickynode';
import Cookies from "js-cookie";
import { FileUploader } from 'devextreme-react';

const cookie = Cookies.get("jwt");
const header = { 'Authorization': 'Bearer ' + cookie };


const dueDate = moment(new Date()).businessAdd(7)._d

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
      orderNum,
      tax,
      user
    } = this.props;



    const orderType = 'Drawer Order';

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
      job_info: jobInfo,
      status: values.job_info.status,
      companyprofile: values.job_info.customer.id,
      linePrice: prices,
      itemPrice: itemPrice,
      subTotals: subTotal,
      tax: tax,
      total: total,
      balance_paid: 0,
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
                          <Button color="primary" className="submit" style={{ width: "100%" }}>Submit</Button>
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
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <FormGroup>
                      <h3>Upload Files</h3>
                      <form id="form" ref={this.formElement} method="post" action="" encType="multipart/form-data">
                        <FileUploader name="files" uploadMode="instantly" uploadHeaders={header} multiple={true} onUploaded={this.onUploaded} uploadUrl="http://localhost:1337/upload" />
                      </form>
                    </FormGroup>
                  </CardBody>
                </Card>

              </Col>
            </Row>
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
  woodtypes: state.part_list.box_woodtypes,
  boxBottomWoodtype: state.part_list.box_bottom_woodtypes,
  boxThickness: state.part_list.box_thickness,
  boxBottoms: state.part_list.box_bottom_thickness,
  assembly: state.part_list.assembly,
  notchDrill: state.part_list.box_notches,
  drawerFinishes: state.part_list.box_finish,
  scoop: state.part_list.scoop,
  dividers: state.part_list.dividers,
  customers: state.customers.customerDB,
  address: state.Orders.address,
  orderNum: state.Orders.orderNum,

  user: state.users.user,


  submitted: state.Orders.submitted,
  initialValues: {
    open: true,
    balance_paid: 0,
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
      ShippingMethod: state.Orders.shippingMethods[0]
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
      // getWoodtypes,
      loadCustomers,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoorOrders);
