import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CardSubtitle, Col, FormGroup, Label, Row } from 'reactstrap';
import { Field, FieldArray, change } from 'redux-form';
import {
  itemPriceSelector,
  linePriceSelector,
  subTotalSelector,
} from '../../../../selectors/pricing';
import {
  renderDropdownListFilter,
  renderTextField,
} from '../../../RenderInputs/renderInputs';
import Slab_Door_Table from '../../Table/Slab/Slab_Door_Table';
import thickness from '../thickness';

const required = (value) => (value ? undefined : 'Required');

class SlabDoor extends Component {
  addNoteToSlab = () => {
    const { formState, index, dispatch } = this.props;

    const thickness_selected = formState?.part_list[index]?.thickness;
    const sanded_thickness = thickness?.filter(
      (i) => i.value === thickness_selected.value - 2
    );

    if (formState?.part_list[index]?.edge?.special_slab_edge) {
      dispatch(
        change(
          'Order',
          `part_list[${index}].notes`,
          `Sand Down To ${sanded_thickness[0]?.thickness_1}`
        )
      );
    }
  };

  render() {
    const {
      part,
      woodtypes,
      cope_designs,
      edges,
      applied_moulds,
      finishes,
      isValid,
      index,
      part_list,
      formState,
      prices,
      subTotal,
      edit,
      updateSubmit,
    } = this.props;

    let thickness = formState?.part_list[index]?.thickness;
    const no_special_edges = edges.filter((i) => !i.special_slab_edge);

    return (
      <div>
        <Row>
          <Col xs="4">
            <FormGroup>
              <Label htmlFor="woodtype">Woodtype</Label>
              <Field
                name={`${part}.woodtype`}
                component={renderDropdownListFilter}
                data={woodtypes}
                dataKey="value"
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
                data={thickness?.value < 2 ? no_special_edges : edges}
                dataKey="value"
                textField="NAME"
                validate={required}
                onBlur={this.addNoteToSlab}
                edit={edit}
              />
            </FormGroup>
          </Col>

          <Col xs="4">
            <FormGroup>
              <Label htmlFor="applied_profile">Applied Profiles</Label>
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
              <p>Enter Item Build Note Here - Framing/Wood, etc.</p>
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
            component={Slab_Door_Table}
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
  cope_designs: state.part_list.cope_designs,
  edges: state.part_list.edges,
  applied_moulds: state.part_list.applied_profiles,
  finishes: state.part_list.finish,

  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
});

export default connect(mapStateToProps, null)(SlabDoor);
