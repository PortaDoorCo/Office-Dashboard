import React, { Component } from 'react';
import {
  Row,
  Col,
  CardSubtitle,
  FormGroup,
  Label,
  Button
} from 'reactstrap';
import "antd/dist/antd.css";
import { Field, FieldArray } from 'redux-form';
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/dist/css/react-widgets.css';
import OrderTable from './OrderTable';
import { renderField } from '../../../../components/RenderInputs/renderInputs'


const required = value => value ? undefined : 'Required';

const renderDropdownList = ({ input, data, valueField, textField, meta: { touched, error, warning } }) => (
  <div>
    <DropdownList {...input}
      data={data}
      valueField={valueField}
      textField={textField}
      placeholder="Select"
      onChange={input.onChange}
    />
    {touched && ((error && <span style={{ color: 'red' }}>{error}</span>) || (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </div>
);

class DrawerBoxInfo extends Component {


  render() {
    const { woodtypes, boxBottomWoodtype, boxThickness, boxBottoms, assembly, notchDrill, drawerFinishes, fields, scoop, dividers, prices, subTotal, formState } = this.props;
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
                  {fields.length > 1 ? (
                    <Button color="danger" onClick={() => fields.remove(index)}>
                      x
                  </Button>
                  ) : null}
                </Col>
              </Row>
            </CardSubtitle>
            <Row>
              {/* <Col xs="1" /> */}
              <Col xs="4">
                <FormGroup>
                  <Label htmlFor="woodtypeSelection">Woodtype</Label>
                  <Field
                    name={`${part}.box_woodtype`}
                    component={renderDropdownList}
                    data={woodtypes}
                    valueField="value"
                    textField="NAME"
                    validate={required} />
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
                    validate={required} />
                </FormGroup>
              </Col>
              <Col xs="4">
                <FormGroup>
                  <Label htmlFor="box-bottom-woodtype">Box Bottom Woodtype</Label>
                  <Field
                    name={`${part}.box_bottom_woodtype`}
                    component={renderDropdownList}
                    data={boxBottomWoodtype}
                    valueField="value"
                    textField="NAME"
                    validate={required} />
                </FormGroup>
              </Col>

            </Row>
            <Row>
            <Col xs="4">
                <FormGroup>
                  <Label htmlFor="box-bottoms">Box Bottom Thickness</Label>
                  <Field
                    name={`${part}.box_bottom_thickness`}
                    component={renderDropdownList}
                    data={boxBottoms}
                    valueField="value"
                    textField="NAME"
                    validate={required} />
                </FormGroup>
              </Col>

              <Col xs="4">
                <FormGroup>
                  <Label htmlFor="notch-drill">Notch and Drill</Label>
                  <Field
                    name={`${part}.box_notch`}
                    component={renderDropdownList}
                    data={notchDrill}
                    valueField="value"
                    textField="NAME"
                    validate={required} />
                </FormGroup>
              </Col>
              <Col xs="4">
                <FormGroup>
                  <Label htmlFor="finish">Finish/Assembly</Label>
                  <Field
                    name={`${part}.box_finish`}
                    component={renderDropdownList}
                    data={drawerFinishes}
                    valueField="value"
                    textField="NAME"
                    validate={required} />
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
                component={OrderTable}
                i={index}
                scoop={scoop}
                dividers={dividers}
                prices={prices}
                subTotal={subTotal}
                part={part}
                // part_list={part_list}
                formState={formState}
              />
              <div />
            </div>
          </div>
        ))}

        <Button
          color="primary"
          onClick={() =>
            fields.push({
              dimensions: [],
              addPrice: 0
     
            })
          }
        >
          Add Item
      </Button>
      </div >

    );
  }
}

export default DrawerBoxInfo;


