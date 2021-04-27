import React, { Component } from 'react';
import {
  Row,
  Col,
  CardSubtitle,
  FormGroup,
  Label
} from 'reactstrap';
import { Field, FieldArray } from 'redux-form';
import { connect } from 'react-redux';
import { renderDropdownList, renderDropdownListFilter, renderField, renderTextField } from '../../../RenderInputs/renderInputs';
import Frame_Only_Table from '../../Table/Doors/Frame_Only_Table';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector
} from '../../../../selectors/doorPricing';

const required = value => (value ? undefined : 'Required');

const ff_thickness = [
  {
    name: '1"',
    value: 1,
  },
  {
    name: '1 1/8"',
    value: 1.125,
  },
  {
    name: '1 1/4"',
    value: 1.25,
  },
  {
    name: '1 3/8"',
    value: 1.375,
  },
  {
    name: '1 1/2"',
    value: 1.5,
  },
  {
    name: '1 5/8"',
    value: 1.625,
  },
  {
    name: '1 3/4"',
    value: 1.75,
  },
  {
    name: '1 7/8"',
    value: 1.875,
  },
  {
    name: '2"',
    value: 2,
  },
];


class FaceFrame extends Component {

  render() {
    const {
      part,
      woodtypes,
      face_frame_designs,
      face_frame_top_rails,
      isValid,
      index,
      part_list,
      formState,
      prices,
      subTotal,
      edit,
      updateSubmit
    } = this.props;
    return (
      <div>
        <Row>
          <Col>
            <FormGroup>
              <Label htmlFor="woodtype">Woodtype</Label>
              <Field
                name={`${part}.woodtype`}
                component={renderDropdownListFilter}
                data={woodtypes}
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
                name={`${part}.face_frame_design`}
                component={renderDropdownListFilter}
                data={face_frame_designs}
                valueField="value"
                textField="NAME"
                validate={required}
                edit={edit}
              />
            </FormGroup>
          </Col>

          <Col>
            <FormGroup>
              <Label htmlFor="hinges">Top Rail Design</Label>
              <Field
                name={`${part}.face_frame_top_rail`}
                component={renderDropdownList}
                data={face_frame_top_rails}
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
            component={Frame_Only_Table}
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
  face_frame_designs: state.part_list.face_frame_designs,
  face_frame_top_rails: state.part_list.face_frame_top_rail,
  furniture_feets: state.part_list.furniture_feet,
  edges: state.part_list.edges,
  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
});

export default connect(
  mapStateToProps,
  null
)(FaceFrame);
