import React, { Component } from 'react';
import { Row, Col, CardSubtitle, FormGroup, Label } from 'reactstrap';
import { Field, FieldArray, change, touch, startAsyncValidation } from 'redux-form';
import { connect } from 'react-redux';
import {
  renderDropdownListFilter,
  renderTextField,
  renderCheckboxToggle,
} from '../../../RenderInputs/renderInputs';
import Table from '../../Table/DF/Table';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
} from '../../../../selectors/doorPricing';
import changeProfile from '../Functions/changeProfile';
import changeDesign from '../Functions/changeDesign';
import VisibilitySensor from 'react-visibility-sensor';

const required = (value) => (value ? undefined : 'Required');
const noteRequired = (value) => (value ? undefined : 'Enter Item Build Note Here - Framing/Wood, etc.');

class CopeDF extends Component {
  onChangeWoodtype = (p, ind) => {
    const { formState } = this.props;
    const part = formState.part_list[ind];
    if (part.woodtype && part.woodtype.VERTICAL_GRAIN) {
      this.props.dispatch(change('DoorOrder', `${p}.VERTICAL_GRAIN`, true));
    } else {
      this.props.dispatch(change('DoorOrder', `${p}.VERTICAL_GRAIN`, false));
    }
  };

  onNoteAppear = (isVisible) => {

    const { dispatch, index } = this.props;

    if (isVisible) {
      dispatch(
        touch(
          'DoorOrder',
          `part_list[${index}].notes`
        )
      );

      dispatch(
        startAsyncValidation('DoorOrder')
      );
    }
  };


  render() {
    const {
      part,
      woodtypes,
      designs,
      edges,
      profiles,
      panels,
      applied_moulds,
      isValid,
      index,
      part_list,
      formState,
      prices,
      subTotal,
      edit,
      one_piece,
      updateSubmit,
    } = this.props;

    let construction = formState?.part_list[index]?.construction?.value;
    let orderType = formState?.part_list[index]?.orderType?.value;
    let thickness = formState?.part_list[index]?.thickness?.db_name;

    const filtered_woodtypes = woodtypes.filter((wood) => wood[thickness]);
    const one_piece_wood = woodtypes.filter((wood) => wood.one_piece === true);
    const two_piece_wood = woodtypes.filter((wood) => wood.two_piece === true);
    const filtered_designs = designs.filter((design) =>
      (design.CONSTRUCTION === construction) && (design.ORDERTYPE === 'DF')
    );

    return (
      <div>
        <Row>
          <Col>
            <FormGroup>
              <Label htmlFor="woodtype">Woodtype</Label>
              <Field
                name={`${part}.woodtype`}
                component={renderDropdownListFilter}
                data={
                  orderType === 'One_Piece' || orderType === 'One_Piece_DF'
                    ? one_piece_wood
                    : orderType === 'Two_Piece' || orderType === 'Two_Piece_DF'
                      ? two_piece_wood
                      : filtered_woodtypes
                }
                valueField="value"
                textField="NAME"
                validate={required}
                edit={edit}
              />
            </FormGroup>
          </Col>

          <Col>
            <FormGroup>
              <Label htmlFor="design">Design</Label>
              <Field
                name={`${part}.design`}
                component={renderDropdownListFilter}
                data={filtered_designs}
                valueField="value"
                textField="NAME"
                validate={required}
                edit={edit}
                onBlur={() => changeDesign(part, index, this.props, change)}
              />
            </FormGroup>
          </Col>

          {construction === 'Cope' || construction === 'MT' ? (
            <Col>
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
          ) : null}
        </Row>
        <Row>
          {construction === 'Cope' ? (
            <Col>
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
                  onBlur={() => changeProfile(part, index, this.props, change)}
                />
              </FormGroup>
            </Col>
          ) : null}

          <Col>
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

          <Col>
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

        <Row>
          <Col xs="12" sm="4" md="4" lg="4">
            <FormGroup>
              <Label htmlFor="arches">
                <strong>Grain Direction</strong>
              </Label>
              <Row>
                <Col>Horiz</Col>
                <Col>
                  <Field
                    name={`${part}.VERTICAL_GRAIN`}
                    component={renderCheckboxToggle}
                    edit={edit}
                  />
                </Col>
                <Col>Vertical</Col>
              </Row>
            </FormGroup>
          </Col>
        </Row>

        <Row className="mt-2">
          <Col xs="4">
            <VisibilitySensor onChange={this.onNoteAppear}>
              <FormGroup>
                <strong>
                  <Label for="jobNotes">Job Notes</Label>
                  <Field
                    name={`${part}.notes`}
                    type="textarea"
                    component={renderTextField}
                    edit={edit}
                    validate={noteRequired}
                  />
                </strong>
              </FormGroup>
            </VisibilitySensor>
          </Col>
        </Row>

        <div>
          <CardSubtitle className="mt-4 mb-1">
            <strong>Dimensions</strong>
          </CardSubtitle>
          <div className="mt-1" />
          <FieldArray
            name={`${part}.dimensions`}
            component={Table}
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

const mapStateToProps = (state) => ({
  woodtypes: state.part_list.woodtypes,
  designs: state.part_list.designs,
  edges: state.part_list.edges,
  finishes: state.part_list.finish,
  panels: state.part_list.panels,
  profiles: state.part_list.profiles,
  applied_moulds: state.part_list.applied_profiles,
  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
});

export default connect(mapStateToProps, null)(CopeDF);
