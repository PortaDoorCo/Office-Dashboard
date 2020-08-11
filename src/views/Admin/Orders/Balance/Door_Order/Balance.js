<<<<<<< HEAD
import React, { Component } from 'react';
=======
import React, { Component} from 'react';
>>>>>>> staging
import {
  Row,
  Col,
  FormGroup,
  Label,
  Button,
  Input
} from 'reactstrap';
import { Field, reduxForm, change, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cookies from 'js-cookie';
import { renderField } from '../../SelectedOrder/DoorOrders/components/RenderInputs/renderInputs';
import {
  totalSelector,
  balanceSelector,
  subTotal_Total,
  balanceTotalSelector
} from '../../../../../selectors/doorPricing';
<<<<<<< HEAD
import { updateOrder, updateBalance} from '../../../../../redux/orders/actions';
=======
import { updateOrder, updateBalance } from '../../../../../redux/orders/actions';
>>>>>>> staging


const cookie = Cookies.get('jwt');


class Balance extends Component {
<<<<<<< HEAD
=======

>>>>>>> staging

  changeBalance = () => {
    this.props.dispatch(
      change(
        'DoorOrder',
        'balance_due',
        this.props.balance.toFixed('2')
      )
    );
  }

  cancel = () => {
    this.props.toggleBalance();
  }

  submit = async (values) => {
 

    const { updateBalance } = this.props;

    const id = values.id;

    const order = {
      balance_due: parseFloat(this.props.balance) - parseFloat(values.pay_balance),
      balance_paid: values.pay_balance,
      balance_history:  values.balance_history
    };



    await updateBalance(id, order, cookie);

    await this.props.dispatch(
      change(
        'DoorOrder',
        'pay_balance',
        0
      )
    );

    await this.props.dispatch(
      change(
        'DoorOrder',
        'balance_history',
        [
          ...values.balance_history,
          {
            'balance_due': parseFloat(this.props.balance) - parseFloat(values.pay_balance),
            'balance_paid': parseFloat(values.pay_balance),
            'date': new Date()
          }
        ]

      )
    );

  }


  render() {
    const {
      formState,
      handleSubmit,
      balanceTotal
    } = this.props;

    if (formState) {
      return (
        <div>
          <form onSubmit={handleSubmit(this.submit)}>
            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="Total">Order Total</Label>
                  <Field
                    name='total'
                    type="text"
                    component={renderField}
                    edit={true}
                    label="total" />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="Total">Sales Tax</Label>
                  <Field
                    name='tax'
                    type="text"
                    component={renderField}
                    edit={true}
                    label="total" />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="balance_paid">Balance Paid</Label>
                  <Input
                    disabled
                    placeholder={`$${balanceTotal}`}
                  />
                </FormGroup>
              </Col>
            </Row>

            <hr />

            <Row>
              <Col xs='3'>
                <FormGroup>
                  <Label htmlFor="design">Pay Balance</Label>
                  <Field
                    name='pay_balance'
                    type="text"
                    placeholder="0"
                    onBlur={this.changeBalance}
                    component={renderField}
                    label="pay_balance" />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <Button color="primary" className="mr-1">Pay</Button>
                <Button color="danger" onClick={this.cancel}>Cancel</Button>
              </Col>
            </Row>
          </form>
        </div >
      );
    } else {
      return (
        <div />
      );
    }

  }
}


const mapStateToProps = (state, props) => ({

  formState: getFormValues('DoorOrder')(state),
  total: totalSelector(state),
  subTotal: subTotal_Total(state),
  balance: balanceSelector(state),
  balanceTotal: balanceTotalSelector(state)

});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      change,
      updateOrder,
      updateBalance
    },
    dispatch
  );

Balance = reduxForm({
  form: 'DoorOrder',
})(Balance);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Balance);
