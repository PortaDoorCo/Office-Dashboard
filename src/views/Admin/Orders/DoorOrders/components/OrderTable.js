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

const OrderTable = ({ fields, formState, i, prices, subTotal, part, updateSubmit }) => {

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
              <Table>

                <Field
                  name={`${table}.item`}
                  type="text"
                  component={renderFieldDisabled}
                  label="item"
                />

                <thead>
                  <tr>
                    <th>Qty</th>
                    <th>Width</th>
                    <th>Height</th>
                    <th>Panel High</th>
                    <th>Panels Wide</th>
                    <th>Price</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Field
                        name={`${table}.qty`}
                        type="text"
                        component={renderField}
                        label="qty"
                        validate={required}
                      />
                    </td>
                    <td>
                      <Field
                        name={`${table}.width`}
                        type="text"
                        component={renderField}
                        onBlur={e => w(e, formState.part_list[i].dimensions[index].width, index)}
                        label="width"
                        validate={required}
                      />
                    </td>

                    <td>
                      <Field
                        name={`${table}.height`}
                        type="text"
                        component={renderField}
                        onBlur={e => h(e, formState.part_list[i].dimensions[index].height, index)}
                        label="height"
                        validate={required}
                      />
                    </td>

                    <td>
                      <Field
                        name={`${table}.panelsH`}
                        type="text"
                        component={renderField}
                        label="horizontalMidRail"
                      />
                    </td>
                    <td>
                      <Field
                        name={`${table}.panelsW`}
                        type="text"
                        component={renderField}
                        label="verticalMidRail"
                      />
                    </td>
                    <td>
                      {prices[i] ?
                        <Input
                          type="text"
                          className="form-control"
                          placeholder={"$" + prices[i][index].toFixed(2) || 0}
                        /> : <Input
                          type="text"
                          className="form-control"
                          placeholder={"$0.00"}
                        />
                      }

                    </td>
                    <td>
                      <Button color="danger" className="btn-circle" onClick={() => fields.remove(index)}>
                        X
                  </Button>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>
                        <p>Left Stile</p>
                      </strong>
                      <Field
                        name={`${table}.leftStile`}
                        type="text"
                        component={renderField}
                        label="leftStile"
                      />
                    </td>
                    <td>
                      <strong>
                        <p>Right Stile</p>
                      </strong>
                      <Field
                        name={`${table}.rightStile`}
                        type="text"
                        component={renderField}
                        label="rightStile"

                      />
                    </td>
                    <td>
                      <strong>
                        <p>Top Rail</p>
                      </strong>
                      <Field
                        name={`${table}.topRail`}
                        type="text"
                        component={renderField}
                        label="topRail"

                      />
                    </td>
                    <td>
                      <strong>
                        <p>Bottom Rail</p>
                      </strong>
                      <Field
                        name={`${table}.bottomRail`}
                        type="text"
                        component={renderField}
                        label="bottomRail"
                      />
                    </td>
                    <td>
                      <strong>
                        <p>Hori. Mid Rail</p>
                      </strong>
                      <Field
                        name={`${table}.horizontalMidRailSize`}
                        type="text"
                        component={renderField}
                        label="horizontalMidRail"
                      />
                    </td>
                    <td>
                      <strong>
                        <p>Vert. Mid Rail</p>
                      </strong>
                      <Field
                        name={`${table}.verticalMidRailSize`}
                        type="text"
                        component={renderField}
                        label="verticalMidRail"
                      />
                    </td>
                  </tr>
                  <tr />
                </tbody>
              </Table>
              <Row>
                <Col lg='9'>
                {height[index] > 0 ? 
                  <Field name={`${table}.showBuilder`} component={renderCheckboxToggle} label="Show Builder" />
                : null}
                </Col>
                <Col>
                  {(parseInt(formState.part_list[i].dimensions[index].panelsH) === 2 && parseInt(formState.part_list[i].dimensions[index].panelsW) === 1 )  ? <Field name={`${table}.unevenCheck`} component={renderCheckboxToggle} label="Uneven Split" /> : null}
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

              {formState.part_list[i].dimensions[index].unevenCheck && parseInt(formState.part_list[i].dimensions[index].panelsH) === 2 && parseInt(formState.part_list[i].dimensions[index].panelsW) === 1 ?
                <div className='mb-3'>
                  <Row>
                    <Col>
                      <Row>
                        <Col />
                        <Col>
                          <p style={{ textAlign: 'center' }}><strong>Position of Horizontal Mid Rail</strong></p>
                          <Field
                            name={`${table}.unevenSplitInput`}
                            component={renderField}
                          />
                          <Row>
                            <Col>
                              <p style={{ textAlign: 'center' }}>Height to Top of Horiz. Mullion</p>
                            </Col>
                          </Row>
                        </Col>
                        <Col />
                      </Row>
                    </Col>

                  </Row>
                </div>
                : null
              }

              <Row className='mt-2'>
                <Col>
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
                  formState.part_list[formState.part_list.length - 1].design ?
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
                    }) : alert('please select a design')
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
