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
import { Field, FieldArray, change } from "redux-form";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cookies from "js-cookie";
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField } from '../../RenderInputs/renderInputs';
import Frame_Only_Table from '../../Table/Doors/Frame_Only_Table'
import Ratio from 'lb-ratio';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
  taxSelector,
  totalSelector,
  addPriceSelector
} from '../../../../../../selectors/doorPricing';

const required = value => (value ? undefined : 'Required');

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

class FaceFrame extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.formState !== prevProps.formState) {
      if (this.props.formState) {
        const update = async () => {
          const form = await this.props.formState;
          const part_list = await form.part_list;


          part_list.forEach((part, i) => {
            if (part.dimensions) {
              part.dimensions.forEach((info, index) => {

                this.props.dispatch(
                  change(
                    'DoorOrder',
                    `part_list[${i}].dimensions[${index}].item`,
                    index + 1
                  )
                )

                if (parseInt(part_list[i].dimensions[index].panelsH) < 2 || parseInt(part_list[i].dimensions[index].panelsW) !== 1) {
                  this.props.dispatch(
                    change(
                      'DoorOrder',
                      `part_list[${i}].dimensions[${index}].unevenCheck`,
                      false
                    )
                  )
                }

                if (parseInt(part_list[i].dimensions[index].panelsH) < 2 || parseInt(part_list[i].dimensions[index].panelsW) !== 1) {
                  this.props.dispatch(
                    change(
                      'DoorOrder',
                      `part_list[${i}].dimensions[${index}].unevenSplit`,
                      false
                    )
                  )
                }

                if (parseInt(part_list[i].dimensions[index].panelsH) < 2 || parseInt(part_list[i].dimensions[index].panelsW) !== 1) {
                  this.props.dispatch(
                    change(
                      'DoorOrder',
                      `part_list[${i}].dimensions[${index}].unevenSplitInput`,
                      '0'
                    )
                  )
                }



                if (parseInt(info.panelsW) > 1) {
                  
                  if (
                    info.panelsW !==
                    prevProps.formState.part_list[i].dimensions[index].panelsW
                  ) {
                    return this.props.dispatch(
                      change(
                        'DoorOrder',
                        `part_list[${i}].dimensions[${index}].verticalMidRailSize`,
                        fraction(2.375)
                      )
                    );
                  }
                }

                if (parseInt(info.panelsH) > 1) {
              
                  if (
                    info.panelsH !==
                    prevProps.formState.part_list[i].dimensions[index].panelsH
                  ) {
                    return this.props.dispatch(
                      change(
                        'DoorOrder',
                        `part_list[${i}].dimensions[${index}].horizontalMidRailSize`,
                        fraction(2.375)
                      ),
                    );
                  }
                }
              });
            } else {
              return;
            }
          })
        };
        update();
      }
    }
  }

  render() {
    const {
      part,
      woodtypes,
      face_frame_designs,
      face_frame_top_rails,
      furniture_feets,
      edges,

      isValid,
      index,
      part_list,
      formState,
      prices
    } = this.props;
    return (
      <div>
        <Row>
          <Col xs="4">
            <FormGroup>
              <Label htmlFor="woodtype">Woodtype</Label>
              <Field
                name={`${part}.woodtype`}
                component={renderDropdownListFilter}
                data={woodtypes}
                valueField="value"
                textField="NAME"
                validate={required}
              />
            </FormGroup>
          </Col>

          <Col xs="4">
            <FormGroup>
              <Label htmlFor="design">Design</Label>
              <Field
                name={`${part}.design`}
                component={renderDropdownListFilter}
                data={face_frame_designs}
                valueField="value"
                textField="NAME"
                validate={required}
              />
            </FormGroup>
          </Col>

          <Col xs="4">
            <FormGroup>
              <Label htmlFor="mould">Edge</Label>
              <Field
                name={`${part}.edge`}
                component={renderDropdownList}
                data={edges}
                valueField="value"
                textField="NAME"
                validate={required}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>

        <Col xs="6">
            <FormGroup>
              <Label htmlFor="hinges">Top Rail Design</Label>
              <Field
                name={`${part}.face_frame_top_rail`}
                component={renderDropdownList}
                data={face_frame_top_rails}
                valueField="value"
                textField="NAME"
                validate={required}
              />
            </FormGroup>
          </Col>


          <Col xs="6">
            <FormGroup>
              <Label htmlFor="hinges">Furniture Feet</Label>
              <Field
                name={`${part}.furniture_feet`}
                component={renderDropdownList}
                data={furniture_feets}
                valueField="value"
                textField="NAME"
                validate={required}
              />
            </FormGroup>
          </Col>

        </Row>

        <Row className="mt-2">
          <Col xs="4">
            <FormGroup>
              <strong>
                <Label for="jobNotes">Job Notes</Label>
                <Field
                  name={`${part}.notes`}
                  type="textarea"
                  component={renderField}
                />
              </strong>
            </FormGroup>
          </Col>
        </Row>

        <div>
          <CardSubtitle className="mt-4 mb-1">Dimensions</CardSubtitle>
          <div className="mt-1" />
          <FieldArray
            name={`${part}.dimensions`}
            component={Frame_Only_Table}
            i={index}
            prices={prices}
            // subTotal={subTotal}
            part_list={part_list}
            formState={formState}
            isValid={isValid}
            part={part}
          // updateSubmit={updateSubmit}
          />
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  woodtypes: state.part_list.woodtypes,
  face_frame_designs: state.part_list.face_frame_designs,
  face_frame_top_rails: state.part_list.face_frame_top_rails,
  furniture_feets: state.part_list.furniture_feets,
  edges: state.part_list.edges,
  prices: linePriceSelector(state),
});

export default connect(
  mapStateToProps,
  null
)(FaceFrame);
