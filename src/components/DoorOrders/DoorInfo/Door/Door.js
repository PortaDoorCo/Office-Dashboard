import React, { Component } from 'react';
import { Row, Col, CardSubtitle, FormGroup, Label } from 'reactstrap';
import { Field, FieldArray, change } from 'redux-form';
import { connect } from 'react-redux';
import {
  renderDropdownListFilter,
  renderTextField,
  renderNumber,
} from '../../../RenderInputs/renderInputs';
import Table from '../../Table/Door/Table';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
  totalSelector,
  addPriceSelector,
} from '../../../../selectors/doorPricing';
import fraction from '../../../../utils/fraction';

import changeProfile from '../Functions/changeProfile';
import changeDesign from '../Functions/changeDesign';
import ModalUtil from '../../../../utils/Modal';

const required = (value) => (value ? undefined : 'Required');

class Door extends Component {


  state = {
    title: 'Reminder',
    message: 'The Edge You Selected Cannot Be Drilled For Concealed Hinges',
    modal: false
  };

  toggle = () => {
    this.setState({modal: !this.state.modal});
  }

  lipWarning = () => {
    const { dispatch, index, part, formState } = this.props;
    const edge = formState?.part_list[index]?.edge;

    

    switch(edge?.NAME) {
      case 'A Lip':
        // code block
        this.toggle();
        break;
      case 'B Lip':
        // code block
        this.toggle();
        break;
      case 'D Lip':
        // code block
        this.toggle();
        break;
      case 'E Lip':
        // code block
        this.toggle();
        break;
      case 'L Lip':
        // code block
        this.toggle();
        break;
      case 'P Lip':
        // code block
        this.toggle();
        break;
      case 'Q Lip':
        // code block
        this.toggle();
        break;
      case 'T Lip':
        // code block
        this.toggle();
        break;
      case 'W Lip':
        // code block
        this.toggle();
        break;

      default:
        // code block
        return null;
    }

  }





  onChange = (e) => {
    const { dispatch, index, part, formState } = this.props;

    const leftStile = formState?.part_list[index]?.leftStile;
    const rightStile = formState?.part_list[index]?.rightStile;
    const topRail = formState?.part_list[index]?.topRail;
    const bottomRail = formState?.part_list[index]?.bottomRail;

    const value = e.target?.value;
    
    if(e.target?.name.includes('leftStile')){
      dispatch(
        change('DoorOrder', `part_list[${index}].notes`, `Left Stile: ${e.target.value}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}"`)
      );
    }
    if(e.target?.name.includes('rightStile')){
      dispatch(
        change('DoorOrder', `part_list[${index}].notes`, `Left Stile: ${leftStile}" Right Stile: ${value}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}"`)
      );
    }
    if(e.target?.name.includes('topRail')){
      dispatch(
        change('DoorOrder', `part_list[${index}].notes`, `Left Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${value}" Bottom Rail: ${bottomRail}"`)
      );
    }
    if(e.target?.name.includes('bottomRail')){
      dispatch(
        change('DoorOrder', `part_list[${index}].notes`, `Left Stile: ${leftStile}" Right Stile: ${rightStile}" \nTop Rail: ${topRail}" Bottom Rail: ${value}"`)
      );
    } 

  }


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
      updateSubmit,
    } = this.props;

    let construction = formState?.part_list[index]?.construction?.value;
    let orderType = formState?.part_list[index]?.orderType?.value;
    let thickness = formState?.part_list[index]?.thickness?.db_name;
    let topRailAdd = formState?.part_list[index]?.design?.TOP_RAIL_ADD ? formState?.part_list[index]?.design?.TOP_RAIL_ADD : 0;
    let bottomRailAdd = formState?.part_list[index]?.design?.BTM_RAIL_ADD ? formState?.part_list[index]?.design?.BTM_RAIL_ADD : 0;

    const filtered_woodtypes = woodtypes.filter((wood) => wood[thickness]);
    const one_piece_wood = woodtypes.filter((wood) => wood.one_piece === true);
    const two_piece_wood = woodtypes.filter((wood) => wood.two_piece === true);
    const filtered_designs = designs.filter(
      (design) =>
        design.CONSTRUCTION === construction && design.ORDERTYPE === 'Door'
    );

    return (
      <div>
        <ModalUtil
          toggle={this.toggle}
          title={this.state.title}
          message={this.state.message}
          modal={this.state.modal}
        />
        <Row>
          <Col>
            <FormGroup>
              <Label htmlFor="woodtype">Woodtype</Label>
              <Field
                name={`${part}.woodtype`}
                component={renderDropdownListFilter}
                data={
                  orderType === 'One_Piece'
                    ? one_piece_wood
                    : orderType === 'Two_Piece'
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
                  onBlur={() => this.lipWarning()}
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

        <hr />

        <Row>
          <Col>
            <h5>
              <strong>Default Framing Size</strong>
            </h5>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormGroup>
              <Label htmlFor="arches">Top Rail {topRailAdd > 0 ? `+ Arch ${fraction(topRailAdd)}"` : null}</Label>
              <Field
                name={`${part}.topRail`}
                type="text"
                component={renderNumber}
                label="topRail"
                edit={construction === 'Miter' ? true : edit}
                validate={required}
                onChange={(e) => this.onChange(e)}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label htmlFor="arches">Bottom Rail {bottomRailAdd > 0 ? `+ Arch ${fraction(bottomRailAdd)}"` : null}</Label>
              <Field
                name={`${part}.bottomRail`}
                type="text"
                component={renderNumber}
                label="bottomRail"
                edit={construction === 'Miter' ? true : edit}
                validate={required}
                onChange={(e) => this.onChange(e)}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label htmlFor="arches">Left Stile</Label>
              <Field
                name={`${part}.leftStile`}
                type="text"
                component={renderNumber}
                label="leftStile"
                edit={construction === 'Miter' ? true : edit}
                validate={required}
                onChange={(e) => this.onChange(e)}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label htmlFor="arches">Right Stile</Label>
              <Field
                name={`${part}.rightStile`}
                type="text"
                component={renderNumber}
                label="rightStile"
                edit={construction === 'Miter' ? true : edit}
                validate={required}
                onChange={(e) => this.onChange(e)}
              />
            </FormGroup>
          </Col>

        </Row>

        <hr />

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
                <p>Enter Item Build Note Here - Framing/Wood, etc.</p>
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
