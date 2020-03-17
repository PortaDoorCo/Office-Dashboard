import React, { Component, Fragment } from 'react';
import {
  Row,
  Col,
  CardSubtitle,
  FormGroup,
  Label,
  Button,
  Input
} from 'reactstrap';
import 'antd/dist/antd.css';
import DropdownList from 'react-widgets/lib/DropdownList';
import Multiselect from 'react-widgets/lib/Multiselect'
import 'react-widgets/dist/css/react-widgets.css';
import OrderTable from './OrderTable';
import {
  Field,
  FieldArray,
  change
} from 'redux-form';
import FieldFileInput from './UploadComponent'
import { FileUploader } from 'devextreme-react';
import Cookies from "js-cookie";
import Select from 'react-select';

const cookie = Cookies.get("jwt");

const required = value => (value ? undefined : 'Required');

const header = { 'Authorization': 'Bearer ' + cookie };

const construction = [
  {
    name: 'Cope And Stick',
    value: 'Cope'
  },
  {
    name: 'Mitered Construction',
    value: 'M'
  },
  {
    name: 'MT Construction',
    value: 'MT'
  },
  {
    name: 'Special Item',
    value: 'Special'
  }
];

const orderType = [
  {
    name: 'Door Order',
    value: 'Door'
  },
  {
    name: 'Drawer Front',
    value: 'DF'
  }
];

const thickness = [
  {
    name: '4/4',
    value: 0.75
  },
  {
    name: '5/4',
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
        placeholder="Select"
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
        placeholder="Select"
        onChange={input.onChange}
      />
      {touched &&
        ((error && <span style={{ color: 'red' }}>{error}</span>) ||
          (warning && <span style={{ color: 'red' }}>{warning}</span>))}
    </div>
  );

const renderField = ({
  input,
  props,
  meta: { touched, error, warning },
  ...custom
}) => (
    <Fragment>
      <Input {...input} {...custom} autocomplete="new-password" />
      {touched &&
        ((error && <span style={{ color: 'red' }}>{error}</span>) ||
          (warning && <span style={{ color: 'red' }}>{warning}</span>))}
    </Fragment>
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

  // componentDidUpdate(prevProps, prevState) {

  //   if (this.props.formState !== prevProps.formState) {
  //     if (this.props.formState && this.props.formState.part_list) {
  //       this.setState({
  //         designFilter: this.props.formState.part_list.map((i, index) => {
  //           let filter = this.props.designs.filter(
  //             el =>
  //               el.OrderType === i.orderType.value &&
  //               el.Construction === i.construction.value &&
  //               el.THICKNESS == i.thickness.value
  //           );
  //           if (filter) {
  //             return filter;
  //           }

  //         })
  //       }, () => {

  //         this.setState({
  //           mouldFilter: this.props.formState.part_list.map((i, index) => {
  //             return (i.design && i.design.mould && [i.design.mould]) || this.props.moulds
  //           })
  //         }, () => console.log('proppsssss', this.props, 'state===>>', this.state))
  //       })

  //     }

  //     this.props.formState.part_list.forEach((part, i) => {
  //       if ((part && part.design) !== (prevProps.formState && prevProps.formState.part_list[i] && prevProps.formState.part_list[i].design)) {
  //         if(part.design && part.design.arch){
  //           this.props.dispatch(
  //             change(
  //               'DoorOrder',
  //               `part_list[${i}].arches`,
  //               part.design.arch
  //             )
  //           );
  //         } else {
  //           this.props.dispatch(
  //             change(
  //               'DoorOrder',
  //               `part_list[${i}].arches`,
  //               this.props.arches[0]
  //             )
  //           )
  //         }

  //         if(part.design && part.design.mould){
  //           this.props.dispatch(
  //             change(
  //               'DoorOrder',
  //               `part_list[${i}].moulds`,
  //               part.design.mould
  //             )
  //           );
  //         } else {
  //           this.props.dispatch(
  //             change(
  //               'DoorOrder',
  //               `part_list[${i}].moulds`,
                
  //             )
  //           );
  //         }
  //       }
  //     });

  //   }
  // }

  render() {
    const {
      fields,
      woodtypes,
      designs,
      moulds,
      panels,
      edges,
      finish,
      hinges,
      doorOptions,
      doorExtras,
      arches,
      formState,
      prices,
      part_list,
      isValid,
      subTotal,
      updateSubmit
    } = this.props;

    return (
      <div>
        {fields.map((part, index) => (
          <div id={`item-${index}`} key={index}>
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
                    component={renderDropdownListFilter}
                    data={orderType}
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
                    data={orderType}
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
                    data={orderType}
                    valueField="value"
                    textField="NAME"
                    validate={required}
                  />
                </FormGroup>
              </Col>



            </Row>
            <Row>

            <Col xs="3">
                <FormGroup>
                  <Label htmlFor="edge">Edge</Label>
                  <Field
                    name={`${part}.edges`}
                    component={renderDropdownListFilter}
                    data={orderType}
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
                    component={renderDropdownListFilter}
                    data={orderType}
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
                    data={orderType}
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
                    data={orderType}
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
                    data={orderType}
                    textField="Name"
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
                prices={prices}
                subTotal={subTotal}
                part_list={part_list}
                formState={formState}
                doorOptions={doorOptions}
                isValid={isValid}
                part={part}
                updateSubmit={updateSubmit}
              />
              <div />
            </div>
          </div>
        ))}
        <Button
          color="primary"
          onClick={() =>

              fields.push({
                orderType: orderType[0],
                construction: construction[0],
                thickness: thickness[0],
                dimensions: [],
                addPrice: 0,
                files: []
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
