import React, { Component } from 'react';
import {
  Table,
  Row,
  Col,
  Button
} from 'reactstrap';
import moment from 'moment';
import {
  getFormValues,
  reduxForm,
  FieldArray
} from 'redux-form';
import { connect } from 'react-redux';
import {
  totalSelector,
  balanceSelector,
  balanceTotalSelector
} from '../../../../../selectors/doorPricing';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import { Field, change } from 'redux-form';
import { renderDatePicker, renderField, renderDropdownList } from '../../../../../components/RenderInputs/renderInputs';

const renderDateTimePicker = ({ input: { onChange, value }, showTime, edit }) =>

  <div>
    <DateTimePicker
      onChange={onChange}
      time={showTime}
      value={!value ? null : new Date(value)}
      disabled={edit}
    />
  </div>;


const renderBalances = ({ fields, balance_history_paid, paymentTypes, edit, meta: { error } }) => (

    
  fields.map((i, index) => (
    <tr key={index}>
      {console.log({i})}
      <td>
        <Field
          name={`${i}.date`}
          showTime={false}
          edit={edit}
          component={renderDateTimePicker} />
      </td>
      <th>
      ${balance_history_paid[index].toFixed(2)}
      </th>
      <td>
        <Field
          name={`${i}.balance_paid`}
          type="text"
          component={renderField}
          edit={true}
          label="balance_paid" />
      </td>
      <td>

        <Field
          name={`${i}.payment_method`}
          component={renderDropdownList}
          data={paymentTypes}
          valueField="value"
          edit={edit}
          // validate={required}
          textField="NAME" />

        {/* <Field
          name={`${i}.payment_method`}
          type="text"
          component={renderField}
          valueField="value"
          textField="NAME"
          // edit={edit}
          label="payment_method" /> */}
      </td>
    </tr>
  )).reverse()
    

);





class BalanceHistory extends Component {

  render() {
    const { formState, total, fields, dispatch, isValid, edit, paymentTypes, handleSubmit } = this.props;

    let updated_total = total;

    const balance_history_paid = formState && formState.balance_history.slice(0).map((i, index) => {

      updated_total = updated_total - parseFloat(i.balance_paid);
      return updated_total;
    });
 
    const balance_paid_history = ((formState && formState.balance_history) ? formState.balance_history.map(i => { return i.balance_paid; }) : [0]);
    const balance_paid_total = balance_paid_history.reduce((acc, item) => acc + item, 0);

    const submit = async (values, e) => {
      console.log({values});
    };

    const onKeyPress = (event) => {
      if (event.which === 13 /* Enter */) {
        event.preventDefault();
      }
    };



    if (formState) {

      return (
        <div>
          <form onKeyPress={onKeyPress} onSubmit={handleSubmit(submit)}>
            <Table striped>
              <thead>
                <tr>
                  <th>Payment Date</th>
                  <th>Balance Due</th>
                  <th>Balance Paid</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
              
                <FieldArray name="balance_history" component={renderBalances} balance_paid_history={balance_paid_history} balance_history_paid={balance_history_paid} balance_paid_total={balance_paid_total} paymentTypes={paymentTypes} edit={edit} />
              
              </tbody>
            </Table>
            {!edit ? 
              <Button color="primary">Save</Button> : null
            }
            <Row className='mt-3'>
              <Col>
                <h3>Order Total:</h3>
                ${total.toFixed(2)}
              </Col>
            </Row>
            <Row className='mt-3'>
              <Col>
                <h3>Total Paid:</h3>
                ${balance_paid_total.toFixed(2)}
              </Col>
            </Row>
            <hr />
            <Row className='mt-3'>
              <Col>
                <h3>Balance Due:</h3>
              ${updated_total.toFixed(2)}
              </Col>
            </Row>
          </form>
        </div>
      );
    } else {
      return (
        <div />
      );
    }

  }
}

const mapStateToProps = (state, prop) => ({
  formState: getFormValues('DoorOrder')(state),
  balanceTotal: balanceTotalSelector(state),
  balance: balanceSelector(state),
  total: totalSelector(state),
  paymentTypes: state.misc_items.paymentTypes
});

BalanceHistory = reduxForm({
  form: 'DoorOrder',
})(BalanceHistory);


export default connect(
  mapStateToProps,
  null
)(BalanceHistory);
