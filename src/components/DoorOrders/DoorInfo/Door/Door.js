import React, { Component } from 'react';
import { Row, Col, CardSubtitle, FormGroup, Label } from 'reactstrap';
import { Field, FieldArray, change } from 'redux-form';
import { connect } from 'react-redux';
import {
  renderDropdownListFilter,
  renderTextField,
} from '../../../RenderInputs/renderInputs';
import Table from '../../Table/Door/Table';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
  totalSelector,
  addPriceSelector,
} from '../../../../selectors/doorPricing';

import changeProfile from '../Functions/changeProfile';

const required = (value) => (value ? undefined : 'Required');

class Door extends Component {
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
      edit,
      prices,
      subTotal,
      addPrice,
      one_piece,
      updateSubmit,
    } = this.props;

    const construction = formState?.part_list[index]?.construction?.value;
    const orderType = formState?.part_list[index]?.orderType?.value;

    const one_piece_wood = woodtypes.filter((wood) => wood.one_piece === true);
    const filtered_designs = designs.filter(
      (design) => orderType !== 'Door' || 'DF' ? design.CONSTRUCTION === construction :
        design.CONSTRUCTION === construction && design.ORDERTYPE === orderType
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
                data={orderType === 'One_Piece' || 'Two_Piece' ? one_piece_wood : woodtypes}
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
              />
            </FormGroup>
          </Col>

          {construction === ('Cope' || 'MT') ? (
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
  designs: state.part_list.designs,
  edges: state.part_list.edges,
  finishes: state.part_list.finish,
  panels: state.part_list.panels,
  profiles: state.part_list.profiles,
  applied_moulds: state.part_list.applied_profiles,
  door_piece_number: state.part_list.door_piece_number,
  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
  total: totalSelector(state),
  addPrice: addPriceSelector(state),
});

export default connect(mapStateToProps, null)(Door);
