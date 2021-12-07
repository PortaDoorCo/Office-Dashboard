import Ratio from 'lb-ratio';
import numQty from 'numeric-quantity';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import {
  change, Field, getFormSyncErrors, startAsyncValidation, touch
} from 'redux-form';
import 'semantic-ui-css/semantic.min.css';
import currencyMask from '../../../../utils/currencyMask';
// import 'react-widgets/dist/css/react-widgets.css';
import {
  renderField, renderInt, renderNumber, renderTextField
} from '../../../RenderInputs/renderInputs';
import RenderPriceHolder from '../../../RenderInputs/RenderPriceHolder';

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
  finish,
  finishSubtotal,
  formSyncErrors,
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
          'Order',
          `part_list[${i}].dimensions[${index}].horizontalMidRailSize`,
          fraction(2.375)
        )
      );
    } else {
      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].horizontalMidRailSize`,
          0
        )
      );
    }
  };

  const clearNotes = (index, e) => {
    dispatch(
      change('Order', `part_list[${i}].dimensions[${index}].notes`, '')
    );
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
          'Order',
          `part_list[${i}].dimensions[${index}].leftStile`,
          fraction(numQty(changeValue))
        )
      );

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].rightStile`,
          fraction(numQty(changeValue))
        )
      );

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].topRail`,
          fraction(numQty(changeValue))
        )
      );

      dispatch(
        change(
          'Order',
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
                  <th>Finishing</th>
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
                          formState.part_list[i]?.dimensions[index]?.width,
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
                          formState.part_list[i]?.dimensions[index]?.height,
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
                        placeholder={
                          '$' + prices[i][index]?.toFixed(2)
                            ? prices[i][index]?.toFixed(2)
                            : 0
                        }
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
                    {finish[i] ? (
                      <Input
                        type="text"
                        className="form-control"
                        disabled={true}
                        placeholder={
                          '$' + finish[i][index]?.toFixed(2)
                            ? finish[i][index]?.toFixed(2)
                            : 0
                        }
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
                      <p>Sketch Ref #</p>
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

                <tr />
              </tbody>
            </Table>

            <Row>
              <Col xs="5">
                <strong>Notes</strong>
                <Row>
                  <Col lg="10">
                    <Field
                      name={`${table}.notes`}
                      type="textarea"
                      component={renderTextField}
                      edit={edit}
                      label="notes"
                    />
                  </Col>

                  <Col lg="2">
                    {!edit ? (
                      <Button
                        color="danger"
                        className="btn-circle"
                        onClick={(e) => clearNotes(index, e)}
                      >
                        X
                      </Button>
                    ) : null}
                  </Col>
                </Row>
              </Col>
              <Col lg="4" />
              <Col xs="3">
                <strong>Extra Design Cost</strong>
                <Field
                  name={`${table}.extraCost`}
                  type="text"
                  component={renderField}
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
                onClick={(e) => {
                  const construction =
                    formState?.part_list[i]?.construction?.value;
                  const profile =
                    formState?.part_list[i]?.profile?.PROFILE_WIDTH;
                  const design = formState?.part_list[i]?.design?.PROFILE_WIDTH;

                  const index = fields.length - 1;

                  if (fields.length > 0) {
                    dispatch(
                      touch(
                        'Order',
                        `part_list[${i}].dimensions[${index}].notes`
                      )
                    );
                    dispatch(
                      touch(
                        'Order',
                        `part_list[${i}].dimensions[${index}].width`
                      )
                    );
                    dispatch(
                      touch(
                        'Order',
                        `part_list[${i}].dimensions[${index}].height`
                      )
                    );
                  }

                  dispatch(touch('Order', `part_list[${i}].woodtype`));
                  dispatch(
                    touch('Order', `part_list[${i}].face_frame_design`)
                  );
                  dispatch(
                    touch('Order', `part_list[${i}].face_frame_finishing`)
                  );

                  dispatch(startAsyncValidation('Order'));

                  fields.push({
                    qty: 1,
                    openings: 1,
                    horizontalMidRailSize: 0,
                    verticalMidRailSize: 0,
                    unevenSplitInput: '0',
                    unevenSplit: false,
                    unevenCheck: false,
                    showBuilder: false,
                  });
                }}
              >
                +
              </Button>
            ) : (
              <div />
            )}
          </Col>
        </Row>
        <Row>
          <Col xs="9" />
          <Col xs="3">
            <strong>Finish Sub Total: </strong>
            {finishSubtotal[i] ? (
              <RenderPriceHolder
                input={finishSubtotal[i].toFixed(2)}
                edit={true}
              />
            ) : (
              <RenderPriceHolder input={'0.00'} edit={true} />
            )}
          </Col>
        </Row>
        <Row>
          <Col xs="9" />
          <Col xs="3">
            <strong>Item Sub Total: </strong>
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

const mapStateToProps = (state) => ({
  formSyncErrors: getFormSyncErrors('Order')(state),
});

export default connect(mapStateToProps, null)(Frame_Only_Table);
