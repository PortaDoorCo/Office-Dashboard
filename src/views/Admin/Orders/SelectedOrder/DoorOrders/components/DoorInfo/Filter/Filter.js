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
import { Field, change, untouch } from "redux-form";
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField } from '../../RenderInputs/renderInputs'
import { connect } from 'react-redux'

const required = value => (value ? undefined : 'Required');






const DoorFilter = ({ formState, index, part, construction, thickness, orderType, edit, dispatch }) => {

  const onChangeType = (index) => {
    if (this.props.formState) {
      this.props.formState.part_list.forEach((part, i) => {
        if (index === i && part.dimensions) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions`,
              []
            )
          )
        }

        if (index === i && part.cope_design) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].cope_design`,
            )
          )

          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].cope_design`,
            )
          )
        }

        if (index === i && part.miter_design) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].miter_design`,
            )
          )

          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].miter_design`,
            )
          )
        }

        if (index === i && part.mt_design) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].mt_design`,
            )
          )

          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].mt_design`,
            )
          )
        }

        if (index === i && part.miter_df_design) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].miter_df_design`,
            )
          )

          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].miter_df_design`,
            )
          )
        }

        if (index === i && part.woodtype) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].woodtype`,
            )
          )
          dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].woodtype`,
            )
          )
        }

        if (index === i && part.edge) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].edge`,
            )
          )
          dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].edge`,
            )
          )
        }

        if (index === i && part.panel) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].panel`,
            )
          )
          dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].panel`,
            )
          )
        }

        if (index === i && part.profile) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].profile`,
            )
          )
          dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].profile`,
            )
          )
        }

        if (index === i && part.applied_profile) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].applied_profile`,
            )
          )
          dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].applied_profile`,
            )
          )
        }

        if (index === i && part.finish) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].finish`,
            )
          )
          dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].finish`,
            )
          )
        }

        if (index === i && part.face_frame_top_rail) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].face_frame_top_rail`,
            )
          )
          dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].face_frame_top_rail`,
            )
          )
        }

        if (index === i && part.furniture_feet) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].furniture_feet`,
            )
          )
          dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].furniture_feet`,
            )
          )
        }

      });

    }
  }

  if (formState && formState.part_list) {
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
                  onChange={() => onChangeType(index)}
                  valueField="value"
                  textField="name"
                  validate={required}
                  edit={edit}
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
                  onChange={() => onChangeType(index)}
                  valueField="value"
                  textField="name"
                  validate={required}
                  edit={edit}
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
                  edit={edit}
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
                  onChange={() => onChangeType(index)}
                  valueField="value"
                  textField="name"
                  validate={required}
                  edit={edit}
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
                  edit={edit}
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
                  onChange={() => onChangeType(index)}
                  valueField="value"
                  textField="name"
                  validate={required}
                  edit={edit}
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

export default connect()(DoorFilter);