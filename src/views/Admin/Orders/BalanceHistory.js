import React, { Component } from 'react';
import {
  Table
} from 'reactstrap';
import moment from 'moment'
import {
  getFormValues,
  reduxForm
} from 'redux-form';
import { connect } from 'react-redux'

class BalanceHistory extends Component {
  render() {
    const { formState } = this.props;

    if(formState){
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
              {(formState && formState.balance_history) ? formState.balance_history.slice(0).reverse().map((i, index) => (
                <tr>
                  {console.log(i)}
                  <td>{moment(i.date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</td>
                  <th>${i.balance_due.toFixed(2)}</th>
                  <td>-${i.balance_paid.toFixed(2)}</td>
                </tr>
              )) : null}
            </tbody>
          </Table>
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
});

BalanceHistory = reduxForm({
  form: 'DoorOrder',
})(BalanceHistory);


export default connect(
  mapStateToProps,
  null
)(BalanceHistory);
