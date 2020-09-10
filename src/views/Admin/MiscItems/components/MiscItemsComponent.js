import React, { Component, Suspense } from 'react';
import { Field, reduxForm, FieldArray, getFormValues, change, FormSection, } from 'redux-form';
import { renderField, renderDropdownListFilter, renderPrice, renderCheckboxToggle } from '../../../../components/RenderInputs/renderInputs';
import { Button, Table, Row, Col, Input, Label, FormGroup, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { connect } from 'react-redux';
import { 
  subTotalSelector,
  taxSelector,
  totalSelector,
  miscTotalSelector,
  miscLineItemSelector
} from '../../../../selectors/miscItemPricing';
import moment from 'moment-business-days';

const JobInfo = React.lazy(() => import('../../../../components/JobInfo/MiscJobInfo'));

const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

const dueDate = moment(new Date()).businessAdd(7)._d;

const required = value => (value ? undefined : 'Required');

let Inputs = props => {
  const { fields, misc_items, formState } = props;

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>QTY</th>
            <th>Item</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((table, index) => {
            return (
              <tr key={index}>
                <td style={{ width: '90px' }}><Field name={`${table}.qty`} component={renderField} type="text" /></td>
                <td>
                  {formState &&  formState.misc_items && formState.misc_items[index] && formState.misc_items[index].category === 'preselect' ?
                    <Field
                      name={`${table}.item`}
                      component={renderDropdownListFilter}
                      data={misc_items}
                      valueField="value"
                      textField="NAME"
                      validate={required}
                    />  : 
                    <Field
                      name={`${table}.item2`}
                      component={renderField}
                      valueField="value"
                      textField="NAME"
                      validate={required}
                    />
                  }
                </td>
                {formState &&  formState.misc_items && formState.misc_items[index] && formState.misc_items[index].category === 'preselect' ?
                  <td style={{ width: '150px' }}><Field name={`${table}.price`} component={renderPrice} type="text" /></td> : 
                  <td style={{ width: '150px' }}><Field name={`${table}.price2`} component={renderPrice} validate={required} type="text" /></td> 
                }
                <td><Button color="danger" onClick={() => fields.remove(index)}>X</Button></td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Button color="primary" className="mt-3" onClick={() => fields.push({
        category: 'preselect',
        qty: 1,
        price: 0
      })}>Add Item </Button>

      <Button color="primary" className="mt-3" onClick={() => fields.push({
        category:'custom',
        qty: 1,
        price: 0
      })}>Custom Item</Button>
    </div>
  );
};

class MiscItems extends Component {

  componentDidUpdate(prevProps) {
    const { formState } = this.props;
    if (formState && formState.misc_items) {
      if ((formState && formState.misc_items) !== (prevProps.formState && prevProps.formState.misc_items)) {

        const misc_items = formState.misc_items;

        misc_items.forEach((i, index) => {
          if(i.item){

            if(i.item.Price !== 0){
              this.props.dispatch(
                change(
                  'MiscItems',
                  `misc_items[${index}].price`,
                  (i.qty ? (i.item.Price * parseInt(i.qty)): i.item.Price)
                )
              );
            } else {
              return;
            }

          }
          
        });

      }
    }
  }

  onKeyPress(event) {
    if (event.which === 13 /* Enter */) {
      event.preventDefault();
    }
  }

  submit = (values) => {
    alert('submitted');
    console.log(values);
  }

  render() {
    const { misc_items, formState, handleSubmit, subTotal, miscTotalSelector, miscLineItemSelector, customers, tax, total } = this.props;

    console.log('formState', miscLineItemSelector);

    return (
      <div>
        <h3>Misc Items</h3>
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
              <FieldArray name="misc_items" component={Inputs} misc_items={misc_items} formState={formState} />
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
  miscTotalSelector: miscTotalSelector(state),
  miscLineItemSelector: miscLineItemSelector(state),
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

MiscItems = reduxForm({
  form: 'MiscItems',
  enableReinitialize: true
})(MiscItems);


export default connect(
  mapStateToProps,
  null
)(MiscItems);