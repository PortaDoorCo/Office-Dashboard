import React, { Component, useState, Fragment, useEffect } from "react";
import {
  Row,
  Col,
  CardSubtitle,
  FormGroup,
  Label,
  Button,
  Input
} from "reactstrap";
import { Field, FieldArray, reduxForm, change, reset, getFormValues } from "redux-form";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cookies from "js-cookie";
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField } from './SelectedOrder/DoorOrders/components/RenderInputs/renderInputs'

import Ratio from 'lb-ratio';
import {
  totalSelector,
  balanceSelector,
  subTotal_Total
} from '../../../selectors/doorPricing';
import { updateOrder } from '../../../redux/orders/actions'


const cookie = Cookies.get("jwt");

const required = value => (value ? undefined : 'Required');

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

class Balance extends Component {
  constructor(props) {
    super(props);
  }

  changeBalance = () => {
    this.props.dispatch(
      change(
        'DoorOrder',
        'balance_due',
        this.props.balance.toFixed("2")
      )
    );
  }

  cancel = () => {
    this.props.dispatch(
      change(
        'DoorOrder',
        'balance_paid',
        this.props.selectedOrder[0].balance_paid
      )
    );

    this.props.dispatch(
      change(
        'DoorOrder',
        'balance_due',
        this.props.selectedOrder[0].balance_due
      )
    );
  }

  submit = async (values) => {
    console.log(values)

    const { updateOrder } = this.props;

    const id = values.id

    const order = {
      balance_due: values.balance_due,
      balance_paid: values.balance_paid
    }

    await updateOrder(id, order, cookie);
    await this.props.toggleBalance();

  }


  render() {
    const {
      formState,
      balance,
      handleSubmit,
      selectedOrder
    } = this.props;

    console.log(selectedOrder)

    if (formState) {
      return (
        <div>
          <form onSubmit={handleSubmit(this.submit)}>
            <Row>
              <Col xs="2">
                <FormGroup>
                  <Label htmlFor="Total">Total</Label>
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
              <Col xs="2">
                <FormGroup>
                  <Label htmlFor="Total">Tax</Label>
                  <Field
                    name='tax'
                    type="text"
                    component={renderField}
                    edit={true}
                    label="total" />
                </FormGroup>
              </Col>

              {/* <Col xs="2">
              <FormGroup>
                <Label htmlFor="Total">Discount</Label>
                <Field
                  name='discount'
                  type="text"
                  component={renderField}
                  edit={true}
                  label="total" />
              </FormGroup>
            </Col> */}
            </Row>

            <Row>
              <Col xs="2">
                <FormGroup>
                  <Label htmlFor="design">Balance Paid</Label>
                  <Field
                    name='balance_paid'
                    type="text"
                    onBlur={this.changeBalance}
                    component={renderField}
                    label="balance_paid" />
                </FormGroup>
              </Col>
            </Row>

            <hr />

            <Row>
              <Col xs="2">
                <FormGroup>
                  <Label htmlFor="design">Total Due</Label>
                  <Field
                    name='balance_due'
                    type="text"
                    edit={true}
                    component={renderField}
                    label="total_due" />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col xs='3'>
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
      )
    }

  }
}


const mapStateToProps = (state, props) => ({

  formState: getFormValues('DoorOrder')(state),
  total: totalSelector(state),
  subTotal: subTotal_Total(state),
  balance: balanceSelector(state),


});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      change,
      updateOrder
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
