import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText
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
  addPriceSelector
} from '../../../../../selectors/drawerPricing';
import moment from 'moment-business-days'
import SideBar from './components/SideBar';
import Sticky from 'react-stickynode';
import Cookies from "js-cookie";
import { FileUploader } from 'devextreme-react';
import { renderField } from './components/RenderInputs/renderInputs'

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
      reset,
      prices,
      itemPrice,
      subTotal,
      total,
      submitOrder,
      orderNum,
      tax,
      user,
      loadOrders,
      updateOrder
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
        Company: values.job_info.customer.Company,
        TaxRate: values.job_info.customer.TaxRate,
      }
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
      discount: values.discount,
      balance_paid: 0,
      balance_due: total,
      orderType: orderType,
      dueDate: values.job_info.DueDate,
      user: user.id,
      userName: user.username,
      files: this.state.files,
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
      ]
    };

    const orderId = values.id;

    await updateOrder(orderId, order, cookie);
    await this.props.toggle();
    await loadOrders(cookie);
    await this.props.dispatch(reset('DrawerOrder'))
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
      tax,
      edit
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
                    assembly={assembly}
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
                            <Button color="primary" className="submit" style={{ width: "100%" }}>Submit</Button>
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

  initialValues: props.selectedOrder[0],
  order: props.selectedOrder[0],

  woodtypes: state.part_list.box_woodtypes,
  boxBottomWoodtype: state.part_list.box_woodtypes,
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
      // getNotch,
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
