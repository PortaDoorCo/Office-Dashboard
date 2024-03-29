import React, { Component, useState } from 'react';
import {
  Table,
  Row,
  Col,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { getFormValues, reduxForm, FieldArray } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  totalSelector,
  balanceSelector,
  balanceTotalSelector,
} from '../../../../selectors/pricing';
import DatePicker from 'react-widgets/DatePicker';
import { Field } from 'redux-form';
import {
  renderDropdownList,
  renderPrice,
} from '../../../../components/RenderInputs/renderInputs';
import { updateOrder } from '../../../../redux/orders/actions';
import Cookies from 'js-cookie';
import currencyMask from '../../../../utils/currencyMask';

const cookie = Cookies.get('jwt');

const renderDateTimePicker = ({
  input: { onChange, value },
  showTime,
  edit,
}) => (
  <div>
    <DatePicker
      onChange={onChange}
      time={showTime}
      value={!value ? null : new Date(value)}
      disabled={edit}
    />
  </div>
);

const RenderBalances = ({
  fields,
  balance_history_paid,
  paymentTypes,
  edit,
  submit,
}) => {
  const [modal, setModal] = useState(false);
  const [index, setIndex] = useState(null);
  const toggle = async (i) => {
    if (!index) {
      await setIndex(i);
      await setModal(!modal);
    } else {
      await setIndex(null);
      await setModal(!modal);
    }
  };

  const deleteBalance = async () => {
    await fields.remove(index);
    await submit();
    await setModal(!modal);
  };

  return (
    <div>
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Are You Sure?</ModalHeader>
          <ModalBody>Are You Sure You Want To Delete This?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={deleteBalance}>
              Yes
            </Button>{' '}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Payment Date</th>
            <th>Balance Due</th>
            <th>Deposit Paid</th>
            <th>Balance Paid</th>
            <th>Payment Method</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields
            .map((i, index) => (
              <tr key={index}>
                <td>
                  <Field
                    name={`${i}.date`}
                    showTime={false}
                    edit={edit}
                    component={renderDateTimePicker}
                  />
                </td>
                <th>
                  <Input
                    placeholder={`$${balance_history_paid[index].toFixed(2)}`}
                    disabled
                  />
                </th>
                <td>
                  <Field
                    name={`${i}.deposit_paid`}
                    type="text"
                    component={renderPrice}
                    edit={false}
                    {...currencyMask}
                    label="deposit_paid"
                  />
                </td>
                <td>
                  <Field
                    name={`${i}.balance_paid`}
                    type="text"
                    component={renderPrice}
                    edit={false}
                    {...currencyMask}
                    label="balance_paid"
                  />
                </td>
                <td>
                  <Field
                    name={`${i}.payment_method`}
                    component={renderDropdownList}
                    data={paymentTypes}
                    dataKey="value"
                    edit={!edit}
                    // validate={required}
                    textField="NAME"
                  />
                </td>
                <td>
                  {!edit ? (
                    <Button onClick={() => toggle(index)} color="danger">
                      X
                    </Button>
                  ) : null}
                </td>
              </tr>
            ))
            .slice(1)
            .reverse()}
        </tbody>
      </Table>
    </div>
  );
};

class BalanceHistory extends Component {
  state = {
    modal: false,
  };

  toggle = (index) => {
    alert(index);
    this.setState({
      modal: !this.state.modal,
    });
  };

  render() {
    const {
      formState,
      total,
      edit,
      paymentTypes,
      handleSubmit,
      editable,
      reset,
    } = this.props;

    let updated_total = total;

    const balance_history_paid =
      formState &&
      formState.balance_history?.slice(0).map((i, index) => {
        updated_total =
          updated_total -
          parseFloat(i.balance_paid || 0) -
          parseFloat(i.deposit_paid || 0);
        return updated_total;
      });

    const balance_paid_history =
      formState && formState.balance_history
        ? formState.balance_history?.map((i) => {
            if (i.balance_paid) {
              return i.balance_paid;
            } else if (i.deposit_paid) {
              return i.deposit_paid;
            } else {
              return 0;
            }
          })
        : [0];
    const balance_paid_total = balance_paid_history.reduce(
      (acc, item) => acc + item,
      0
    );

    const onKeyPress = (event) => {
      if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
        event.preventDefault();
      }
    };

    const submit = async (values, dispatch) => {
      const { updateOrder } = this.props;

      const order = {
        balance_history: values.balance_history,
      };

      const orderId = values.id;
      await updateOrder(orderId, order, cookie);
      await this.props.editable();
    };

    if (formState) {
      return (
        <div>
          <form onKeyPress={onKeyPress} onSubmit={handleSubmit(submit)}>
            <FieldArray
              name="balance_history"
              component={RenderBalances}
              balance_paid_history={balance_paid_history}
              balance_history_paid={balance_history_paid}
              balance_paid_total={balance_paid_total}
              paymentTypes={paymentTypes}
              edit={edit}
              toggle={this.toggle}
              modal={this.state.modal}
              reset={reset}
              submit={handleSubmit(submit)}
            />

            <Row className="mt-3">
              <Col>
                <h3>Order Total:</h3>${total.toFixed(2)}
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <h3>Total Paid:</h3>${balance_paid_total.toFixed(2)}
              </Col>
            </Row>
            <hr />
            <Row className="mt-3">
              <Col>
                <h3>Balance Due:</h3>${updated_total.toFixed(2)}
              </Col>
            </Row>
          </form>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = (state, prop) => ({
  formState: getFormValues('Order')(state),
  balanceTotal: balanceTotalSelector(state),
  balance: balanceSelector(state),
  total: totalSelector(state),
  paymentTypes: state.misc_items.paymentTypes,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateOrder,
    },
    dispatch
  );

BalanceHistory = reduxForm({
  form: 'Order',
})(BalanceHistory);

export default connect(mapStateToProps, mapDispatchToProps)(BalanceHistory);
