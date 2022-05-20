import 'antd/dist/antd.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, CardSubtitle, Col, FormGroup, Label, Row } from 'reactstrap';
import { Field, FieldArray } from 'redux-form';
import {
  addPriceSelector,
  itemPriceSelector,
  linePriceSelector,
  miscTotalSelector,
  subTotalSelector,
  taxSelector,
  totalSelector,
} from '../../selectors/pricing';
import {
  renderDropdownList,
  renderDropdownListFilter,
  renderTextField,
} from '../RenderInputs/renderInputs';
import OrderTable from './OrderTable';

const required = (value) => (value ? undefined : 'Required');

class DrawerBoxInfo extends Component {
  render() {
    const {
      woodtypes,
      boxBottomWoodtype,
      boxThickness,
      boxBottoms,
      notchDrill,
      drawerFinishes,
      fields,
      scoop,
      dividers,
      prices,
      subTotal,
      formState,
      edit,
      box_assembly,
    } = this.props;

    const drawer_box_woodtypes = woodtypes.filter(
      (wood) => wood.drawer_box === true
    );

    return (
      <div>
        {fields.map((part, index) => (
          <div key={index}>
            <hr />
            <CardSubtitle className="mt-4">
              <Row>
                <Col lg="11">
                  <div>
                    <h2>Item #{index + 1}</h2>
                  </div>
                </Col>
                <Col>
                  {edit ? (
                    <div>
                      {fields.length > 1 ? (
                        <Button
                          color="danger"
                          onClick={() => fields.remove(index)}
                        >
                          x
                        </Button>
                      ) : null}
                    </div>
                  ) : (
                    <div />
                  )}
                </Col>
              </Row>
            </CardSubtitle>
            <Row>
              {/* <Col xs="1" /> */}
              <Col xs="4">
                <FormGroup>
                  <Label htmlFor="woodtypeSelection">Woodtype</Label>
                  <Field
                    name={`${part}.woodtype`}
                    component={renderDropdownListFilter}
                    data={drawer_box_woodtypes}
                    dataKey="value"
                    textField="NAME"
                    edit={edit}
                    validate={required}
                  />
                </FormGroup>
              </Col>
              <Col xs="4">
                <FormGroup>
                  <Label htmlFor="box-thickness">Box Thickness</Label>
                  <Field
                    name={`${part}.box_thickness`}
                    component={renderDropdownList}
                    data={boxThickness}
                    dataKey="value"
                    textField="NAME"
                    edit={edit}
                    validate={required}
                  />
                </FormGroup>
              </Col>
              <Col xs="4">
                <FormGroup>
                  <Label htmlFor="box-bottom-woodtype">
                    Box Bottom Woodtype
                  </Label>
                  <Field
                    name={`${part}.box_bottom_woodtype`}
                    component={renderDropdownListFilter}
                    data={boxBottomWoodtype}
                    dataKey="value"
                    textField="NAME"
                    edit={edit}
                    validate={required}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="box-bottoms">Box Bottom Thickness</Label>
                  <Field
                    name={`${part}.box_bottom_thickness`}
                    component={renderDropdownList}
                    data={boxBottoms}
                    dataKey="value"
                    textField="NAME"
                    edit={edit}
                    validate={required}
                  />
                </FormGroup>
              </Col>

              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="notch-drill">Notch and Drill</Label>
                  <Field
                    name={`${part}.box_notch`}
                    component={renderDropdownList}
                    data={notchDrill}
                    dataKey="value"
                    textField="NAME"
                    edit={edit}
                    validate={required}
                  />
                </FormGroup>
              </Col>
              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="finish">Assembly</Label>
                  <Field
                    name={`${part}.box_assembly`}
                    component={renderDropdownList}
                    data={box_assembly}
                    dataKey="value"
                    textField="NAME"
                    edit={edit}
                    validate={required}
                  />
                </FormGroup>
              </Col>

              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="finish">Finish</Label>
                  <Field
                    name={`${part}.box_finish`}
                    component={renderDropdownList}
                    data={drawerFinishes}
                    dataKey="value"
                    textField="NAME"
                    edit={edit}
                    validate={required}
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
                      edit={edit}
                      component={renderTextField}
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
                component={OrderTable}
                i={index}
                scoop={scoop}
                dividers={dividers}
                prices={prices}
                subTotal={subTotal}
                part={part}
                edit={edit}
                // part_list={part_list}
                formState={formState}
              />
              <div />
            </div>
          </div>
        ))}

        {edit &&
        formState?.part_list &&
        formState?.part_list[0]?.dimensions.length > 0 ? (
          <Button
            color="primary"
            onClick={() =>
              fields.push({
                dimensions: [],
                addPrice: 0,
              })
            }
          >
            Add Item
          </Button>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  woodtypes: state.part_list.woodtypes,
  boxBottomWoodtype: state.part_list.box_bottom_woodtypes,
  boxThickness: state.part_list.box_thickness,
  boxBottoms: state.part_list.box_bottom_thickness,
  notchDrill: state.part_list.box_notch,
  drawerFinishes: state.part_list.box_finish,
  box_assembly: state.part_list.box_assembly,
  scoop: state.part_list.box_scoop,
  dividers: state.part_list.dividers,
  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
  total: totalSelector(state),
  tax: taxSelector(state),
  addPriceSelector: addPriceSelector(state),
  miscTotalSelector: miscTotalSelector(state),
});

export default connect(mapStateToProps, null)(DrawerBoxInfo);
