import React, { useState, Fragment, useEffect } from 'react';
import { Table, Row, Col, Button, FormGroup, Label, Input } from 'reactstrap';
import 'semantic-ui-css/semantic.min.css';
import { Field, change } from 'redux-form';
import Ratio from 'lb-ratio';
import Maker from '../../MakerJS/Maker';
import 'react-widgets/dist/css/react-widgets.css';
import {
  renderField,
  renderNumber,
  renderFieldDisabled,
  renderCheckboxToggle,
  renderPrice,
  renderInt
} from '../../../RenderInputs/renderInputs';
import RenderPriceHolder from '../../../RenderInputs/RenderPriceHolder';
import { connect } from 'react-redux';
import numQty from 'numeric-quantity';
import currencyMask from '../../../../utils/currencyMask';

const required = (value) => (value ? undefined : 'Required');

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

const Frame_Only_Table = ({
  fields,
  formState,
  i,
  prices,
  subTotal,
  part,
  updateSubmit,
  doorOptions,
  edit,
  dispatch,
}) => {
  const [width, setWidth] = useState([]);
  const [height, setHeight] = useState([]);
  const [changeValue, setChangeValue] = useState(null);
  const [leftStileWidth, setLeftStileWidth] = useState(null);
  const [rightStileWidth, setRightStileWidth] = useState(null);
  const [topRailWidth, setTopRailWidth] = useState(null);
  const [bottomRailWidth, setBottomRailWidth] = useState(null);

  useEffect(() => {
    setWidth([]);
    setHeight([]);
    setChangeValue(null);
    setLeftStileWidth(null);
    setRightStileWidth(null);
    setTopRailWidth(null);
    setBottomRailWidth(null);
  }, [updateSubmit]);

  const w = (e, v, i) => {
    e.preventDefault();
    let newWidth = [...width];
    if (width[i]) {
      newWidth.splice(i, 1, v);
    } else {
      newWidth = [...newWidth, v];
    }
    setWidth(newWidth);
  };

  const h = (e, v, i) => {
    e.preventDefault();
    let newHeight = [...height];
    if (height[i]) {
      newHeight.splice(i, 1, v);
    } else {
      newHeight = [...newHeight, v];
    }
    setHeight(newHeight);
  };

  const twoHigh = (index, e) => {
    const value = e.target.value;
    if (value > 1) {
      dispatch(
        change(
          'DoorOrder',
          `part_list[${i}].dimensions[${index}].horizontalMidRailSize`,
          fraction(2.375)
        )
      );
    } else {
      dispatch(
        change(
          'DoorOrder',
          `part_list[${i}].dimensions[${index}].horizontalMidRailSize`,
          0
        )
      );
    }
  };

  const registerChange = (index, e) => {
    const value = e.target.value;
    setChangeValue(value);
  };

  const changeFraming = (index, e) => {
    if (changeValue) {
      setLeftStileWidth(fraction(numQty(changeValue)));
      setRightStileWidth(fraction(numQty(changeValue)));
      setTopRailWidth(fraction(numQty(changeValue)));
      setBottomRailWidth(fraction(numQty(changeValue)));

      dispatch(
        change(
          'DoorOrder',
          `part_list[${i}].dimensions[${index}].leftStile`,
          fraction(numQty(changeValue))
        )
      );

      dispatch(
        change(
          'DoorOrder',
          `part_list[${i}].dimensions[${index}].rightStile`,
          fraction(numQty(changeValue))
        )
      );

      dispatch(
        change(
          'DoorOrder',
          `part_list[${i}].dimensions[${index}].topRail`,
          fraction(numQty(changeValue))
        )
      );

      dispatch(
        change(
          'DoorOrder',
          `part_list[${i}].dimensions[${index}].bottomRail`,
          fraction(numQty(changeValue))
        )
      );
    }
  };

  return formState ? (
    <div>
      <Fragment>
        {fields.map((table, index) => (
          <Fragment key={index}>
            <hr />
            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="panel">
                    <strong>Line # {index + 1}</strong>
                  </Label>
                  <Field
                    name={`${table}.item`}
                    type="text"
                    component={renderFieldDisabled}
                    label="item"
                    edit={true}
                  />
                </FormGroup>
              </Col>
              <Col xs="10" />
            </Row>

            <Table>
              <thead>
                <tr>
                  <th>Qty</th>
                  <th>Width</th>
                  <th>Height</th>
                  <th>Openings</th>
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
                      component={renderInt}
                      label="qty"
                      validate={required}
                      edit={edit}
                    />
                  </td>
                  <td>
                    <Field
                      name={`${table}.width`}
                      type="text"
                      component={renderNumber}
                      onBlur={(e) =>
                        w(
                          e,
                          formState.part_list[i].dimensions[index].width,
                          index
                        )
                      }
                      label="width"
                      validate={required}
                      edit={edit}
                    />
                  </td>

                  <td>
                    <Field
                      name={`${table}.height`}
                      type="text"
                      component={renderNumber}
                      onBlur={(e) =>
                        h(
                          e,
                          formState.part_list[i].dimensions[index].height,
                          index
                        )
                      }
                      label="height"
                      validate={required}
                      edit={edit}
                    />
                  </td>

                  <td>
                    <Field
                      name={`${table}.openings`}
                      type="text"
                      component={renderNumber}
                      label="horizontalMidRail"
                      edit={edit}
                      onChange={(e) => twoHigh(index, e)}
                    />
                  </td>
                  <td>
                    {prices[i] ? (
                      <Input
                        type="text"
                        className="form-control"
                        disabled={true}
                        placeholder={'$' + prices[i][index].toFixed(2) || 0}
                      />
                    ) : (
                      <Input
                        type="text"
                        className="form-control"
                        disabled={true}
                        placeholder={'$0.00'}
                      />
                    )}
                  </td>
                  <td>
                    {!edit ? (
                      <Button
                        color="danger"
                        className="btn-circle"
                        onClick={() => fields.remove(index)}
                      >
                        X
                      </Button>
                    ) : (
                      <div />
                    )}
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
                      component={renderNumber}
                      label="leftStile"
                      edit={edit}
                      validate={required}
                      onChange={(e) => (
                        registerChange(index, e),
                        setLeftStileWidth(e.target.value)
                      )}
                    />
                  </td>
                  <td>
                    <strong>
                      <p>Right Stile</p>
                    </strong>
                    <Field
                      name={`${table}.rightStile`}
                      type="text"
                      component={renderNumber}
                      label="rightStile"
                      edit={edit}
                      validate={required}
                      onChange={(e) => (
                        registerChange(index, e),
                        setRightStileWidth(e.target.value)
                      )}
                    />
                  </td>
                  <td>
                    <strong>
                      <p>Top Rail</p>
                    </strong>
                    <Field
                      name={`${table}.topRail`}
                      type="text"
                      component={renderNumber}
                      label="topRail"
                      edit={edit}
                      validate={required}
                      onChange={(e) => (
                        registerChange(index, e),
                        setTopRailWidth(e.target.value)
                      )}
                    />
                  </td>
                  <td>
                    <strong>
                      <p>Bottom Rail</p>
                    </strong>
                    <Field
                      name={`${table}.bottomRail`}
                      type="text"
                      component={renderNumber}
                      label="bottomRail"
                      edit={edit}
                      validate={required}
                      onChange={(e) => (
                        registerChange(index, e),
                        setBottomRailWidth(e.target.value)
                      )}
                    />
                  </td>
                  <td>
                    <strong>
                      <p>Hori. Mid Rail</p>
                    </strong>
                    <Field
                      name={`${table}.horizontalMidRailSize`}
                      type="text"
                      component={renderNumber}
                      label="horizontalMidRail"
                      edit={edit}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>
                      <p>Cab#</p>
                    </strong>
                    <Field
                      name={`${table}.cab_number`}
                      type="text"
                      component={renderField}
                      label="cab"
                      edit={edit}
                    />
                  </td>
                </tr>


                {!edit ? (
                  <tr>
                    <td>
                      <Button
                        onClick={() => changeFraming(index)}
                        color="primary"
                      >
                        Update Framing
                      </Button>
                    </td>
                  </tr>
                ) : null}
                <Row>
                  <p className="ml-3">*Finish Stile/Rail Sizes*</p>
                </Row>
                <tr />
              </tbody>
            </Table>

            <Row>
              <Col lg="9">
                <Field
                  name={`${table}.showBuilder`}
                  component={renderCheckboxToggle}
                  label="Show Builder"
                />
              </Col>
              <Col>
                {!edit ? (
                  parseInt(formState.part_list[i].dimensions[index].panelsH) >
                    1 &&
                  parseInt(formState.part_list[i].dimensions[index].panelsW) ===
                    1 ? (
                      <Field
                        name={`${table}.unevenCheck`}
                        component={renderCheckboxToggle}
                        label="Uneven Split"
                      />
                    ) : null
                ) : null}
              </Col>
            </Row>

            <Row>
              <Col>
                {formState.part_list[i].dimensions[index].showBuilder ? (
                  <div
                    id={`makerJS${index}`}
                    style={{ width: '100%', height: '300px' }}
                  >
                    <Maker
                      width={width[index]}
                      height={height[index]}
                      i={i}
                      index={index}
                      style={{ width: '100%', height: '300px' }}
                    />
                  </div>
                ) : (
                  <div />
                )}
              </Col>
            </Row>

            {formState.part_list[i].dimensions[index].unevenCheck ? (
              <div className="mb-3">
                <Row>
                  {Array.from(
                    Array(
                      parseInt(formState.part_list[i].dimensions[index].panelsH)
                    ).keys()
                  )
                    .slice(1)
                    .map((i, index) => {
                      return (
                        <div>
                          <Col />
                          <Col>
                            <p
                              style={{ textAlign: 'center', marginTop: '10px' }}
                            >
                              <strong>Panel Opening {index + 1}</strong>
                            </p>
                            <Field
                              name={`${table}.unevenSplitInput${index}`}
                              component={renderNumber}
                              edit={edit}
                            />
                          </Col>
                          <Col />
                        </div>
                      );
                    })}
                </Row>
              </div>
            ) : null}

            <Row>
              <Col xs="4">
                <strong>Notes</strong>
                <Field
                  name={`${table}.notes`}
                  type="textarea"
                  component={renderField}
                  edit={edit}
                  label="notes"
                />
              </Col>
              <Col xs="5" />
              <Col xs="3">
                <strong>Extra Design Cost</strong>
                <Field
                  name={`${table}.extraCost`}
                  type="text"
                  component={renderPrice}
                  edit={edit}
                  label="extraCost"
                  {...currencyMask}
                />
              </Col>
            </Row>
            <br />
          </Fragment>
        ))}
        <Row>
          <Col>
            {!edit ? (
              <Button
                color="primary"
                className="btn-circle"
                onClick={(e) =>
                  fields.push({
                    qty: 1,
                    openings: 1,
                    leftStile: leftStileWidth
                      ? fraction(numQty(leftStileWidth))
                      : fraction(2.375),
                    rightStile: rightStileWidth
                      ? fraction(numQty(rightStileWidth))
                      : fraction(2.375),
                    topRail: topRailWidth
                      ? fraction(numQty(topRailWidth))
                      : fraction(2.375),
                    bottomRail: bottomRailWidth
                      ? fraction(numQty(bottomRailWidth))
                      : fraction(2.375),
                    horizontalMidRailSize: 0,
                    verticalMidRailSize: 0,
                    unevenSplitInput: '0',
                    unevenSplit: false,
                    unevenCheck: false,
                    showBuilder: false,
                    item: fields.length + 1,
                  })
                }
              >
                +
              </Button>
            ) : (
              <div />
            )}
          </Col>
        </Row>

        <Row>
          <Col xs="4" />
          <Col xs="5" />
          <Col xs="3">
            <strong>Sub Total: </strong>
            {subTotal[i] ? (
              <RenderPriceHolder input={subTotal[i].toFixed(2)} edit={true} />
            ) : (
              <RenderPriceHolder input={'0.00'} edit={true} />
            )}
          </Col>
        </Row>
      </Fragment>
    </div>
  ) : (
    <div />
  );
};

export default connect()(Frame_Only_Table);