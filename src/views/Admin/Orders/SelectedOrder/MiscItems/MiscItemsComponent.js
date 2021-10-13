import React, { Component, Suspense } from 'react';
import { Field, reduxForm, FieldArray, getFormValues, FormSection, } from 'redux-form';
import { renderField,  renderCheckboxToggle } from '../../../../../components/RenderInputs/renderInputs';
import { Button, Row, Col, Input, Label, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Card, CardHeader, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { 
  subTotalSelector,
  taxSelector,
  totalSelector,
  miscTotalSelector,
  miscLineItemSelector,
  miscItemLinePriceSelector,
  miscItemPriceSelector,
} from '../../../../../selectors/miscItemPricing';
import moment from 'moment-business-days';
import Inputs from '../../../MiscItems/components/Inputs';

import Cookies from 'js-cookie';
import { bindActionCreators } from 'redux';
import { submitOrder, loadOrders, updateOrder } from '../../../../../redux/orders/actions';
import CheckoutBox from '../CheckoutBox';
import StickyBox from 'react-sticky-box';
import { NotificationManager } from 'react-notifications';
import CancelModal from '../../../../../utils/Modal';

const JobInfo = React.lazy(() => import('../../../../../components/JobInfo/MiscJobInfo'));

const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

const dueDate = moment(new Date()).businessAdd(7)._d;

const cookie = Cookies.get('jwt');

const maxValue = max => value => value && value > max ? `Cannot be greater than ${max}%` : undefined;

class MiscItems extends Component {

   state = {
     collapse: true,
     loaded: false,
     customerAddress: [],
     updateSubmit: false,
     files: [],
     cancelModal: false,
     customerReminder: false,
   };


   toggleReminderModal = () => {
     this.setState({ customerReminder: !this.state.customerReminder });
   };

   onKeyPress(event) {
     if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
       event.preventDefault();
     }
   }

  submit = async (values, e) => {
    const {
      reset,
      prices,
      itemPrice,
      subTotal,
      tax,
      total,
      updateOrder,
      user,
      miscLineItemSelector,
    } = this.props;

  
    const order = {
      ...values,
      job_info: values.job_info,
      Rush: values.job_info.Rush,
      Sample: values.job_info.Sample,
      companyprofile: values.job_info.customer.id,
      linePrice: miscLineItemSelector,
      subTotals: subTotal,
      tax: tax,
      total: total,
      status: values.job_info.status.value,
      dueDate: values.job_info.DueDate,
      sale: values.job_info && values.job_info.customer && values.job_info.customer.sale && values.job_info.customer.sale.id,
    };

    const orderId = values.id;

    if (values.misc_items.length > 0) {
      await updateOrder(orderId, order, cookie);
      await this.props.editable();
    } else {
      alert('Please Select a Miscellaneous Item');
      return;
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

onUploaded = (e) => {
  const id = e.map(i => (i.id));
  const a = [...this.state.files, id];
  this.setState({ files: a });
}

render() {
  const { misc_items, formState, handleSubmit, customers, tax, total, edit, prices, linePrices, miscTotal, user } = this.props;

  return (
    <div>
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
        <Col xs="12" sm="12" md="12" lg={user?.role?.type !== 'quality_control' ? '9' : '12'}>
          <Card>
            <CardHeader>
              <strong>Misc Items Order</strong>
            </CardHeader>
            <CardBody>
              <form onKeyPress={this.onKeyPress} onSubmit={handleSubmit(this.submit)}>
                <Row>
                  <Col>
                    <FormSection name="job_info">
                      <Suspense fallback={loading()}>
                        <JobInfo
                          customers={customers}
                          formState={formState}
                          handleAddress={this.handleAddress}
                          edit={edit}
                          toggleReminderModal={this.toggleReminderModal}
                          customerReminder={this.state.customerReminder}
                        />
                      </Suspense>
                    </FormSection>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FieldArray name="misc_items" component={Inputs} misc_items={misc_items} formState={formState} edit={edit} prices={prices} linePrices={linePrices} miscTotal={miscTotal} />
                  </Col>
                </Row>

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
                          label="discount"
                          edit={edit}
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
                  </Row> : null}
                {/* <Row>
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



const mapStateToProps = state => ({
  formState: getFormValues('MiscItems')(state),
  misc_items: state.misc_items.misc_items,
  subTotal: subTotalSelector(state),
  total: totalSelector(state),
  tax: taxSelector(state),
  prices: miscItemPriceSelector(state),
  linePrices: miscItemLinePriceSelector(state),
  miscTotal: miscTotalSelector(state),
  miscLineItemSelector: miscLineItemSelector(state),
  user: state.users.user,
  customers: state.customers.customerDB,
  initialValues: {
    ...state.Orders && state.Orders.selectedOrder,
    job_info: {
      ...state.Orders && state.Orders.selectedOrder && state.Orders.selectedOrder.job_info,
      status: state.Orders && state.Orders.selectedOrder && state.Orders.selectedOrder.status,
    }
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      submitOrder,
      loadOrders,
      updateOrder
    },
    dispatch
  );

MiscItems = reduxForm({
  form: 'MiscItems',
  onSubmitFail: (errors, dispatch, submitError, props) => {
    const job_info_message = 'You are missing required info';
    if (errors) {
      NotificationManager.error(job_info_message, 'Error', 2000);
    } 
  },
})(MiscItems);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MiscItems);