import React, { Component } from 'react';
import { Row, Col, CardSubtitle, FormGroup, Label } from 'reactstrap';
import { Field, FieldArray } from 'redux-form';
import { connect } from 'react-redux';
import {
  renderDropdownList,
  renderDropdownListFilter,
  renderTextField,
} from '../../../RenderInputs/renderInputs';
import Frame_Only_Table from '../../Table/Face_Frame/Face_Frame_Table';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
} from '../../../../selectors/doorPricing';

const required = (value) => (value ? undefined : 'Required');


class FaceFrame extends Component {
  render() {
    const {
      part,
      woodtypes,
      face_frame_designs,
      face_frame_top_rails,
      face_frame_finishing,
      isValid,
      index,
      part_list,
      formState,
      prices,
      subTotal,
      edit,
      updateSubmit,
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
                component={renderDropdownList}
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
              <Label htmlFor="finish">Finishing</Label>
              <Field
                name={`${part}.face_frame_finishing`}
                component={renderDropdownList}
                data={face_frame_finishing}
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

const mapStateToProps = (state) => ({
  woodtypes: state.part_list.woodtypes,
  face_frame_designs: state.part_list.face_frame_designs,
  face_frame_top_rails: state.part_list.face_frame_top_rail,
  face_frame_finishing: state.part_list.face_frame_finishing,
  furniture_feets: state.part_list.furniture_feet,
  edges: state.part_list.edges,
  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
});

export default connect(mapStateToProps, null)(FaceFrame);
