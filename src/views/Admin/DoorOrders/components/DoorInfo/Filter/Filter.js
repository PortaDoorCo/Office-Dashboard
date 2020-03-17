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






const DoorFilter = ({ part, construction, thickness, orderType }) => {

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

export default DoorFilter;