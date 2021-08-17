import React, { useState, Fragment, useEffect } from 'react';
import { Table, Input, Row, Col, Button, FormGroup, Label } from 'reactstrap';
import 'semantic-ui-css/semantic.min.css';
import {
  Field,
  change,
  touch,
  startAsyncValidation,
  getFormSyncErrors,
} from 'redux-form';
import Ratio from 'lb-ratio';
import Maker from '../../MakerJS/Maker';
import 'react-widgets/dist/css/react-widgets.css';
import {
  renderField,
  renderNumber,
  renderFieldDisabled,
  renderCheckboxToggle,
  renderPrice,
  renderDropdownList,
} from '../../../RenderInputs/renderInputs';
import RenderPriceHolder from '../../../RenderInputs/RenderPriceHolder';
import { connect } from 'react-redux';
import numQty from 'numeric-quantity';
import currencyMask from '../../../../utils/currencyMask';
import { NotificationManager } from 'react-notifications';
import FullFrameModal from '../../../../utils/Modal';

const required = (value) => (value ? undefined : 'Required');
const trim_val = (value) => (value.trim('') ? undefined : 'Required');

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

const Cope_Table = ({
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
  lites,
  formSyncErrors,
}) => {
  const [width, setWidth] = useState([]);
  const [height, setHeight] = useState([]);
  const [changeValue, setChangeValue] = useState(null);
  const [leftStileWidth, setLeftStileWidth] = useState(null);
  const [rightStileWidth, setRightStileWidth] = useState(null);
  const [topRailWidth, setTopRailWidth] = useState(null);
  const [bottomRailWidth, setBottomRailWidth] = useState(null);
  const [fullFrameNote, setFullFrameNote] = useState(false);
  const [tableIndex, setTableIndex] = useState(0);

  useEffect(() => {
    setWidth([]);
    setHeight([]);
    setChangeValue(null);
    setLeftStileWidth(null);
    setRightStileWidth(null);
    setTopRailWidth(null);
    setBottomRailWidth(null);
  }, [updateSubmit]);

  useEffect(() => {
    const part = formState?.part_list[i];
  });

  const toggleFullFrameNote = () => setFullFrameNote(!fullFrameNote);

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

  const h = (e, v, index) => {
    e.preventDefault();
    let newHeight = [...height];
    if (height[index]) {
      newHeight.splice(index, 1, v);
    } else {
      newHeight = [...newHeight, v];
    }
    setHeight(newHeight);

    const part = formState?.part_list[i];
    const leftStile = part.dimensions[index].leftStile;
    const rightStile = part.dimensions[index].rightStile;

    const limit = numQty(leftStile) + numQty(rightStile);
    const heightLimit = numQty(v) * (2 / 3);

    if (heightLimit > limit) {
      toggleFullFrameNote();
    }

    console.log({ limit });
    console.log({ heightLimit });
    console.log({ i });
  };

  const updateFullFrame = (e, index) => {
    const part = formState.part_list[i];
    if (e) {
      if (leftStileWidth) {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].topRail`,
            fraction(numQty(leftStileWidth))
          )
        );

        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].bottomRail`,
            fraction(numQty(leftStileWidth))
          )
        );
      } else {
        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].topRail`,
            fraction(part.profile ? part.profile?.PROFILE_WIDTH : 0)
          )
        );

        dispatch(
          change(
            'DoorOrder',
            `part_list[${i}].dimensions[${index}].bottomRail`,
            fraction(part.profile ? part.profile?.PROFILE_WIDTH : 0)
          )
        );
      }
    } else {
      dispatch(
        change(
          'DoorOrder',
          `part_list[${i}].dimensions[${index}].topRail`,
          fraction(part.profile ? part.profile.DF_Reduction : 0)
        )
      );
      dispatch(
        change(
          'DoorOrder',
          `part_list[${i}].dimensions[${index}].bottomRail`,
          fraction(part.profile ? part.profile.DF_Reduction : 0)
        )
      );
    }
  };

  const clearNotes = (index, e) => {
    dispatch(
      change('DoorOrder', `part_list[${i}].dimensions[${index}].notes`, '')
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
    }
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

  const addFields = (i) => {
    const construction = formState?.part_list[i]?.construction?.value;
    const profile = formState?.part_list[i]?.profile?.PROFILE_WIDTH;
    const design = formState?.part_list[i]?.design?.PROFILE_WIDTH;
    const leftStile = formState?.part_list[i]?.leftStile;
    const rightStile = formState?.part_list[i]?.rightStile;
    const topRail = formState?.part_list[i]?.topRail;
    const bottomRail = formState?.part_list[i]?.bottomRail;

    const index = fields.length - 1;
    setTableIndex(fields.length);

    if (fields.length > 0) {
      dispatch(
        touch('DoorOrder', `part_list[${i}].dimensions[${index}].notes`)
      );
      dispatch(
        touch('DoorOrder', `part_list[${i}].dimensions[${index}].width`)
      );
      dispatch(
        touch('DoorOrder', `part_list[${i}].dimensions[${index}].height`)
      );
    }

    dispatch(touch('DoorOrder', `part_list[${i}].woodtype`));
    dispatch(touch('DoorOrder', `part_list[${i}].design`));

    if (construction !== 'Miter') {
      dispatch(touch('DoorOrder', `part_list[${i}].edge`));
    }

    if (construction === 'Cope') {
      dispatch(touch('DoorOrder', `part_list[${i}].profile`));
    }

    dispatch(touch('DoorOrder', `part_list[${i}].applied_profile`));
    dispatch(touch('DoorOrder', `part_list[${i}].panel`));

    dispatch(startAsyncValidation('DoorOrder'));

    let df_reduction = 0;

    if (construction === 'Cope') {
      df_reduction = formState?.part_list[i]?.profile?.DF_Reduction;
    } else if (construction === 'MT') {
      df_reduction = formState?.part_list[i]?.design?.DF_REDUCTION;
    } else {
      df_reduction = design;
    }

    fields.push({
      qty: 1,
      panelsH: 1,
      panelsW: 1,
      leftStile: leftStileWidth
        ? fraction(numQty(leftStileWidth))
        : leftStile
          ? leftStile
          : construction === 'Cope' && profile
            ? fraction(profile)
            : fraction(design),
      rightStile: rightStileWidth
        ? fraction(numQty(rightStileWidth))
        : rightStile
          ? rightStile
          : construction === 'Cope' && profile
            ? fraction(profile)
            : fraction(design),
      topRail: topRailWidth
        ? fraction(numQty(topRailWidth))
        : topRail
          ? topRail
          : fraction(df_reduction),
      bottomRail: bottomRailWidth
        ? fraction(numQty(bottomRailWidth))
        : bottomRail
          ? bottomRail
          : fraction(df_reduction),
      horizontalMidRailSize: 0,
      verticalMidRailSize: 0,
      unevenSplitInput: '0',
      showBuilder: false,
      full_frame: false,
      glass_check_0:
        formState.part_list[i]?.panel?.NAME === 'Glass' ? true : false,
    });
  };

  console.log({ tableIndex });

  const addFullFrameNote = (e) => {
    updateFullFrame(e, tableIndex);
    toggleFullFrameNote();
    dispatch(
      change(
        'DoorOrder',
        `part_list[${i}].dimensions[${tableIndex}].full_frame`,
        true
      )
    );
  };

  return formState ? (
    <div>
      <FullFrameModal
        toggle={toggleFullFrameNote}
        modal={fullFrameNote}
        message={
          'Based On Your Sizes, We Suggest Making The Framing Full Frame'
        }
        title={'Do you want a full frame?'}
        actionButton={'Update to Full Frame'}
        action={(e) => {
          addFullFrameNote(e);
        }}
      />
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
                      component={renderNumber}
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
                    {prices[i] ? (
                      <Input
                        type="text"
                        className="form-control"
                        disabled={edit}
                        placeholder={'$' + prices[i][index].toFixed(2) || 0}
                      />
                    ) : (
                      <Input
                        type="text"
                        disabled={edit}
                        className="form-control"
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
                <Field
                  name={`${table}.showBuilder`}
                  component={renderCheckboxToggle}
                  label="Show Builder"
                />
              </Col>
              <Col>
                <Field
                  name={`${table}.full_frame`}
                  component={renderCheckboxToggle}
                  onChange={(e) => updateFullFrame(e, index)}
                  edit={edit}
                  label="Full Frame"
                />
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

            <div>
              <Row>
                {Array.from(
                  formState.part_list[i].dimensions[index].panelsH
                    ? Array(
                      parseInt(
                        formState.part_list[i].dimensions[index].panelsH
                      )
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
                      parseInt(
                        formState.part_list[i].dimensions[index].panelsH
                      )
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
                <Row>
                  <Col lg="11">
                    <Field
                      name={`${table}.notes`}
                      type="textarea"
                      component={renderField}
                      edit={edit}
                      label="notes"
                      validate={
                        glass_note_check(index) ? [required, trim_val] : null
                      }
                    />
                  </Col>
                  <Col lg="1">
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
                onClick={(e) => addFields(i)}
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

const mapStateToProps = (state) => ({
  lites: state.part_list.lites,
  formSyncErrors: getFormSyncErrors('DoorOrder')(state),
});

export default connect(mapStateToProps, null)(Cope_Table);
