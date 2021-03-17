import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
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
      files: []
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
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
      balance
    } = this.props;

    const jobInfo = {
      ...values.job_info,
      customer: {
        id: values.job_info.customer.id,
        Company: values.job_info.customer.Company,
        TaxRate: values.job_info.customer.TaxRate,
        sale: values.job_info.customer && values.job_info.customer.sale && values.job_info.customer.sale.id,
        Taxable: values.job_info.customer.Taxable,
        Address1: values.job_info.customer.Address1,
        Address2: values.job_info.customer.Address2,
        City: values.job_info.customer.City,
        Zip: values.job_info.customer.Zip,
        Phone1: values.job_info.customer.Phone1,
        Fax: values.job_info.customer.Fax,
        Email: values.job_info.customer.Email,
      },
    };

    const order = {
      ...values,
      job_info: jobInfo,
      Rush: values.job_info.Rush,
      Sample: values.job_info.Sample,
      companyprofile: values.job_info.customer.id,
      linePrice: prices,
      itemPrice: itemPrice,
      subTotals: subTotal,
      tax: tax,
      total: total,
      balance_due: balance,
      status: values.job_info.status,
      dueDate: values.job_info.DueDate,
      sale: values.job_info && values.job_info.customer && values.job_info.customer.sale && values.job_info.customer.sale.id,
    };

    const orderId = values.id;
    await updateOrder(orderId, order, cookie);
    this.setState({ updateSubmit: !this.state.updateSubmit });
    await this.props.editable();

  };

  cancelOrder = async () => {
    await this.props.reset();
    this.setState({ updateSubmit: false });
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
    } = this.props;

    return (

      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
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
                  </Row>
                  <Row>
                    <Col xs="4" />
                    <Col xs="5" />
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
  enableReinitialize: true,
})(DoorOrders);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoorOrders);
