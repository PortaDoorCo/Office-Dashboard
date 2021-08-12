import React, { Component } from 'react';
import { Row, Col, CardSubtitle, FormGroup, Label, Button } from 'reactstrap';
import 'antd/dist/antd.css';
import { Field, FieldArray, touch, startAsyncValidation } from 'redux-form';
import OrderTable from './OrderTable';
import {
  renderDropdownList,
  renderField,
  renderDropdownListFilter,
  renderTextField,
} from '../RenderInputs/renderInputs';
import VisibilitySensor from 'react-visibility-sensor';
import { connect } from 'react-redux';


const required = (value) => (value ? undefined : 'Required');
const noteRequired = (value) => (value ? undefined : 'Enter Item Build Note Here - Framing/Wood, etc.');

class DrawerBoxInfo extends Component {

  onNoteAppear = (isVisible) => {

    const { dispatch, fields } = this.props;

    console.log({dispatch});

    const index = fields.length - 1;

    console.log({index});

    if (isVisible) {
      dispatch(
        touch(
          'DrawerOrder',
          `part_list[${index}].notes`
        )
      );

      dispatch(
        startAsyncValidation('DrawerOrder')
      );
    }
  };

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


    const drawer_box_woodtypes = woodtypes.filter((wood) => wood.drawer_box === true);

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
                  {!edit ? (
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
                    valueField="value"
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
                    valueField="value"
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
                    valueField="value"
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
                    valueField="value"
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
                    valueField="value"
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
                    valueField="value"
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
                    valueField="value"
                    textField="NAME"
                    edit={edit}
                    validate={required}
                  />
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
                        edit={edit}
                        component={renderTextField}
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

        {!edit && formState?.part_list && formState?.part_list[0]?.dimensions.length > 0 ? (
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

export default connect()(DrawerBoxInfo);
