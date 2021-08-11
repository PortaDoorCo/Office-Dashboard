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
import { renderDropdownList, renderField, renderNumber } from '../../../../../components/RenderInputs/renderInputs';
import {
  totalSelector,
  balanceSelector,
  subTotal_Total,
  taxSelector,
  balanceTotalSelector
} from '../../../../../selectors/doorPricing';
import { updateOrder, updateBalance, updateStatus } from '../../../../../redux/orders/actions';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';


const cookie = Cookies.get('jwt');

const required = value => (value ? undefined : 'Required');

const renderDateTimePicker = ({ input: { onChange, value }, showTime, edit, meta: { touched, error, warning }, }) =>

  <div>
    <DateTimePicker
      onChange={onChange}
      time={showTime}
      value={!value ? new Date() : new Date(value)}
      disabled={edit}
    />
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </div>;

class Balance extends Component {

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
      ...values,
      balance_paid: values.pay_balance,
      DueDate: values.DueDate,
      balance_history:  values.balance_history,
      payment_method: values.payment_method,
      payment_date: values.payment_date ? values.payment_date : new Date()
    };

    if(values.pay_balance){
      await updateBalance(id, order, cookie);

      if(values.status === 'Quote'){
        await this.props.dispatch(
          change(
            'DoorOrder',
            'job_info.status',
            'Ordered'
          )
        );
        await this.props.dispatch(
          change(
            'DoorOrder',
            'status',
            'Ordered'
          )
        );
      }


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
              'payment_method': values.payment_method,
              'balance_paid': parseFloat(values.pay_balance),
              'date': values.payment_date ? values.payment_date : new Date()
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
      paymentTypes,
      tax
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
                  <Input disabled placeholder={`$${formState && formState.tax && formState.tax.toFixed(2)}`} />
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

            {role && (role.type === 'management' || role.type === 'authenticated' || role.type === 'owner' || role.type === 'administrator') ?
              <div>
                <Row>
                  <Col xs='5'>
                    <FormGroup>
                      <Label htmlFor="design">Payment Date</Label>
                      <Field
                        name={'payment_date'}
                        component={renderDateTimePicker}
                        showTime={false}
                      />
                    </FormGroup>
                  </Col>
                </Row>
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

  formState: getFormValues('DoorOrder')(state),
  total: totalSelector(state),
  tax: taxSelector(state),
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
      updateBalance,
      updateStatus
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
