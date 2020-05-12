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
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField } from '../../RenderInputs/renderInputs'
import MT_Table from '../../Table/DFs/MT_Table';
import Ratio from 'lb-ratio'
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


class MT_DF extends Component {
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
              });
            } else {
              return;
            }
          })

          part_list.forEach((part, i) => {
            if ((part && part.mt_design) !== (prevProps.formState && prevProps.formState.part_list[i] && prevProps.formState.part_list[i].mt_design)) {
              if (part.dimensions) {
                part.dimensions.forEach((info, index) => {
                  this.props.dispatch(
                    change(
                      'DoorOrder',
                      `part_list[${i}].dimensions[${index}].leftStile`,
                      fraction(part.mt_design ? part.mt_design.MID_RAIL_MINIMUMS : 0)
                    )
                  );

                  this.props.dispatch(
                    change(
                      'DoorOrder',
                      `part_list[${i}].dimensions[${index}].rightStile`,
                      fraction(part.mt_design ? part.mt_design.MID_RAIL_MINIMUMS : 0)
                    )
                  );

                  if(info.full_frame) {
                    this.props.dispatch(
                      change(
                        'DoorOrder',
                        `part_list[${i}].dimensions[${index}].topRail`,
                        fraction(part.mt_design ? part.mt_design.MID_RAIL_MINIMUMS : 0)
                      )
                    );
  
  
                    this.props.dispatch(
                      change(
                        'DoorOrder',
                        `part_list[${i}].dimensions[${index}].bottomRail`,
                        fraction(part.mt_design ? part.mt_design.MID_RAIL_MINIMUMS : 0)
                      )
                    );
                  } else {
                    this.props.dispatch(
                      change(
                        'DoorOrder',
                        `part_list[${i}].dimensions[${index}].topRail`,
                        fraction(part.mt_design ? part.mt_design.DF_Reduction : 0)
                      )
                    );
  
  
                    this.props.dispatch(
                      change(
                        'DoorOrder',
                        `part_list[${i}].dimensions[${index}].bottomRail`,
                        fraction(part.mt_design ? part.mt_design.DF_Reduction : 0)
                      )
                    );
                  }



                });
              } else {
                return
              }
            } else {
              return
            }
          });
        };
        update();
      }
    }
  }


  render() {
    const {
      part,
      woodtypes,
      mt_designs,
      edges,
      panels,
      applied_moulds,
      finishes,

      isValid,
      index,
      part_list,
      formState,
      prices,
      itemPrice,
      subTotal
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
                name={`${part}.mt_design`}
                component={renderDropdownListFilter}
                data={mt_designs}
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
              <Label htmlFor="panel">Panel</Label>
              <Field
                name={`${part}.panel`}
                component={renderDropdownListFilter}
                data={panels}
                valueField="value"
                textField="NAME"
                validate={required}
              />
            </FormGroup>
          </Col>


          <Col xs="6">
            <FormGroup>
              <Label htmlFor="hinges">Finish Color</Label>
              <Field
                name={`${part}.finish`}
                component={renderDropdownList}
                data={finishes}
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
            component={MT_Table}
            i={index}
            prices={prices}
            subTotal={subTotal}
            part_list={part_list}
            formState={formState}
            isValid={isValid}
            part={part}
            dispatch={this.props.dispatch}
          // updateSubmit={updateSubmit}
          />
        </div>

      </div>
    );
  }
}
 

const mapStateToProps = state => ({
  woodtypes: state.part_list.woodtypes,
  mt_designs: state.part_list.mt_designs,
  edges: state.part_list.edges,
  panels: state.part_list.panels,
  profiles: state.part_list.profiles,
  applied_moulds: state.part_list.applied_moulds,
  finishes: state.part_list.finishes,

  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
});


export default connect(
  mapStateToProps,
  null
)(MT_DF);
