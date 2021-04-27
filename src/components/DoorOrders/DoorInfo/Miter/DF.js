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
import { renderDropdownListFilter, renderCheckboxToggle, renderTextField } from '../../../RenderInputs/renderInputs';
import Miter_Table from '../../Table/DFs/Miter_Table';
import Ratio from 'lb-ratio';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector
} from '../../../../selectors/doorPricing';

const required = value => (value ? undefined : 'Required');

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

class MiterDF extends Component {

  onChangeProfile = (p, ind) => {
    
    const { formState } = this.props;

    const part = formState.part_list[ind];

    if(part.dimensions){
      part.dimensions.forEach((info, index) => {
        if(info){
          this.props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].leftStile`,
              fraction(part.miter_df_design ? part.miter_df_design.PROFILE_WIDTH : 0)
            )
          );

          this.props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].rightStile`,
              fraction(part.miter_df_design ? part.miter_df_design.PROFILE_WIDTH : 0)
            )
          );

          if (info.full_frame) {
            this.props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].topRail`,
                fraction(part.miter_df_design ? part.miter_df_design.PROFILE_WIDTH : 0)
              )
            );


            this.props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].bottomRail`,
                fraction(part.miter_df_design ? part.miter_df_design.PROFILE_WIDTH : 0)
              )
            );
          } else {
            this.props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].topRail`,
                fraction(part.miter_df_design ? part.miter_df_design.PROFILE_WIDTH : 0)
              )
            );


            this.props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].bottomRail`,
                fraction(part.miter_df_design ? part.miter_df_design.PROFILE_WIDTH : 0)
              )
            );
          }
        } else {
          return null;
        }
      });
    } else {
      return null;
    }
  }

  onChangeWoodtype = (p, ind) => {
    const { formState } = this.props;
    const part = formState.part_list[ind];
    if(part.woodtype && part.woodtype.VERTICAL_GRAIN){
      this.props.dispatch(
        change(
          'DoorOrder',
          `${p}.VERTICAL_GRAIN`,
          true
        )
      );
    } else {
      this.props.dispatch(
        change(
          'DoorOrder',
          `${p}.VERTICAL_GRAIN`,
          false
        )
      );
    }
  }

  render() {
    const {
      part,
      woodtypes,
      miter_designs,
      panels,
      isValid,
      index,
      part_list,
      formState,
      prices,
      subTotal,
      edit,
      one_piece,
      updateSubmit,
      door_piece_number
    } = this.props;

    const one_piece_wood = woodtypes.filter(wood => wood.one_piece === true);
    return (
      <div>
        <Row>
          <Col xs="4">
            <FormGroup>
              <Label htmlFor="woodtype">Woodtype</Label>
              <Field
                name={`${part}.woodtype`}
                component={renderDropdownListFilter}
                data={one_piece ? one_piece_wood : woodtypes}
                valueField="value"
                textField="NAME"
                onBlur={() => this.onChangeWoodtype(part, index)}
                validate={required}
                edit={edit}
              />
            </FormGroup>
          </Col>

          <Col xs="4">
            <FormGroup>
              <Label htmlFor="design">Design</Label>
              <Field
                name={`${part}.miter_df_design`}
                component={renderDropdownListFilter}
                data={miter_designs}
                valueField="value"
                textField="NAME"
                validate={required}
                edit={edit}
                onBlur={() => this.onChangeProfile(part, index)}
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
                edit={edit}
              />
            </FormGroup>
          </Col>

        </Row>

        <Row>
          <Col xs="4">
            <FormGroup>
              <Label htmlFor="arches"># of Pieces</Label>
              <Field
                name={`${part}.door_piece_number`}
                component={renderDropdownListFilter}
                data={door_piece_number}
                valueField="value"
                textField="name"
                validate={required}
                edit={edit}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs='12' sm='4' md='4' lg='4'>
            <FormGroup>
              <Label htmlFor="arches"><strong>Grain Direction</strong></Label>
              <Row>
                <Col>
                Horiz
                </Col>
                <Col>
                  <Field
                    name={`${part}.VERTICAL_GRAIN`}
                    component={renderCheckboxToggle}
                    edit={edit}
                  />
                </Col>
                <Col>
                Vertical
                </Col>
              </Row>

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
                  component={renderTextField}
                  edit={edit}
                />
              </strong>
            </FormGroup>
          </Col>
        </Row>

        <div>
          <CardSubtitle className="mt-4 mb-1"><strong>Dimensions</strong></CardSubtitle>
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
            edit={edit}
            updateSubmit={updateSubmit}
          />
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  woodtypes: state.part_list.woodtypes,
  miter_designs: state.part_list.miter_df_designs,
  panels: state.part_list.panels,
  finishes: state.part_list.finish,
  door_piece_number: state.part_list.door_piece_number,
  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
});


export default connect(
  mapStateToProps,
  null
)(MiterDF);
