import React, { Component } from "react";
import {
  Row,
  Col,
  CardSubtitle,
  FormGroup,
  Label,
  Button,
} from "reactstrap";
import DropdownList from "react-widgets/lib/DropdownList";
import Multiselect from 'react-widgets/lib/Multiselect'
import "react-widgets/dist/css/react-widgets.css";
import {
  Field,
  FieldArray,
  change
} from 'redux-form';
import OrderTable from "./OrderTable";

const required = value => (value ? undefined : "Required");

const construction = [
  {
    name: "Cope And Stick",
    value: "Cope"
  },
  {
    name: "Mitered Construction",
    value: "M"
  },
  {
    name: "MT Construction",
    value: "MT"
  }
];

const orderType = [
  {
    name: "Door Order",
    value: "Door"
  },
  {
    name: "Drawer Order",
    value: "DF"
  }
];

const thickness = [
  {
    name: "4/4",
    value: 0.75
  },
  {
    name: "5/4",
    value: 1
  }
];

const renderMultiSelect = ({
  input,
  data,
  valueField,
  textField,
  meta: { touched, error, warning }
}) => (
    <div>
      <Multiselect
        {...input}
        onBlur={() => input.onBlur()}
        value={input.value || []} // requires value to be an array
        data={data}
        valueField={valueField}
        textField={textField}
        placeholder="Add Misc Items"
      />
      {touched &&
        ((error && <span style={{ color: 'red' }}>{error}</span>) ||
          (warning && <span style={{ color: 'red' }}>{warning}</span>))}
    </div>
  );

const renderDropdownListFilter = ({
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
        ((error && <span style={{ color: 'red' }}>{error}</span>) ||
          (warning && <span style={{ color: 'red' }}>{warning}</span>))}
    </div>
  );

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

class DoorInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      designFilter: [],
      mouldFilter: [],
      test: []
    };
  }
  
  render() {
    const {
      fields,
      woodtypes,
      designs,
      moulds,
      panels,
      edges,
      finish,
      arches,
      hinges,
      doorOptions,
      doorExtras,
      formState,
      prices,
      part_list,
      subTotal
    } = this.props;

    console.log(doorOptions)

    return (
      <div>
        {fields.map((part, index) => (
          <div id={`item-${index}`} key={index}>
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
                  <Label for="orderType">Order Type</Label>
                  <Field
                    name={`${part}.orderType`}
                    component={renderDropdownList}
                    data={orderType}
                    valueField="value"
                    textField="name"
                    validate={required}
                  />
                </FormGroup>
              </Col>

              <Col xs="4">
                <FormGroup>
                  <Label for="construction">Construction</Label>
                  <Field
                    name={`${part}.construction`}
                    component={renderDropdownList}
                    data={construction}
                    valueField="value"
                    textField="name"
                    validate={required}
                  />
                </FormGroup>
              </Col>

              <Col xs="4">
                <FormGroup>
                  <Label for="construction">Thickness</Label>
                  <Field
                    name={`${part}.thickness`}
                    component={renderDropdownList}
                    data={thickness}
                    valueField="value"
                    textField="name"
                    validate={required}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>

              <Col xs="4">
                <FormGroup>
                  <Label htmlFor="woodtype">Woodtype</Label>
                  <Field
                    name={`${part}.woodtype`}
                    component={renderDropdownList}
                    data={woodtypes}
                    valueField="value"
                    textField="NAME"
                    validate={required}
                  />
                </FormGroup>
              </Col>

              <Col xs="4">
                <FormGroup>
                  <Label htmlFor="design">Design</Label>
                  <Field
                    name={`${part}.design`}
                    component={renderDropdownListFilter}
                    data={designs}
                    valueField="value"
                    textField="NAME"
                    validate={required}
                  />
                </FormGroup>
              </Col>

              <Col xs="4">
                <FormGroup>
                  <Label htmlFor="mould">Mould</Label>
                  <Field
                    name={`${part}.moulds`}
                    component={renderDropdownList}
                    data={moulds}
                    valueField="value"
                    textField="NAME"
                    validate={required}
                  />
                </FormGroup>
              </Col>



            </Row>
            <Row>
              {/* <Col xs="1" /> */}

              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="edge">Edge</Label>
                  <Field
                    name={`${part}.edges`}
                    component={renderDropdownList}
                    data={edges}
                    valueField="value"
                    textField="NAME"
                    validate={required}
                  />
                </FormGroup>
              </Col>

              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="panel">Panel</Label>
                  <Field
                    name={`${part}.panels`}
                    component={renderDropdownList}
                    data={panels}
                    valueField="value"
                    textField="PANEL"
                    validate={required}
                  />
                </FormGroup>
              </Col>

              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="arches">Arches</Label>
                  <Field
                    name={`${part}.arches`}
                    component={renderDropdownListFilter}
                    data={arches}
                    valueField="value"
                    textField="ARCH"
                    validate={required}
                  />
                </FormGroup>
              </Col>

              <Col xs="3">
                <FormGroup>
                  <Label htmlFor="hinges">Hinges</Label>
                  <Field
                    name={`${part}.hinges`}
                    component={renderDropdownList}
                    data={hinges}
                    valueField="value"
                    textField="Name"
                    validate={required}
                  />
                </FormGroup>
              </Col>

            </Row>

            <Row>
              <Col xs="4">
                <FormGroup>
                <Label for="jobNotes">Misc Items</Label>
                <Field
                    name={`${part}.miscItems`}
                    component={renderMultiSelect}
                    data={doorExtras}
                    textField="Name"
                />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col xs="4">
                <FormGroup>
                  <strong>
                    <Label for="exampleText">Job Notes</Label>
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
                prices={prices}
                subTotal={subTotal}
                part_list={part_list}
                formState={formState}
                part={part}
                doorOptions={doorOptions}
              />
              <div />
            </div>

            <hr />
            <hr />
          </div>
        ))}
        <Button
          color="primary"
          onClick={() =>
            fields.push({
              orderType: orderType[0],
              construction: construction[0],
              thickness: thickness[0],
              woodtype: woodtypes[0],
              design: designs[0],
              edges: edges[0],
              moulds: moulds[0],
              panels: panels[0],
              hinges: hinges[0],
              finish: finish[0],
              dimensions: []
            })
          }
        >
          Add Item
      </Button>
      </div>
    );
  }
}

export default DoorInfo;


