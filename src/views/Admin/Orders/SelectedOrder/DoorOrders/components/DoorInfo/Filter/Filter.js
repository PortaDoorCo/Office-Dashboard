import React, { Component, useState, Fragment, useEffect } from "react";
import {
  Row,
  Col,
  FormGroup,
  Label,
} from "reactstrap";
import { connect } from 'react-redux';
import { Field, change, untouch, unregisterField, autofill } from "redux-form";
import { renderDropdownList } from '../../../../../../../../components/RenderInputs/renderInputs'

const required = value => (value ? undefined : 'Required');

class DoorFilter extends Component {
  constructor(props) {
    super(props);
  }

  onChangeType = (index) => {

    if (this.props.formState) {
      this.props.formState.part_list.forEach((part, i) => {

        console.log(untouch)

        if (index === i && part.dimensions) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions`,
              []
            )
          )
        }

        if ((index === i) && (part.cope_design !== undefined)) {
          this.props.dispatch(
            autofill(
              'DoorOrder',
              `part_list[${i}].cope_design`,
              undefined
            )
          )

          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].cope_design`,
            )
          )
        }

        if ((index === i) && (part.miter_design !== undefined)) {
          this.props.dispatch(
            autofill(
              'DoorOrder',
              `part_list[${i}].miter_design`,
              undefined
            )
          )

          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].miter_design`,
            )
          )
        }

        if ((index === i) && (part.mt_design !== undefined)) {
          this.props.dispatch(
            autofill(
              'DoorOrder',
              `part_list[${i}].mt_design`,
              undefined
            )
          )

          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].mt_design`,
            )
          )
        }

        if ((index === i) && (part.miter_df_design !== undefined)) {
          this.props.dispatch(
            autofill(
              'DoorOrder',
              `part_list[${i}].miter_df_design`,
              undefined
            )
          )

          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].miter_df_design`,
            )
          )
        }



        if ((index === i) && (part.woodtype !== undefined)) {
          this.props.dispatch(
            autofill(
              'DoorOrder',
              `part_list[${i}].woodtype`,
              undefined
            )
          )

          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].woodtype`,
            )
          )
        }

        if ((index === i) && (part.edge !== undefined)) {
          this.props.dispatch(
            autofill(
              'DoorOrder',
              `part_list[${i}].edge`,
              undefined
            )
          )
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].edge`,
            )
          )
        }

        if ((index === i) && (part.panel !== undefined)) {
          this.props.dispatch(
            autofill(
              'DoorOrder',
              `part_list[${i}].panel`,
              undefined
            )
          )
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].panel`,
            )
          )
        }

        if ((index === i) && (part.profile !== undefined)) {
          this.props.dispatch(
            autofill(
              'DoorOrder',
              `part_list[${i}].profile`,
              undefined
            )
          )
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].profile`,
            )
          )
        }

        if ((index === i) && (part.applied_profile !== undefined)) {
          this.props.dispatch(
            autofill(
              'DoorOrder',
              `part_list[${i}].applied_profile`,
              undefined
            )
          )
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].applied_profile`,
            )
          )
        }

        if ((index === i) && (part.finish !== undefined)) {
          this.props.dispatch(
            autofill(
              'DoorOrder',
              `part_list[${i}].finish`,
              undefined
            )
          )
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].finish`,
            )
          )
        }

        if ((index === i) && (part.face_frame_top_rail !== undefined)) {
          this.props.dispatch(
            autofill(
              'DoorOrder',
              `part_list[${i}].face_frame_top_rail`,
              undefined
            )
          )
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].face_frame_top_rail`,
            )
          )
        }

        if ((index === i) && (part.furniture_feet !== undefined)) {
          this.props.dispatch(
            autofill(
              'DoorOrder',
              `part_list[${i}].furniture_feet`,
              undefined
            )
          )
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].furniture_feet`,
            )
          )
        }

      });

    }
  }


  render() {

    const {
      formState,
      index,
      part,
      construction,
      thickness,
      orderType,
      edit
    } = this.props;

    console.log("EDIITT", edit)


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
                    onChange={() => this.onChangeType(index)}
                    valueField="value"
                    textField="name"
                    edit={edit}
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
                    onChange={() => this.onChangeType(index)}
                    valueField="value"
                    textField="name"
                    edit={edit}
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
                    edit={edit}
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
                    onChange={() => this.onChangeType(index)}
                    valueField="value"
                    textField="name"
                    edit={edit}
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
                    edit={edit}
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
                    onChange={() => this.onChangeType(index)}
                    valueField="value"
                    textField="name"
                    edit={edit}
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
}


export default connect()(DoorFilter);