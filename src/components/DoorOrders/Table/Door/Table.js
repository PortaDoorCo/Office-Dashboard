import React, { useState, Fragment, useEffect } from 'react';
import { Table, Input, Row, Col, Button, FormGroup, Label } from 'reactstrap';
import 'semantic-ui-css/semantic.min.css';
import { Field, change } from 'redux-form';
import Ratio from 'lb-ratio';
import Maker from '../../MakerJS/Maker';
import 'react-widgets/dist/css/react-widgets.css';
import {
  renderField,
  renderNumber,
  renderInt,
  renderFieldDisabled,
  renderDropdownList,
  renderCheckboxToggle,
  renderPrice,
} from '../../../RenderInputs/renderInputs';
import RenderPriceHolder from '../../../RenderInputs/RenderPriceHolder';
import { connect } from 'react-redux';
import numQty from 'numeric-quantity';
import WarningModal from '../Warnings/Modal';
import currencyMask from '../../../../utils/currencyMask';
import { deleteMiscItem } from '../../../../redux/misc_items/actions';

const required = (value) => (value ? undefined : 'Required');
const trim_val = value => (value.trim('')  ? undefined : 'Required');

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

const DoorTable = ({
  props,
  fields,
  formState,
  i,
  prices,
  subTotal,
  updateSubmit,
  edit,
  dispatch,
  addPrice,
  lites,
}) => {
  const [width, setWidth] = useState([]);
  const [height, setHeight] = useState([]);
  const [changeValue, setChangeValue] = useState(null);
  const [leftStileWidth, setLeftStileWidth] = useState(null);
  const [rightStileWidth, setRightStileWidth] = useState(null);
  const [topRailWidth, setTopRailWidth] = useState(null);
  const [bottomRailWidth, setBottomRailWidth] = useState(null);

  const [modal, setModal] = useState(false);
  const [warningType, setWarningType] = useState(null);
  const toggle = () => setModal(!modal);

  useEffect(() => {
    setWidth([]);
    setHeight([]);
    setChangeValue(null);
    setLeftStileWidth(null);
    setRightStileWidth(null);
    setTopRailWidth(null);
    setBottomRailWidth(null);
  }, [updateSubmit]);

  const w = (e, v, index) => {
    e.preventDefault();
    const part = formState.part_list[i];
    let newWidth = [...width];
    if (width[index]) {
      newWidth.splice(index, 1, v);
    } else {
      newWidth = [...newWidth, v];
    }

    if (numQty(v) >= 24) {
      setWarningType({
        value: v,
        index: index,
        i: i,
        part: part,
        tag: 'width',
        sub_tag: 'width_greater_than',
        title: 'Width Greater Than 24 Inches',
        message:
          'Your Width is Greater than 24 inches.  Do you want to add a panel? We cannot guarantee your products warranty if width is greater than 24 inches',
        action: 'Add Panel',
        deny: 'No Thanks',
      });
      toggle();
    }

    setWidth(newWidth);
  };

  const h = (e, v, index) => {
    e.preventDefault();
    const part = formState.part_list[i];
    let newHeight = [...height];
    if (height[index]) {
      newHeight.splice(index, 1, v);
    } else {
      newHeight = [...newHeight, v];
    }

    if (numQty(v) >= 48) {
      setWarningType({
        value: v,
        index: index,
        i: i,
        part: part,
        tag: 'height',
        sub_tag: 'height_greater_than',
        title: 'Height Greater Than 48 Inches',
        message:
          'Your Height is Greater than 48 inches.  Do you want to add a panel? We cannot guarantee your products warranty if height is greater than 48 inches',
        action: 'Add Panel',
        deny: 'No Thanks',
      });
      toggle();
    }
    setHeight(newHeight);
  };

  const clearNotes = (index, e) => {
    dispatch(
      change('DoorOrder', `part_list[${i}].dimensions[${index}].notes`, '')
    );
  };

  const twoHigh = (index, e, v) => {
    let value;
    const part = formState.part_list[i];

    if (e) {
      value = e.target.value;
      if (part.dimensions[index].notes !== '' && parseInt(e.target.value) > 1) {
        dispatch(
          change('DoorOrder', `part_list[${i}].dimensions[${index}].notes`, '')
        );
      } else {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].notes`,
            'OVERSIZE - NO GUARANTEE'
          )
        );
      }
    } else {
      value = v;
      if (
        part.dimensions[index].notes !== '' &&
        parseInt(part.dimensions[index].panelsW) > 1 &&
        parseInt(v) > 1
      ) {
        dispatch(
          change('DoorOrder', `part_list[${i}].dimensions[${index}].notes`, '')
        );
        dispatch(
          change('DoorOrder', `part_list[${i}].dimensions[${index}].panelsH`, v)
        );
      } else {
        dispatch(
          change('DoorOrder', `part_list[${i}].dimensions[${index}].panelsH`, v)
        );
      }
    }

    if (value > 1) {
      if (part.construction?.value === 'Cope') {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].horizontalMidRailSize`,
            fraction(part.profile ? part.profile?.PROFILE_WIDTH : 0)
          )
        );
      } else {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].horizontalMidRailSize`,
            fraction(part.design ? part.design?.PROFILE_WIDTH : 0)
          )
        );
      }

      if (part.panel?.NAME === 'Glass') {
        for (let j = 0; j < value; j++) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].glass_check_${j}`,
              true
            )
          );
        }
      }
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

  const twoWide = (index, e, v) => {
    const part = formState.part_list[i];
    let value;
    if (e) {
      value = e.target.value;
      if (
        part.dimensions[index].notes !== '' &&
        parseInt(part.dimensions[index].panelsH) > 1 &&
        parseInt(e.target.value) > 1
      ) {
        dispatch(
          change('DoorOrder', `part_list[${i}].dimensions[${index}].notes`, '')
        );
      } else {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].notes`,
            'OVERSIZE - NO GUARANTEE'
          )
        );
      }
    } else {
      value = v;
      if (
        part.dimensions[index].notes !== '' &&
        parseInt(part.dimensions[index].panelsH) > 1 &&
        parseInt(v) > 1
      ) {
        dispatch(
          change('DoorOrder', `part_list[${i}].dimensions[${index}].notes`, '')
        );
        dispatch(
          change('DoorOrder', `part_list[${i}].dimensions[${index}].panelsW`, v)
        );
      } else {
        dispatch(
          change('DoorOrder', `part_list[${i}].dimensions[${index}].panelsW`, v)
        );
      }
    }

    if (value > 1) {
      if (part.construction?.value === 'Cope') {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].verticalMidRailSize`,
            fraction(part.profile ? part.profile?.PROFILE_WIDTH : 0)
          )
        );
      } else {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].verticalMidRailSize`,
            fraction(part.profile ? part.design?.PROFILE_WIDTH : 0)
          )
        );
      }
    } else {
      dispatch(
        change(
          'DoorOrder',
          `part_list[${i}].dimensions[${index}].verticalMidRailSize`,
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
  

  const addFields = (i) => {
    const construction = formState?.part_list[i]?.construction?.value;
    const profile = formState?.part_list[i]?.profile?.PROFILE_WIDTH;
    const design = formState?.part_list[i]?.design?.PROFILE_WIDTH;

    fields.push({
      qty: 1,
      panelsH: 1,
      panelsW: 1,
      leftStile: leftStileWidth
        ? fraction(numQty(leftStileWidth))
        : construction === 'Cope' && profile
          ? fraction(profile)
          : fraction(design),
      rightStile: rightStileWidth
        ? fraction(numQty(rightStileWidth))
        : construction === 'Cope' && profile
          ? fraction(profile)
          : fraction(design),
      topRail: topRailWidth
        ? fraction(numQty(topRailWidth))
        : construction === 'Cope' && profile
          ? fraction(profile)
          : fraction(design),
      bottomRail: bottomRailWidth
        ? fraction(numQty(bottomRailWidth))
        : construction === 'Cope' && profile
          ? fraction(profile)
          : fraction(design),
      horizontalMidRailSize: 0,
      verticalMidRailSize: 0,
      unevenSplitInput: '0',
      showBuilder: false,
      unevenCheck: false,
      unevenSplit: false,
      glass_check_0:
        formState.part_list[i]?.panel?.NAME === 'Glass' ? true : false,
    });
  };

  const glass_note_check = (index) => {
    const obj_names = Object.entries(
      formState?.part_list[i]?.dimensions[index]
    );

    const filter_obj = obj_names.filter((n) => n[0].includes('glass_check'));

    const check_if_glass = filter_obj
      .filter((n) => n[1])
      .map((k) => k.includes(true))
      .includes(true);

    return check_if_glass;
  };

  return (
    <div>
      {modal ? (
        <WarningModal
          toggle={toggle}
          modal={modal}
          warningType={warningType}
          twoHigh={twoHigh}
          twoWide={twoWide}
          dispatch={dispatch}
          change={change}
          prices={prices}
        />
      ) : null}
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
                    validate={[required]}
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
                    name={`${table}.panelsH`}
                    type="text"
                    component={renderNumber}
                    label="horizontalMidRail"
                    edit={edit}
                    onChange={(e) => twoHigh(index, e)}
                  />
                </td>
                <td>
                  <Field
                    name={`${table}.panelsW`}
                    type="text"
                    component={renderNumber}
                    label="verticalMidRail"
                    edit={edit}
                    onChange={(e) => twoWide(index, e)}
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
                      registerChange(index, e), setTopRailWidth(e.target.value)
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
                <td>
                  <strong>
                    <p>Vert. Mid Rail</p>
                  </strong>
                  <Field
                    name={`${table}.verticalMidRailSize`}
                    type="text"
                    component={renderNumber}
                    label="verticalMidRail"
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
            <Col lg="2">
              <FormGroup>
                <strong>Show Builder</strong>
                <Field
                  name={`${table}.showBuilder`}
                  component={renderCheckboxToggle}
                />
              </FormGroup>
            </Col>
            <Col>
              {parseInt(formState.part_list[i].dimensions[index].panelsH) > 1 &&
              parseInt(formState.part_list[i].dimensions[index].panelsW) ===
                1 ? (
                  <FormGroup>
                    <strong>Uneven Split</strong>
                    <Field
                      name={`${table}.unevenCheck`}
                      component={renderCheckboxToggle}
                      edit={edit}
                    />
                  </FormGroup>
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

          {formState?.part_list[i]?.dimensions[index]?.unevenCheck ? (
            <div className="mb-3">
              <Row>
                {Array.from(
                  Array(
                    parseInt(formState.part_list[i]?.dimensions[index]?.panelsH)
                      ? parseInt(
                          formState.part_list[i]?.dimensions[index]?.panelsH
                      )
                      : 0
                  ).keys()
                )
                  .slice(1)
                  .map((i, index) => {
                    return (
                      <div>
                        <Col />
                        <Col>
                          <p style={{ textAlign: 'center', marginTop: '10px' }}>
                            <strong>Panel Opening {index + 1}</strong>
                          </p>
                          <Field
                            name={`${table}.unevenSplitInput${index}`}
                            component={renderField}
                            edit={edit}
                            validate={required}
                          />
                        </Col>
                        <Col />
                      </div>
                    );
                  })}
              </Row>
            </div>
          ) : null}

          <div>
            <Row>
              {Array.from(
                formState.part_list[i].dimensions[index].panelsH
                  ? Array(
                    parseInt(formState.part_list[i].dimensions[index].panelsH)
                  ).keys()
                  : 0
              ).map((i, index) => {
                return (
                  <Col lg="2">
                    <FormGroup>
                      <strong>Glass Opening {index + 1}</strong>
                      <Field
                        name={`${table}.glass_check_${index}`}
                        component={renderCheckboxToggle}
                        edit={edit}
                      />
                    </FormGroup>
                  </Col>
                );
              })}
            </Row>
            <Row>
              {Array.from(
                formState.part_list[i].dimensions[index].panelsH
                  ? Array(
                    parseInt(formState.part_list[i].dimensions[index].panelsH)
                  ).keys()
                  : 0
              ).map((l, k) => {
                return eval(
                  `formState.part_list[i].dimensions[index].glass_check_${k}`
                ) ? (
                    <Col lg="2">
                      <FormGroup>
                        <strong>Opening {k + 1} Options</strong>
                        <Field
                          name={`${table}.lite_${k}`}
                          component={renderDropdownList}
                          data={lites}
                          valueField="value"
                          textField="NAME"
                          validate={required}
                          edit={edit}
                        />
                      </FormGroup>
                    </Col>
                  ) : null;
              })}
            </Row>
          </div>

          <Row>
            <Col xs="4">
              <strong>Notes</strong>
              <Field
                name={`${table}.notes`}
                type="textarea"
                component={renderField}
                edit={edit}
                label="notes"
                validate={glass_note_check(index) ? [required, trim_val] : null}
              />
            </Col>
            <Col xs="5"></Col>
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
            <div>
              <Button
                color="primary"
                className="btn-circle add-item-tour"
                onClick={(e) => addFields(i)}
              >
                +
              </Button>
            </div>
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
    </div>
  );
};

const mapStateToProps = (state) => ({
  lites: state.part_list.lites,
});

export default connect(mapStateToProps, null)(DoorTable);
