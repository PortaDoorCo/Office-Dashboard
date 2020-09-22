import React, { Component } from 'react';
import {
  Table,
  Row,
  Col
} from 'reactstrap';
import moment from 'moment';
import {
  getFormValues,
  reduxForm
} from 'redux-form';
import { connect } from 'react-redux';
import {
  totalSelector,
  balanceSelector,
  balanceTotalSelector
} from '../../../../../selectors/doorPricing';


class BalanceHistory extends Component {

  render() {
    const { formState, total } = this.props;

    if (formState) {
      const balance_paid_history = ((formState && formState.balance_history) ? formState.balance_history.map(i => { return i.balance_paid; }) : 0);
      const balance_paid_total = balance_paid_history.reduce((acc, item) => acc + item, 0);
      const balance_total = total - balance_paid_total;
      return (
        <div>
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
              {(formState && formState.balance_history) ? formState.balance_history.slice(0).map((i, index) => (
                
                <tr key={index}>
                  {console.log(i)}
                  <td>{moment(i.date).format('dddd, MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>${index > 0 ? (total - formState.balance_history[index-1].balance_paid - i.balance_paid).toFixed(2) : (total - i.balance_paid).toFixed(2)}</td>
                  <td>-${i.balance_paid.toFixed(2)}</td>
                  <td>{i.payment_method ? i.payment_method.NAME : ''}</td>
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
                ${balance_paid_total.toFixed(2)}
            </Col>
          </Row>
          <hr />
          <Row className='mt-3'>
            <Col>
              <h3>Balance Due:</h3>
              ${balance_total.toFixed(2)}
            </Col>
          </Row>
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
});

BalanceHistory = reduxForm({
  form: 'DoorOrder',
})(BalanceHistory);


export default connect(
  mapStateToProps,
  null
)(BalanceHistory);
