import React, { Component, useState, Fragment, useEffect } from "react";
import {
  Row,
  Col,
  CardSubtitle,
  FormGroup,
  Label,
} from "reactstrap";
import { Field, FieldArray, change } from "redux-form";
import { connect } from 'react-redux';
import {  renderDropdownList, renderDropdownListFilter, renderField } from '../../../../../../components/RenderInputs/renderInputs'
import Cope_Table from '../../Table/DFs/Cope_Table'
import Ratio from 'lb-ratio'
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
} from '../../../../../../selectors/doorPricing';

const required = value => (value ? undefined : 'Required');

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

class CopeDF extends Component {
  constructor(props) {
    super(props);
  }

  onChangeProfile = () => {
    const part_list = this.props.formState.part_list
    const { index } = this.props;
    const part = part_list[index]

    if (part.dimensions) {
      part.dimensions.forEach((info, i) => {
        this.props.dispatch(
          change(
            'DoorOrder',
            `part_list[${index}].dimensions[${i}].leftStile`,
            fraction(part.profile ? part.profile.MINIMUM_STILE_WIDTH : 0)
          )
        );

        this.props.dispatch(
          change(
            'DoorOrder',
            `part_list[${index}].dimensions[${i}].rightStile`,
            fraction(part.profile ? part.profile.MINIMUM_STILE_WIDTH : 0)
          )
        );

        if (info.full_frame) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${index}].dimensions[${i}].topRail`,
              fraction(part.profile ? (part.profile.MINIMUM_STILE_WIDTH) : 0)
            )
          );


          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${index}].dimensions[${i}].bottomRail`,
              fraction(part.profile ? (part.profile.MINIMUM_STILE_WIDTH) : 0)
            )
          );
        } else {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${index}].dimensions[${i}].topRail`,
              fraction(part.profile ? (part.profile.DF_Reduction) : 0)
            )
          );


          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${index}].dimensions[${i}].bottomRail`,
              fraction(part.profile ? (part.profile.DF_Reduction) : 0)
            )
          );
        }
      });
    }
  }




  render() {
    const {
      part,
      woodtypes,
      edges,
      profiles,
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

          <Col xs="4">
            <FormGroup>
              <Label htmlFor="edge">Profile</Label>
              <Field
                name={`${part}.profile`}
                component={renderDropdownListFilter}
                data={profiles}
                valueField="value"
                textField="NAME"
                onBlur={() => this.onChangeProfile()}
                validate={required}
              />
            </FormGroup>
          </Col>



          <Col xs="4">
            <FormGroup>
              <Label htmlFor="arches">Applied Profiles</Label>
              <Field
                name={`${part}.applied_profile`}
                component={renderDropdownListFilter}
                data={applied_moulds}
                valueField="value"
                textField="NAME"
                validate={required}
              />
            </FormGroup>
          </Col>

          <Col xs="4">
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
            component={Cope_Table}
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
  edges: state.part_list.edges,
  finishes: state.part_list.finishes,
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
)(CopeDF);
