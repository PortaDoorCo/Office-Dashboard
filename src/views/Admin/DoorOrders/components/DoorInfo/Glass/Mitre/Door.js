import React, { Component } from 'react';
import {
  Row,
  Col,
  CardSubtitle,
  FormGroup,
  Label
} from 'reactstrap';
import { Field, FieldArray, change } from 'redux-form';
import { connect } from 'react-redux';

import { renderDropdownList, renderDropdownListFilter, renderField } from '../../../../../../../components/RenderInputs/renderInputs';
import Miter_Table from '../../../Table/Doors/Miter_Table';
import Ratio from 'lb-ratio';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector
} from '../../../../../../../selectors/doorPricing';

const required = value => (value ? undefined : 'Required');
const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};


class MiterDoor extends Component {

  onChangeProfile = () => {
    const part_list = this.props.formState.part_list;
    const { index } = this.props;
    const part = part_list[index];

    if (part.dimensions) {
      part.dimensions.forEach((info, j) => {
        this.props.dispatch(
          change(
            'DoorOrder',
            `part_list[${index}].dimensions[${j}].leftStile`,
            fraction(part.miter_design ? part.miter_design.PROFILE_WIDTH : 0)
          )
        );

        this.props.dispatch(
          change(
            'DoorOrder',
            `part_list[${index}].dimensions[${j}].rightStile`,
            fraction(part.miter_design ? part.miter_design.PROFILE_WIDTH : 0)
          )
        );


        this.props.dispatch(
          change(
            'DoorOrder',
            `part_list[${index}].dimensions[${j}].topRail`,
            fraction(part.miter_design ? (part.miter_design.PROFILE_WIDTH + part.miter_design.TOP_RAIL_ADD) : 0)
          )
        );


        this.props.dispatch(
          change(
            'DoorOrder',
            `part_list[${index}].dimensions[${j}].bottomRail`,
            fraction(part.miter_design ? (part.miter_design.PROFILE_WIDTH + part.miter_design.BTM_RAIL_ADD) : 0)
          )
        );



        if (parseInt(info.panelsH) > 1) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${index}].dimensions[${j}].horizontalMidRailSize`,
              fraction(part.miter_design ? part.miter_design.PROFILE_WIDTH : 0)
            )
          );
        }

        if (parseInt(info.panelsW) > 1) {
          this.props.dispatch(
            change(
              'DoorOrder',
              `part_list[${index}].dimensions[${j}].verticalMidRailSize`,
              fraction(part.miter_design ? part.miter_design.PROFILE_WIDTH : 0)
            )
          );
        }
      });
    } else {
      return;
    }
  }

  render() {
    const {
      part,
      woodtypes,
      miter_designs,
      panels,
      applied_moulds,
      finishes,
      isValid,
      index,
      part_list,
      formState,
      prices,
      subTotal,
      lites
    } = this.props;
    return (
      <div>
        <Row>
          <Col xs="12" md='12' lg="4">
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

          <Col xs="12" md='12' lg="4">
            <FormGroup>
              <Label htmlFor="design">Design</Label>
              <Field
                name={`${part}.miter_design`}
                component={renderDropdownListFilter}
                data={miter_designs}
                onBlur={() => this.onChangeProfile()}
                valueField="value"
                textField="NAME"
                validate={required}
              />
            </FormGroup>
          </Col>

          <Col xs="12" md='12' lg="4">
          <FormGroup>
              <Label htmlFor="design">Lites</Label>
              <Field
                name={`${part}.lite`}
                component={renderDropdownListFilter}
                data={lites}
                valueField="value"
                textField="NAME"
                validate={required}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md='12' lg="6">
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

          <Col xs="12" md='12' lg="6">
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
          <Col xs="12" md='12' lg="4">
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
            component={Miter_Table}
            i={index}
            prices={prices}
            subTotal={subTotal}
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
  miter_designs: state.part_list.miter_designs,
  edges: state.part_list.edges,
  finishes: state.part_list.finishes,
  panels: state.part_list.panels,
  profiles: state.part_list.profiles,
  applied_moulds: state.part_list.applied_moulds,
  finishes: state.part_list.finishes,
  lites: state.part_list.lites,

  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
});



export default connect(
  mapStateToProps,
  null
)(MiterDoor);
