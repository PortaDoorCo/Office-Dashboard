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
import { renderDropdownList, renderDropdownListFilter, renderField } from '../../../RenderInputs/renderInputs';
import Frame_Only_Table from '../../Table/Doors/Frame_Only_Table';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector
} from '../../../../selectors/doorPricing';

const required = value => (value ? undefined : 'Required');


class FaceFrame extends Component {

  render() {
    const {
      part,
      woodtypes,
      face_frame_designs,
      face_frame_top_rails,
      furniture_feets,
      edges,
      isValid,
      index,
      part_list,
      formState,
      prices,
      subTotal,
      edit
    } = this.props;
    return (
      <div>
        <Row>
          <Col xs="3">
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

          <Col xs="3">
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

          <Col xs="3">
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

          <Col xs="3">
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
                  component={renderField}
                  edit={edit}
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
            component={Frame_Only_Table}
            i={index}
            prices={prices}
            subTotal={subTotal}
            part_list={part_list}
            formState={formState}
            isValid={isValid}
            part={part}
            edit={edit}
          // updateSubmit={updateSubmit}
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
