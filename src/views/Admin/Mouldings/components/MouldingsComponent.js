import React, { Component, Suspense } from 'react';
import { Field, reduxForm, FieldArray, getFormValues, FormSection, } from 'redux-form';
import { renderField, renderCheckboxToggle } from '../../../../components/RenderInputs/renderInputs';
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
} from '../../../../selectors/mouldingPricing';
import moment from 'moment-business-days';
import Inputs from './Inputs';
import FileUploader from '../../../../components/FileUploader/FileUploader';
import Cookies from 'js-cookie';
import { bindActionCreators } from 'redux';
import { submitOrder, loadOrders } from '../../../../redux/orders/actions';
import NumberFormat from 'react-number-format';
import currencyMask from '../../../../utils/currencyMask';
import CheckoutBox from './CheckoutBox';
import Sticky from 'react-stickynode';

const JobInfo = React.lazy(() => import('../../../../components/JobInfo/MouldingJobInfo'));
const MiscItems = React.lazy(() => import('./MiscItems'));

const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

const dueDate = moment(new Date()).businessAdd(7)._d;

const cookie = Cookies.get('jwt');

const maxValue = max => value => value && value > max ? `Cannot be greater than ${max}%` : undefined;


class Mouldings extends Component {

   state = {
     collapse: true,
     loaded: false,
     customerAddress: [],
     updateSubmit: false,
     files: [],
     subNavModal: false,
     subNavPage: 'misc',
   };

   onKeyPress(event) {
     if (event.which === 13 /* Enter */) {
       event.preventDefault();
     }
   }

  submit = async (values, e) => {
    const {
      reset,
      subTotal,
      tax,
      total,
      submitOrder,
      user,
      miscLineItemSelector,
    } = this.props;

    const orderType = 'Mouldings';


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
      status: values.job_info.status,
      Rush: values.job_info.Rush,
      Sample: values.job_info.Sample,
      job_info: jobInfo,
      companyprofile: values.job_info.customer.id,
      linePrice: miscLineItemSelector,
      subTotals: subTotal,
      tax: tax,
      total: total,
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
          'balance_paid': values.balance_paid,
          'date': new Date()
        }
      ],
      sale: values.job_info && values.job_info.customer && values.job_info.customer.sale && values.job_info.customer.sale.id,
    };


    if (values.mouldings.length > 0) {
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

onSubNav = (nav) => {
  this.setState({
    subNavModal: !this.state.subNavModal,
    subNavPage: nav
  });
};

render() {
  const { formState, handleSubmit, customers, tax, total, edit, mouldingTotal } = this.props;

  return (
    <div className="animated fadeIn">
      <div className="orderForm">
        <div className="mouldingFormCol1">
          <Card>
            <CardHeader>
              <strong>Mouldings</strong>
            </CardHeader>
            <CardBody>
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
                  <strong>Sub Total: </strong>
                  <InputGroup className='mb-3'>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <Input disabled placeholder={mouldingTotal.toFixed(2)} />
                  </InputGroup>
                </Col>
              </Row>
               
   
            </CardBody>
          </Card>
        </div>


        <div className="mouldingFormCol2">


          <Sticky
            top={100}
            // bottomBoundary={`#item-${i}`}
            enabled={true}
            // key={i}
          >
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

            <CheckoutBox
              {...this.props}
              {...this.state}
              onSubNav={this.onSubNav}
              handleSubmit={handleSubmit}
              submit={this.submit}
              cancelOrder={this.cancelOrder}
              maxValue={maxValue}
              onUploaded={this.onUploaded}
            />
          </Sticky>



        </div>

      </div>
        
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
  mouldingTotal: mouldingTotalSelector(state),
  miscLineItemSelector: mouldingLineItemSelector(state),
  user: state.users.user,
  customers: state.customers.customerDB,
  initialValues: {
    misc_items: [],
    mouldings: [],
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
      // ShippingMethod: state.misc_items.shippingMethods[0],
      // PaymentMethod: {
      //   NAME: state.customers.customerDB[0].PaymentMethod
      // }
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

Mouldings = reduxForm({
  form: 'Mouldings',
  enableReinitialize: true
})(Mouldings);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mouldings);