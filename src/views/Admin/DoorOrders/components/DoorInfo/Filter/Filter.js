import React, { Component, Fragment } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Label,
} from 'reactstrap';
import { connect } from 'react-redux';
import { Field, change,  untouch} from 'redux-form';
import { renderDropdownList } from '../../../../../../components/RenderInputs/renderInputs';
<<<<<<< HEAD

const required = value => (value ? undefined : 'Required');

=======


const required = value => (value ? undefined : 'Required');


>>>>>>> staging
class DoorFilter extends Component {

  onChangeType = (index) => {
    
    if (this.props.formState) {
      this.props.formState.part_list.forEach((part, i) => {
        if (index === i && part.dimensions) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions`,
              []
            )
          );
        }

        if (index === i && part.cope_design) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].cope_design`,
            )
          );

          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].cope_design`,
            )
          );
        }

        if (index === i && part.miter_design) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].miter_design`,
            )
          );

          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].miter_design`,
            )
          );
        }

        if (index === i && part.mt_design) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].mt_design`,
            )
          );

          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].mt_design`,
            )
          );
        }

        if (index === i && part.miter_df_design) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].miter_df_design`,
            )
          );

          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].miter_df_design`,
            )
          );
        }

        

        if (index === i && part.woodtype) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].woodtype`,
            )
          );
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].woodtype`,
            )
          );
        }

        if (index === i && part.edge) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].edge`,
            )
          );
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].edge`,
            )
          );
        }

        if (index === i && part.panel) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].panel`,
            )
          );
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].panel`,
            )
          );
        }

        if (index === i && part.profile) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].profile`,
            )
          );
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].profile`,
            )
          );
        }

        if (index === i && part.applied_profile) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].applied_profile`,
            )
          );
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].applied_profile`,
            )
          );
        }

        if (index === i && part.finish) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].finish`,
            )
          );
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].finish`,
            )
          );
        }

        if (index === i && part.face_frame_top_rail) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].face_frame_top_rail`,
            )
          );
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].face_frame_top_rail`,
            )
          );
        }

        if (index === i && part.furniture_feet) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].furniture_feet`,
            )
          );
          this.props.dispatch(
            untouch(
              'DoorOrder',
              `part_list[${i}].furniture_feet`,
            )
          );
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



    if (formState && formState.part_list) {
      if ((formState.part_list[index].orderType.value === 'Door') || (formState.part_list[index].orderType.value === 'DF')) {
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
        );
      }
      if (formState.part_list[index].orderType.value === 'Frame_Only') {
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
        );
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
                    validate={required}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Fragment>
        );
      }

    } else {
      return null;
    }
  }
}


export default connect()(DoorFilter);