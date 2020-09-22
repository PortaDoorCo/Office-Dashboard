import React, { Component} from 'react';
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
import { renderDropdownList, renderField } from '../../../../../components/RenderInputs/renderInputs';
import {
  totalSelector,
  balanceSelector,
  subTotal_Total,
  balanceTotalSelector
} from '../../../../../selectors/drawerPricing';
import { updateOrder, updateBalance } from '../../../../../redux/orders/actions';

const cookie = Cookies.get('jwt');

const required = value => (value ? undefined : 'Required');

class Balance extends Component {

  changeBalance = () => {
    this.props.dispatch(
      change(
        'DrawerOrder',
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
      balance_paid: values.pay_balance,
      balance_history:  values.balance_history,
      payment_method: values.payment_method
    };

    if(values.pay_balance){
      await updateBalance(id, order, cookie);
      
      await this.props.dispatch(
        change(
          'DrawerOrder',
          'pay_balance',
          0
        )
      );

      await this.props.dispatch(
        change(
          'DrawerOrder',
          'balance_history',
          [
            ...values.balance_history,
            {
              'payment_method': values.payment_method,
              'balance_paid': parseFloat(values.pay_balance),
              'date': new Date()
            }
          ]

        )
      );
    } else {
      alert('Please enter a value');
      return null;
    }
  }

  render() {
    const {
      formState,
      handleSubmit,
      balanceTotal,
      role,
      paymentTypes
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

            {role && (role.type === 'management' || role.type === 'authenticated' || role.type === 'owner') ?
              <div>
                <Row>
                  <Col xs='5'>
                    <FormGroup>
                      <Label htmlFor="design">Payment Method</Label>
                      <Field
                        name={'payment_method'}
                        component={renderDropdownList}
                        data={paymentTypes}
                        valueField="value"
                        textField="NAME"
                        validate={required}
                      />
                    </FormGroup>
                  </Col>
                </Row>
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
              </div>
              : null }
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

  formState: getFormValues('DrawerOrder')(state),
  total: totalSelector(state),
  subTotal: subTotal_Total(state),
  balance: balanceSelector(state),
  balanceTotal: balanceTotalSelector(state),
  role: state.users.user.role,
  paymentTypes: state.misc_items.paymentTypes

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
  form: 'DrawerOrder',
})(Balance);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Balance);
