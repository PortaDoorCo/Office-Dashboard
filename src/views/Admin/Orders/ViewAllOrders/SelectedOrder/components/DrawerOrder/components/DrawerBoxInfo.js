import React, { Component } from 'react';
import {
  Button,
  Row,
  Col,
  CardSubtitle,
  FormGroup,
  Label,

} from 'reactstrap';
import "antd/dist/antd.css";
import { Field, FieldArray } from 'redux-form';
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/dist/css/react-widgets.css';
import OrderTable from './OrderTable';




const required = value => value ? undefined : 'Required';

const renderDropdownList = ({
  input,
  data,
  valueField,
  textField,
  meta: { touched, error, warning }
}) => (
    <div>
      <DropdownList
        {...input}
        data={data}
        valueField={valueField}
        textField={textField}
        onChange={input.onChange}
        filter
      />
      {touched &&
        ((error && <span style={{ color: "red" }}>{error}</span>) ||
          (warning && <span style={{ color: "red" }}>{warning}</span>))}
    </div>
  );

class DrawerInfo extends Component {


  render() {
    const { woodtypes, boxThickness, boxBottoms, assembly, notchDrill, drawerFinishes, fields, scoop, dividers, prices, subTotal } = this.props;
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
              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="woodtypeSelection">Woodtype</Label>
                  <Field
                    name={`${part}.woodtype`}
                    component={renderDropdownList}
                    data={woodtypes}
                    valueField="value"
                    textField="NAME"
                    validate={required} />
                </FormGroup>
              </Col>
              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="box-thickness">Box Thickness</Label>
                  <Field
                    name={`${part}.boxThickness`}
                    component={renderDropdownList}
                    data={boxThickness}
                    valueField="value"
                    textField="Thickness"
                    validate={required} />
                </FormGroup>
              </Col>
              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="box-bottom-woodtype">Box Bottom Woodtype</Label>
                  <Field
                    name={`${part}.boxBottomWoodtype`}
                    component={renderDropdownList}
                    data={woodtypes}
                    valueField="value"
                    textField="NAME"
                    validate={required} />
                </FormGroup>
              </Col>


              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="box-bottoms">Box Bottom Thickness</Label>
                  <Field
                    name={`${part}.boxBottoms`}
                    component={renderDropdownList}
                    data={boxBottoms}
                    valueField="value"
                    textField="Thickness"
                    validate={required} />
                </FormGroup>
              </Col>
            </Row>
            <Row>

              <Col xs="4">
                <FormGroup>
                  <Label htmlFor="assembly">Assembly</Label>
                  <Field
                    name={`${part}.assembly`}
                    component={renderDropdownList}
                    data={assembly}
                    valueField="value"
                    textField="Name"
                    validate={required} />
                </FormGroup>
              </Col>

              <Col xs="4">
                <FormGroup>
                  <Label htmlFor="notch-drill">Notch and Drill</Label>
                  <Field
                    name={`${part}.notchDrill`}
                    component={renderDropdownList}
                    data={notchDrill}
                    valueField="value"
                    textField="Name"
                    validate={required} />
                </FormGroup>
              </Col>
              <Col xs="4">
                <FormGroup>
                  <Label htmlFor="finish">Finish</Label>
                  <Field
                    name={`${part}.drawerFinishes`}
                    component={renderDropdownList}
                    data={drawerFinishes}
                    valueField="value"
                    textField="Name"
                    validate={required} />
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
              // formState={formState}
              />
              <div />
            </div>
          </div>
        ))}


        <hr />
        <hr />
        <Button
          color="primary"

          onClick={() =>
            fields.push({
              woodtype: woodtypes[0],
              boxBottomWoodtype: woodtypes[0],
              boxThickness: boxThickness[0],
              boxBottoms: boxBottoms[0],
              assembly: assembly[0],
              notchDrill: notchDrill[0],
              drawerFinishes: drawerFinishes[0],
            })
          }
        >
          Add Item
      </Button>
      </div>

    );
  }
}

export default DrawerInfo;


