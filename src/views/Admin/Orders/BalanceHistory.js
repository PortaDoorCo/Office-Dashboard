import React, { Component } from 'react';
import {
  Table,
  Row,
  Col
} from 'reactstrap';
import moment from 'moment'
import {
  getFormValues,
  reduxForm,
  Field
} from 'redux-form';
import { connect } from 'react-redux'
import {
  totalSelector,
  balanceSelector,
  subTotal_Total,
  balanceTotalSelector
} from '../../../selectors/doorPricing';
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField } from './SelectedOrder/DoorOrders/components/RenderInputs/renderInputs'

class BalanceHistory extends Component {
  render() {
    const { formState, balanceTotal, balance, total } = this.props;

    if (formState) {
      console.log(formState)
      return (
        <div>
          <Table striped>
            <thead>
              <tr>
                <th>Payment Date</th>
                <th>Balance Due</th>
                <th>Balance Paid</th>

              </tr>
            </thead>
            <tbody>
              {(formState && formState.balance_history) ? formState.balance_history.slice(0).map((i, index) => (
                <tr>
                  {console.log(i)}
                  <td>{moment(i.date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</td>
                  <th>${i.balance_due.toFixed(2)}</th>
                  <td>-${i.balance_paid.toFixed(2)}</td>
                </tr>
              )) : null}
            </tbody>
          </Table>
          <Row className='mt-3'>
            <Col>
              <h3>Order Total:</h3>
                ${total.toFixed(2)}
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col>
              <h3>Total Paid:</h3>
                ${balanceTotal.toFixed(2)}
            </Col>
          </Row>
          <hr />
          <Row className='mt-3'>
            <Col>
              <h3>Balance Due:</h3>
              ${balance.toFixed(2)}
            </Col>
          </Row>
        </div>
      );
    } else {
      return (
        <div />
      )
    }

  }
}

const mapStateToProps = (state, prop) => ({
  formState: getFormValues('DoorOrder')(state),
  balanceTotal: balanceTotalSelector(state),
  balance: balanceSelector(state),
  total: totalSelector(state),
});

BalanceHistory = reduxForm({
  form: 'DoorOrder',
})(BalanceHistory);


export default connect(
  mapStateToProps,
  null
)(BalanceHistory);
