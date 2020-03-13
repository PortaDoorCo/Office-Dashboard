import React, { useState, Fragment, useEffect } from "react";
import {
  Label,
  Table,
  Input,
  Row,
  Col,
  Button
} from "reactstrap";
import { Checkbox as CheckboxUI } from 'semantic-ui-react';
// import Checkbox from 'material-ui/Checkbox'
import 'semantic-ui-css/semantic.min.css';
import { Field } from "redux-form";
import Ratio from "lb-ratio";
import Maker from '../components/MakerJS/Maker';
import DropdownList from 'react-widgets/lib/DropdownList';
import Multiselect from 'react-widgets/lib/Multiselect'
import 'react-widgets/dist/css/react-widgets.css';
import PanelsTable from './Table/Table'
import GlassTable from './Table/Glass'


const required = value => (value ? undefined : 'Required');


const unevenDirection = [
  {
    name: 'Top to Bottom',
    value: 'Top'
  },
  {
    name: 'Bottom to Top',
    value: "Bottom"
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

const renderFieldDisabled = ({ input, props, meta: { touched, error, warning }, ...custom }) => (
  <Fragment>
    <Input {...input} {...custom} disabled style={{ display: 'none' }} />
    {touched &&
      ((error && <span style={{ color: 'red' }}>{error}</span>) ||
        (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);

const renderCheckbox = ({
  input: { value, onChange, ...input },
  meta: { touched, error },
  ...rest
}) => (
    <div>
      <CheckboxUI
        {...input}
        {...rest}
        defaultChecked={!!value}
        onChange={(e, data) => onChange(data.checked)}
        type="checkbox"
      />
      {touched && error && <span>{error}</span>}
    </div>
  );

const renderCheckboxToggle = ({
  input: { value, onChange, ...input },
  meta: { touched, error },
  ...rest
}) => (
    <div>
      <CheckboxUI
        toggle
        {...input}
        {...rest}
        defaultChecked={!!value}
        onChange={(e, data) => onChange(data.checked)}
        type="checkbox"
      />
      {touched && error && <span>{error}</span>}
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
      />
      {touched &&
        ((error && <span style={{ color: 'red' }}>{error}</span>) ||
          (warning && <span style={{ color: 'red' }}>{warning}</span>))}
    </div>
  );

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

const OrderTable = ({ fields, formState, i, prices, subTotal, part, updateSubmit, doorOptions }) => {

  const [width, setWidth] = useState([])
  const [height, setHeight] = useState([])



  useEffect(() => {

    let init = []
    setWidth(init)
    setHeight(init)

  }, [updateSubmit])

  const w = (e, v, i) => {
    e.preventDefault();
    let newWidth = [...width]
    if (width[i]) {
      newWidth.splice(i, 1, v)
    } else {
      newWidth = [...newWidth, v]
    }
    setWidth(newWidth);
  }

  const h = (e, v, i) => {
    e.preventDefault();
    let newHeight = [...height]
    if (height[i]) {
      newHeight.splice(i, 1, v)
    } else {
      newHeight = [...newHeight, v]
    }
    setHeight(newHeight);
  }


  return (
    formState ?
      <div>
        <Fragment>
          {fields.map((table, index) => (
            <Fragment key={index}>

              {formState.part_list[i].panels && formState.part_list[i].panels.PANEL === "GLASS" ?
                <GlassTable
                  table={table}
                  index={index}
                  renderField={renderField}
                  renderFieldDisabled={renderFieldDisabled}
                  renderMultiSelect={renderMultiSelect}
                  renderDropdownList={renderDropdownList}
                  required={required}
                  w={w}
                  formState={formState}
                  i={i}
                  h={h}
                  prices={prices}
                  fields={fields}
                  doorOptions={doorOptions}
                />
                :
                <PanelsTable
                  table={table}
                  index={index}
                  renderField={renderField}
                  renderFieldDisabled={renderFieldDisabled}
                  required={required}
                  w={w}
                  formState={formState}
                  i={i}
                  h={h}
                  prices={prices}
                  fields={fields}
                />
              }




              <Row>
                <Col lg='9'>
                  {(height[index] > 0) ?
                    <Field name={`${table}.showBuilder`} component={renderCheckboxToggle} label="Show Builder" />
                    :
                    null}
                </Col>
                <Col>
                  {(parseInt(formState.part_list[i].dimensions[index].panelsH) > 1 && parseInt(formState.part_list[i].dimensions[index].panelsW) === 1) ? <Field name={`${table}.unevenCheck`} component={renderCheckboxToggle} label="Uneven Split" /> : null}
                </Col>
              </Row>

              <Row>
                <Col>

                  {(height[index] > 0 && formState.part_list[i].dimensions[index].showBuilder) ?
                    <div id={`makerJS${index}`} style={{ width: '100%', height: '300px' }}>
                      <Maker
                        width={width[index]}
                        height={height[index]}
                        i={i}
                        index={index}
                        style={{ width: '100%', height: '300px' }}
                      />
                    </div> : <div />
                  }


                </Col>
              </Row>

              {formState.part_list[i].dimensions[index].unevenCheck ?
                <div className='mb-3'>
                  <Row>
                    {Array.from(Array(parseInt(formState.part_list[i].dimensions[index].panelsH)).keys()).slice(1).map((i, index) => {
                      return (
                        <div>
                          <Col />
                          <Col>
                            <p style={{ textAlign: 'center', marginTop: "10px" }}><strong>Panel Opening {index + 1}</strong></p>
                            <Field
                              name={`${table}.unevenSplitInput${index}`}
                              component={renderField}
                            />
                          </Col>
                          <Col />
                        </div>
                      )
                    })}
                  </Row>
                </div>
                : null
              }

              <Row>
                <Col xs="4">
                  <strong>Notes</strong>
                  <Field
                    name={`${table}.notes`}
                    type="textarea"
                    component={renderField}
                    label="notes"
                  />
                </Col>

              </Row>
              <br />
            </Fragment>
          ))}
          <Row>
            <Col>
              <Button
                color="primary"
                className="btn-circle"
                onClick={(e) =>
                  (formState.part_list[formState.part_list.length - 1].design && formState.part_list[formState.part_list.length - 1].design.arch && formState.part_list[formState.part_list.length - 1].design.ARCHED_TOP && formState.part_list[formState.part_list.length - 1].design.ARCHED_BOT) ?
                  fields.push({
                    panelsH: 1,
                    panelsW: 1,
                    leftStile: fraction(
                      formState.part_list[formState.part_list.length - 1].design.L_STILE_W
                    ),
                    rightStile: fraction(
                      formState.part_list[formState.part_list.length - 1].design.R_STILE_W
                    ),
                    topRail: fraction(
                      formState.part_list[formState.part_list.length - 1].design.arch.RAIL_WIDTH
                    ),
                    bottomRail: fraction(
                      formState.part_list[formState.part_list.length - 1].design.arch.RAIL_WIDTH
                    ),
                    horizontalMidRailSize: 0,
                    verticalMidRailSize: 0,
                    unevenSplitInput: "0",
                    showBuilder: false
                  })
                  :
                  (formState.part_list[formState.part_list.length - 1].design && formState.part_list[formState.part_list.length - 1].design.arch && formState.part_list[formState.part_list.length - 1].design.ARCHED_TOP) ?
                    fields.push({
                      panelsH: 1,
                      panelsW: 1,
                      leftStile: fraction(
                        formState.part_list[formState.part_list.length - 1].design.L_STILE_W
                      ),
                      rightStile: fraction(
                        formState.part_list[formState.part_list.length - 1].design.R_STILE_W
                      ),
                      topRail: fraction(
                        formState.part_list[formState.part_list.length - 1].design.arch.RAIL_WIDTH
                      ),
                      bottomRail: fraction(
                        formState.part_list[formState.part_list.length - 1].design.BOT_RAIL_W
                      ),
                      horizontalMidRailSize: 0,
                      verticalMidRailSize: 0,
                      unevenSplitInput: "0",
                      showBuilder: false
                    })
                    : (formState.part_list[formState.part_list.length - 1].design) ?
                      fields.push({
                        panelsH: 1,
                        panelsW: 1,
                        leftStile: fraction(
                          formState.part_list[formState.part_list.length - 1].design.L_STILE_W
                        ),
                        rightStile: fraction(
                          formState.part_list[formState.part_list.length - 1].design.R_STILE_W
                        ),
                        topRail: fraction(
                          formState.part_list[formState.part_list.length - 1].design.TOP_RAIL_W
                        ),
                        bottomRail: fraction(
                          formState.part_list[formState.part_list.length - 1].design.BOT_RAIL_W
                        ),
                        horizontalMidRailSize: 0,
                        verticalMidRailSize: 0,
                        unevenSplitInput: "0",
                        showBuilder: false
                      })
                      : alert('please select a design')
                }
              >
                +
                </Button>
            </Col>
          </Row>

          <Row>
            <Col xs="4" />
            <Col xs="5" />
            <Col xs="3">
              <strong>Addtional Price: </strong>
              <Field
                name={`${part}.addPrice`}
                type="text"
                component={renderField}
                label="addPrice"
              />
              <strong>Sub Total: </strong>
              {subTotal[i] ? (
                <Input placeholder={subTotal[i].toFixed(2) || 0} />

              ) : (
                  <Input placeholder="0" />
                )}
            </Col>
          </Row>
        </Fragment>
      </div> : <div />
  )
};

export default OrderTable;
