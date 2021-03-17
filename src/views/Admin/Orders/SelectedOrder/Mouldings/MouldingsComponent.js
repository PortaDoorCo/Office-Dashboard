import React, { Component, Suspense } from 'react';
import { Field, reduxForm, FieldArray, getFormValues, FormSection, } from 'redux-form';
import { renderField, renderCheckboxToggle } from '../../../../../components/RenderInputs/renderInputs';
import { Button, Row, Col, Input, Label, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Card, CardHeader, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { 
  subTotalSelector,
  taxSelector,
  totalSelector,
  mouldingTotalSelector,
  mouldingLineItemSelector,
  mouldingPriceSelector,
  mouldingLinePriceSelector
} from '../../../../../selectors/mouldingPricing';
import moment from 'moment-business-days';
import Inputs from './Inputs';
import FileUploader from '../../../../../components/FileUploader/FileUploader';
import Cookies from 'js-cookie';
import { bindActionCreators } from 'redux';
import { submitOrder, loadOrders, updateOrder } from '../../../../../redux/orders/actions';

const JobInfo = React.lazy(() => import('../../../../../components/JobInfo/MouldingJobInfo'));

const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

const cookie = Cookies.get('jwt');
const maxValue = max => value => value && value > max ? `Cannot be greater than ${max}%` : undefined;

class MiscItems extends Component {

   state = {
     collapse: true,
     loaded: false,
     customerAddress: [],
     updateSubmit: false,
     files: []
   };

   onKeyPress(event) {
     if (event.which === 13 /* Enter */) {
       event.preventDefault();
     }
   }

  submit = async (values, e) => {
    const {
      subTotal,
      tax,
      total,
      miscLineItemSelector,
      updateOrder
    } = this.props;


    const jobInfo = {
      ...values.job_info,
      customer: {
        id: values.job_info.customer.id,
        Company: values.job_info.customer.Company,
        TaxRate: values.job_info.customer.TaxRate,
        Taxable: values.job_info.customer.Taxable,
        sale: values.job_info.customer && values.job_info.customer.sale && values.job_info.customer.sale.id,
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
      linePrice: miscLineItemSelector,
      subTotals: subTotal,
      tax: tax,
      total: total,
      status: values.job_info.status,
      dueDate: values.job_info.DueDate,
      sale: values.job_info && values.job_info.customer && values.job_info.customer.sale && values.job_info.customer.sale.id,
    };

    const orderId = values.id;

    if (values.mouldings.length > 0) {
      await updateOrder(orderId, order, cookie);
      await this.props.editable();
    } else {
      alert('Please Select a Miscellaneous Item');
      return;
    }
  };

cancelOrder = e => {
  e.preventDefault();
  this.props.reset();
  this.props.editable();
};

onUploaded = (e) => {
  const id = e.map(i => (i.id));
  const a = [...this.state.files, id];
  this.setState({ files: a });
}

render() {
  const { formState, handleSubmit, customers, tax, total, prices, edit } = this.props;
  return (
    <div>
      <Row>
        <Col xs='12'>
          <Card>
            <CardHeader>
              <strong>Mouldings</strong>
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
                        />
                      </Suspense>
                    </FormSection>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FieldArray name="mouldings" component={Inputs} {...this.props} />
                  </Col>
                </Row>
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



const mapStateToProps = state => ({
  formState: getFormValues('Mouldings')(state),
  misc_items: state.misc_items.misc_items,
  subTotal: subTotalSelector(state),
  total: totalSelector(state),
  tax: taxSelector(state),
  prices: mouldingPriceSelector(state),
  linePrices: mouldingLinePriceSelector(state),
  miscTotal: mouldingTotalSelector(state),
  miscLineItemSelector: mouldingLineItemSelector(state),
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
  form: 'Mouldings',
  enableReinitialize: true
})(MiscItems);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MiscItems);