import React, { useState, Fragment, useEffect } from "react";
import {
  Row,
  Col,
  CardSubtitle,
  FormGroup,
  Label,
  Button,
  Input
} from "reactstrap";
import { Field } from "redux-form";
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField } from '../../RenderInputs/renderInputs'


const required = value => (value ? undefined : 'Required');






const DoorFilter = ({ formState, index, part, construction, thickness, orderType }) => {

  if(formState && formState.part_list){
    if ((formState.part_list[index].orderType.value === "Door") || (formState.part_list[index].orderType.value === "DF")) {
      return (
        <Fragment>
          <Row>
            <Col xs="4">
              <FormGroup>
                <Label for="orderType">Order Type</Label>
                <Field
                  name={`${part}.orderType`}
                  component={renderDropdownList}
                  data={orderType}
                  valueField="value"
                  textField="name"
                  validate={required}
                />
              </FormGroup>
            </Col>
  
            <Col xs="4">
              <FormGroup>
                <Label for="construction">Construction</Label>
                <Field
                  name={`${part}.construction`}
                  component={renderDropdownList}
                  data={construction}
                  valueField="value"
                  textField="name"
                  validate={required}
                />
              </FormGroup>
            </Col>
  
            <Col xs="4">
              <FormGroup>
                <Label for="construction">Thickness</Label>
                <Field
                  name={`${part}.thickness`}
                  component={renderDropdownList}
                  data={thickness}
                  valueField="value"
                  textField="name"
                  validate={required}
                />
              </FormGroup>
            </Col>
          </Row>
        </Fragment>
      )
    } 
    if (formState.part_list[index].orderType.value === "Frame_Only") {
      return (
        <Fragment>
          <Row>
            <Col xs="4">
              <FormGroup>
                <Label for="orderType">Order Type</Label>
                <Field
                  name={`${part}.orderType`}
                  component={renderDropdownList}
                  data={orderType}
                  valueField="value"
                  textField="name"
                  validate={required}
                />
              </FormGroup>
            </Col>
 
            <Col xs="4">
              <FormGroup>
                <Label for="construction">Thickness</Label>
                <Field
                  name={`${part}.thickness`}
                  component={renderDropdownList}
                  data={thickness}
                  valueField="value"
                  textField="name"
                  validate={required}
                />
              </FormGroup>
            </Col>
          </Row>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Row>
            <Col xs="4">
              <FormGroup>
                <Label for="orderType">Order Type</Label>
                <Field
                  name={`${part}.orderType`}
                  component={renderDropdownList}
                  data={orderType}
                  valueField="value"
                  textField="name"
                  validate={required}
                />
              </FormGroup>
            </Col>
          </Row>
        </Fragment>
      )
    }

  } else {
    return null
  }




}

export default DoorFilter;