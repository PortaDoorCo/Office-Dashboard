import React, { Component } from 'react';
import { Row, Col, CardSubtitle, FormGroup, Label } from 'reactstrap';
import { Field, FieldArray, change } from 'redux-form';
import { connect } from 'react-redux';
import {
  renderDropdownListFilter,
  renderTextField,
  renderNumber,
} from '../../../RenderInputs/renderInputs';
import Table from '../../Table/Door/Wrapped';
import CustomTable from '../../Table/Door/Custom';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
  totalSelector,
  addPriceSelector,
} from '../../../../selectors/pricing';
import fraction from '../../../../utils/fraction';

import changeProfile from '../Functions/changeProfile';
import changeDesign from '../Functions/changeDesign';
import ModalUtil from '../../../../utils/Modal';
import Maker from '../../MakerJS/Wrap_Maker';

const required = (value) => (value ? undefined : 'Required');

class Door extends Component {
  state = {
    title: 'Reminder',
    message: 'The Edge You Selected Cannot Be Drilled For Concealed Hinges',
    modal: false,
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  lipWarning = () => {
    const { dispatch, index, part, formState } = this.props;
    const edge = formState?.part_list[index]?.edge;

    switch (edge?.NAME) {
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
      edit,
      prices,
      subTotal,
      addPrice,
      updateSubmit,
    } = this.props;

    let design = formState?.part_list[index]?.design;
    let construction = formState?.part_list[index]?.construction?.value;
    let orderType = formState?.part_list[index]?.orderType?.value;
    let thickness = formState?.part_list[index]?.thickness?.db_name;
    let topRailAdd = formState?.part_list[index]?.design?.TOP_RAIL_ADD
      ? formState?.part_list[index]?.design?.TOP_RAIL_ADD
      : 0;
    let bottomRailAdd = formState?.part_list[index]?.design?.BTM_RAIL_ADD
      ? formState?.part_list[index]?.design?.BTM_RAIL_ADD
      : 0;

    const filtered_woodtypes = woodtypes.filter((wood) => wood[thickness]);
    const one_piece_wood = woodtypes.filter((wood) => wood.one_piece === true);
    const two_piece_wood = woodtypes.filter((wood) => wood.two_piece === true);
    const filtered_designs = designs.filter(
      (design) =>
        design.CONSTRUCTION === construction && design.ORDERTYPE === 'Door'
    );

    const customer = formState?.job_info?.customer;
    let thickness_val =
      formState?.part_list[index]?.thickness?.thickness_values;
    const flat_panels = panels?.filter(
      (panel) => panel.panel_wrap && panel.Thickness < thickness_val
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
                dataKey="value"
                textField="NAME"
                validate={required}
                edit={edit}
              />
            </FormGroup>
          </Col>

          <Col>
            <FormGroup>
              <Label htmlFor="panel">Panel</Label>
              <Field
                name={`${part}.panel`}
                component={renderDropdownListFilter}
                data={flat_panels}
                dataKey="value"
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
                dataKey="value"
                textField="NAME"
                validate={required}
                edit={edit}
              />
            </FormGroup>
          </Col>
        </Row>

        <div>
          <Row>
            <Col>
              <h5>
                <strong>Wrap Details</strong>
              </h5>
            </Col>
          </Row>

          <Row>
            <Col>
              <FormGroup>
                <Label htmlFor="arches">Wrap Width</Label>
                <Field
                  name={`${part}.wrap_width`}
                  type="text"
                  component={renderNumber}
                  label="wrap_width"
                  edit={edit}
                  validate={required}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label htmlFor="arches">Face Width</Label>
                <Field
                  name={`${part}.face_width`}
                  type="text"
                  component={renderNumber}
                  label="face_width"
                  edit={edit}
                  validate={required}
                />
              </FormGroup>
            </Col>
          </Row>
        </div>

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
          <Col>
            <div
              id={`makerJS${index}`}
              style={{ width: '100%', height: '300px' }}
            >
              <Maker i={index} style={{ width: '100%', height: '300px' }} />
            </div>
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
