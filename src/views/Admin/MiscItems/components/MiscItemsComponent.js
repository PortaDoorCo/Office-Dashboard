import React, { Component, Suspense } from 'react';
import { Field, reduxForm, FieldArray, getFormValues, change, FormSection, } from 'redux-form';
import { renderField, renderDropdownListFilter, renderPrice, renderCheckboxToggle } from '../../../../components/RenderInputs/renderInputs';
import { Button, Table, Row, Col, Input, Label, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Card, CardHeader, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { 
  subTotalSelector,
  taxSelector,
  totalSelector,
  miscTotalSelector,
  miscLineItemSelector,
  miscItemPriceSelector,
  miscItemLinePriceSelector
} from '../../../../selectors/miscItemPricing';
import moment from 'moment-business-days';
import Inputs from './Inputs';
import FileUploader from '../../../../components/FileUploader/FileUploader';
import Cookies from 'js-cookie';
import { bindActionCreators } from 'redux';
import { submitOrder, loadOrders } from '../../../../redux/orders/actions';

const JobInfo = React.lazy(() => import('../../../../components/JobInfo/MiscJobInfo'));

const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

const dueDate = moment(new Date()).businessAdd(7)._d;

const cookie = Cookies.get('jwt');



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
      reset,
      prices,
      itemPrice,
      subTotal,
      tax,
      total,
      submitOrder,
      user,
      miscLineItemSelector
    } = this.props;

    const orderType = 'Misc Items';


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
        sale: values.job_info.customer.sale.id,
        Taxable: values.job_info.customer.Taxable
      },
      ShippingMethod: values.job_info.ShippingMethod,
      PaymentMethod: values.job_info.PaymentMethod
    };

    const order = {
      status: values.job_info.status,
      job_info: jobInfo,
      companyprofile: values.job_info.customer.id,
      linePrice: miscLineItemSelector,
      subTotals: subTotal,
      misc_items: values.misc_items,
      tax: tax,
      total: total,
      discount: values.discount,
      balance_paid: values.balance_paid,
      balance_due: total,
      orderType: orderType,
      dueDate: values.job_info.DueDate,
      Date: new Date(),
      user: user.id,
      userName: user.username,
      files: this.state.files,
      submittedBy: user.FirstName,
      tracking: [
        {
          'status': values.job_info.status,
          'date': new Date()
        }
      ],
      balance_history: [
        {
          'balance_due': total,
          'balance_paid': values.balance_paid,
          'date': new Date()
        }
      ],
      sale: values.job_info.customer.sale.id,
      Taxable: values.Taxable
    };


    if (values.misc_items.length > 0) {
      await submitOrder(order, cookie);
      this.setState({ updateSubmit: !this.state.updateSubmit });
      reset();
      window.scrollTo(0, 0);
    } else {
      alert('Please Select a Miscellaneous Item');
      return;
    }
  };

cancelOrder = e => {
  e.preventDefault();
  this.props.reset();
};

onUploaded = (e) => {
  const id = e.map(i => (i.id));
  const a = [...this.state.files, id];
  this.setState({ files: a });
}

render() {
  const { misc_items, formState, handleSubmit, subTotal, miscTotal, miscLineItemSelector, customers, tax, total, prices, linePrices } = this.props;

  return (
    <div>
      <Row>
        <Col xs='8'>
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
                        />
                      </Suspense>
                    </FormSection>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FieldArray name="misc_items" component={Inputs} {...this.props} />
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
                  </Col>
                </Row>
              </form>
            </CardBody>
          </Card>
        </Col>


        <Col>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <FormGroup>
                    <h3>Upload Files</h3>
                    <FileUploader onUploaded={this.onUploaded} multi={true} />
                  </FormGroup>
                </CardBody>
              </Card>

            </Col>
          </Row>
        </Col>

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
    misc_items: [],
    balance_paid: 0,
    open: true,
    discount: 0,
    Taxable: state.customers.customerDB[0].Taxable ? state.customers.customerDB[0].Taxable : false,
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
      ShippingMethod: state.misc_items.shippingMethods[0],
      PaymentMethod: {
        NAME: state.customers.customerDB[0].PaymentMethod
      }
    }
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      submitOrder,
      loadOrders,
    },
    dispatch
  );

MiscItems = reduxForm({
  form: 'MiscItems',
  enableReinitialize: true
})(MiscItems);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MiscItems);