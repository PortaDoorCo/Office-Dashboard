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
  totalSelector
} from '../../../selectors/doorPricing';

const required = value => (value ? undefined : 'Required');

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

class Balance extends Component {
  constructor(props) {
    super(props);
  }




  render() {
    const {
      formState

    } = this.props;

    if (formState) {
      return (
        <div>


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

            <Col xs="2">
              <FormGroup>
                <Label htmlFor="design">Total Due</Label>
                <Field
                  name='balance_paid'
                  type="text"
                  edit={true}
                  component={renderField}
                  label="balance_paid" />
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

            <Col xs="2">
              <FormGroup>
                <Label htmlFor="Total">Discount</Label>
                <Field
                  name='discount'
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
                <Label htmlFor="design">Balance Paid</Label>
                <Field
                  name='balance_paid'
                  type="text"
                  component={renderField}
                  label="balance_paid" />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col xs='4'>
              <Button color="primary">Pay</Button>
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


const mapStateToProps = (state, props) => ({

  formState: getFormValues('DoorOrder')(state),
  total: totalSelector(state),

});

Balance = reduxForm({
  form: 'DoorOrder',
})(Balance);


export default connect(
  mapStateToProps,
  null
)(Balance);
