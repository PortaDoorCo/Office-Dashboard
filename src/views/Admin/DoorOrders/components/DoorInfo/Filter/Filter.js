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
import { connect } from 'react-redux';
import { Field, change, reduxForm, untouch} from "redux-form";
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField } from '../../RenderInputs/renderInputs'


const required = value => (value ? undefined : 'Required');




class DoorFilter extends Component {
  constructor(props) {
    super(props);
  }

  onChangeType = (index) => {
    
    if (this.props.formState) {
      this.props.formState.part_list.forEach((part, i) => {
        console.log('index====>>>', index, 'wooddd==>>', part.woodtype)
        if (index === i && part.dimensions) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions`,
              []
            )
          )
        }

        if (index === i && part.design) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].design`,
            )
          )

          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].design`,
            )
          )
        }

        if (index === i && part.woodtype) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].woodtype`,
            )
          )
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].woodtype`,
            )
          )
        }

        if (index === i && part.edge) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].edge`,
            )
          )
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].edge`,
            )
          )
        }

        if (index === i && part.panel) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].panel`,
            )
          )
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].panel`,
            )
          )
        }

        if (index === i && part.profile) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].profile`,
            )
          )
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].profile`,
            )
          )
        }

        if (index === i && part.applied_profile) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].applied_profile`,
            )
          )
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].applied_profile`,
            )
          )
        }

        if (index === i && part.finish) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].finish`,
            )
          )
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].finish`,
            )
          )
        }

        if (index === i && part.face_frame_top_rail) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].face_frame_top_rail`,
            )
          )
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].face_frame_top_rail`,
            )
          )
        }

        if (index === i && part.furniture_feet) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].furniture_feet`,
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
      orderType
    } = this.props;

console.log('formstate==>>>', formState)

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
                    onChange={this.onChangeType}
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
                    onChange={this.onChangeType}
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
}

const mapStateToProps = state => ({

});


export default connect(
  mapStateToProps,
  null
)(DoorFilter);