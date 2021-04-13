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
import { renderDropdownListFilter, renderTextField } from '../../../../RenderInputs/renderInputs';
import Cope_Table from '../../../Table/Doors/Cope_Table';
import Ratio from 'lb-ratio';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
  totalSelector,
  addPriceSelector
} from '../../../../../selectors/doorPricing';

const required = value => (value ? undefined : 'Required');

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

class CopeDoor extends Component {

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
              fraction(part.profile ? part.profile.MINIMUM_STILE_WIDTH : 0)
            )
          );

          this.props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].rightStile`,
              fraction(part.profile ? part.profile.MINIMUM_STILE_WIDTH : 0)
            )
          );


          this.props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].topRail`,
              fraction(part.profile ? (part.profile.MINIMUM_STILE_WIDTH) : 0)
            )
          );


          this.props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].bottomRail`,
              fraction(part.profile ? (part.profile.MINIMUM_STILE_WIDTH) : 0)
            )
          );



          if (parseInt(info.panelsH) > 1) {
            this.props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].horizontalMidRailSize`,
                fraction(part.profile ? part.profile.MID_RAIL_MINIMUMS : 0)
              )
            );
          } 



          if (parseInt(info.panelsW) > 1) {
            this.props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].verticalMidRailSize`,
                fraction(part.profile ? part.profile.MID_RAIL_MINIMUMS : 0)
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

  render() {
    const {
      part,
      woodtypes,
      cope_designs,
      edges,
      profiles,
      panels,
      applied_moulds,
      isValid,
      index,
      part_list,
      formState,
      edit,
      prices,
      subTotal,
      addPrice,
      one_piece,
      updateSubmit,

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
                validate={required}
                edit={edit}
              />
            </FormGroup>
          </Col>

          <Col xs="4">
            <FormGroup>
              <Label htmlFor="design">Design</Label>
              <Field
                name={`${part}.cope_design`}
                component={renderDropdownListFilter}
                data={cope_designs}
                valueField="value"
                textField="NAME"
                validate={required}
                edit={edit}
              />
            </FormGroup>
          </Col>

          <Col xs="4">
            <FormGroup>
              <Label htmlFor="mould">Edge</Label>
              <Field
                name={`${part}.edge`}
                component={renderDropdownListFilter}
                data={edges}
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
              <Label htmlFor="edge">Profile</Label>
              <Field
                name={`${part}.profile`}
                component={renderDropdownListFilter}
                data={profiles}
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
                edit={edit}
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
            component={Cope_Table}
            i={index}
            prices={prices}
            subTotal={subTotal}
            part_list={part_list}
            formState={formState}
            isValid={isValid}
            part={part}
            edit={edit}
            addPrice={addPrice}
            updateSubmit={updateSubmit}
          />
        </div>

      </div>
    );
  }
}


const mapStateToProps = (state, props) => ({
  woodtypes: state.part_list.woodtypes,
  cope_designs: state.part_list.cope_designs,
  edges: state.part_list.edges,
  finishes: state.part_list.finish,
  panels: state.part_list.panels,
  profiles: state.part_list.profiles,
  applied_moulds: state.part_list.applied_profiles,
  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
  total: totalSelector(state),
  addPrice: addPriceSelector(state),

});


export default connect(
  mapStateToProps,
  null
)(CopeDoor);
