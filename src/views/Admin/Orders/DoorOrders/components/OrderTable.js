import React, { useState, Fragment, useEffect } from "react";
import {
  Label,
  Table,
  Input,
  FormFeedback,
  FormText,
  Row,
  Col,
  Button
} from "reactstrap";
// import { Button } from 'antd'
import "antd/dist/antd.css";
import { Checkbox } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import {
  Field,

} from "redux-form";
import Ratio from "lb-ratio";
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import Maker from '../components/MakerJS/Maker'

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

const required = value => (value ? undefined : 'Required');

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

const marks = {
  0: {
    style: {
      color: 'red',
    },
    label: <strong>Top</strong>,
  },
  100: {
    style: {
      color: 'red',
    },
    label: <strong>Bottom</strong>,
  },
}

const slider = field => (
  <div>
    {console.log(field)}

    <Range
      {...field}
      onChange={field.input.onChange}
      handle={handle}
      marks={marks}
      max={field.max}
    // value={field.input.value}
    // disabled
    >
      {field.children}
    </Range>
    {field.meta.touched && field.meta.error &&
      <span className="error">{field.meta.error}</span>}
  </div>
)

const renderField = ({
  input,
  props,
  meta: { touched, error, warning },
  ...custom
}) => (
    <Fragment>
      <Input {...input} {...custom} />
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

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

const OrderTable = ({ fields, isValid, formState, i, prices, subTotal, part, updateSubmit }) => {

  const [uneven, setUneven] = useState(false)
  const [width, setWidth] = useState([])
  const [height, setHeight] = useState([])

  useEffect(() => {

    let init = []
    setWidth(init)
    setHeight(init)

  },[updateSubmit])

  const toggle = () => {
    setUneven(!uneven)
  }

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





  const RangeSelector = props => (
    <div>
      <Slider defaultValue={50} />
    </div>
  )


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
              {uneven ?
                <div className='mb-3'>
                  <Row>
                    <Col>
                      <Label for="exampleSelect">Select</Label>
                      <Field
                        name={`${table}.unEvenSplitInput`}
                        component={renderField}
                      />
                    </Col>
                    <Col lg='9' />
                  </Row>
                  <Row>
                    <Col>
                      {console.log(formState.part_list[i].dimensions[index].height)}
                      <Field
                        name={`${table}.unEvenSplit`}
                        test={23}
                        max={parseFloat(formState.part_list[i].dimensions[index].height)}
                        component={slider}
                      />
                    </Col>
                  </Row>
                </div>
                : null
              }
              <Row>
                <Col lg='9' />
                <Col>
                  {(formState.part_list[i].dimensions[index].panelsH > 1 || formState.part_list[i].dimensions[index].panelsW > 1) ? <Checkbox label='Uneven Split' onClick={toggle} /> : null}
                </Col>
              </Row>

              <Row>
                <Col>
                  {console.log('fffff', height)}
                  {height[index] > 0 ?
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
          <Button
            color="primary"
            className="btn-circle"
            onClick={() =>
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
                verticalMidRailSize: 0
              })
            }
          >
            +
      </Button>
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
