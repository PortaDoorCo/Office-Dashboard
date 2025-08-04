import React, { useState, Fragment, useEffect } from 'react';
import {
  Table,
  Input,
  Row,
  Col,
  Button,
  FormGroup,
  Label,
  ButtonGroup,
} from 'reactstrap';
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
// import 'react-widgets/dist/css/react-widgets.css';
import {
  renderField,
  renderNumber,
  renderCheckboxToggle,
  renderPrice,
  renderDropdownList,
  renderTextField,
} from '../../../RenderInputs/renderInputs';
import RenderPriceHolder from '../../../RenderInputs/RenderPriceHolder';
import { connect } from 'react-redux';
import CSVDimensionUploader from '../../../CSVDimensionUploader/CSVDimensionUploader';
import numQty from 'numeric-quantity';
import currencyMask from '../../../../utils/currencyMask';

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
  role,
}) => {
  const [width, setWidth] = useState([]);
  const [height, setHeight] = useState([]);
  const [changeValue, setChangeValue] = useState(null);

  const index = fields.length - 1;

  const leftStile =
    index >= 0 ? formState?.part_list[i]?.dimensions[index]?.leftStile : null;
  const rightStile =
    index >= 0 ? formState?.part_list[i]?.dimensions[index]?.rightStile : null;
  const topRail =
    index >= 0 ? formState?.part_list[i]?.dimensions[index]?.topRail : null;
  const bottomRail =
    index >= 0 ? formState?.part_list[i]?.dimensions[index]?.bottomRail : null;
  const defaultLeftStile = formState?.part_list[i]?.wrap_width;
  const defaultRightStile = formState?.part_list[i]?.wrap_width;
  const defaultTopRail = formState?.part_list[i]?.wrap_width;
  const defaultBottomRail = formState?.part_list[i]?.wrap_width;
  const full_frame = formState?.part_list[i]?.dimensions[index]?.full_frame;

  useEffect(() => {
    setWidth([]);
    setHeight([]);
    setChangeValue(null);
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

  const h = (e, v, index) => {
    e.preventDefault();
    let newHeight = [...height];
    if (height[index]) {
      newHeight.splice(index, 1, v);
    } else {
      newHeight = [...newHeight, v];
    }
    setHeight(newHeight);
  };

  const clearNotes = (index, e) => {
    dispatch(change('Order', `part_list[${i}].dimensions[${index}].notes`, ''));
  };

  const registerChange = (index, e) => {
    const value = e.target.value;
    setChangeValue(value);
  };

  const changeFraming = (e, index) => {
    if (e.target.name === 'update_framing') {
      if (changeValue) {
        const newVal = fraction(numQty(changeValue));

        // dispatch(
        //   change(
        //     'Order',
        //     `part_list[${i}].dimensions[${index}].notes`,
        //     `${
        //       full_frame ? 'Full Frame \n' : ''
        //     }Left Stile: ${newVal}" Right Stile: ${newVal}" \nTop Rail: ${topRail}" Bottom Rail: ${bottomRail}"`
        //   )
        // );

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
      }
    }

    if (e.target.name === 'default_framing') {
      dispatch(
        change('Order', `part_list[${i}].dimensions[${index}].notes`, '')
      );

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].leftStile`,
          fraction(numQty(defaultLeftStile))
        )
      );

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].rightStile`,
          fraction(numQty(defaultRightStile))
        )
      );

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].topRail`,
          fraction(numQty(defaultTopRail))
        )
      );

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].bottomRail`,
          fraction(numQty(defaultBottomRail))
        )
      );
    }
  };

  const glass_note_check = (index) => {
    const obj_names = Object.entries(
      formState?.part_list[i]?.dimensions[index]
        ? formState?.part_list[i]?.dimensions[index]
        : []
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
    const design = formState?.part_list[i]?.design?.PROFILE_WIDTH;

    if (fields.length > 0) {
      dispatch(touch('Order', `part_list[${i}].dimensions[${index}].notes`));
      dispatch(touch('Order', `part_list[${i}].dimensions[${index}].width`));
      dispatch(touch('Order', `part_list[${i}].dimensions[${index}].height`));
    }

    dispatch(touch('Order', `part_list[${i}].woodtype`));
    dispatch(touch('Order', `part_list[${i}].design`));

    if (construction !== 'Miter') {
      dispatch(touch('Order', `part_list[${i}].edge`));
    }

    if (construction === 'Cope') {
      dispatch(touch('Order', `part_list[${i}].profile`));
    }

    dispatch(touch('Order', `part_list[${i}].applied_profile`));
    dispatch(touch('Order', `part_list[${i}].panel`));

    dispatch(touch('Order', `part_list[${i}].leftStile`));
    dispatch(touch('Order', `part_list[${i}].rightStile`));
    dispatch(touch('Order', `part_list[${i}].topRail`));
    dispatch(touch('Order', `part_list[${i}].bottomRail`));

    dispatch(startAsyncValidation('Order'));

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
      leftStile: defaultLeftStile,
      rightStile: defaultRightStile,
      topRail: defaultTopRail,
      bottomRail: defaultBottomRail,
      notes: '',
      horizontalMidRailSize: 0,
      verticalMidRailSize: 0,
      unevenSplitInput: '0',
      showBuilder: false,
      full_frame: false,
      glass_check_0: formState.part_list[i]?.panel?.glass ? true : false,
    });
  };

  const construction = formState?.part_list[i]?.construction?.value;

  let itemNum = 0;

  const itemNumCounter = {
    ...formState,
    part_list: formState?.part_list?.map((i) => {
      return {
        ...i,
        dimensions: i?.dimensions?.map((j) => {
          itemNum += 1;
          return {
            ...j,
            item: itemNum,
          };
        }),
      };
    }),
  };

  return formState ? (
    <div>
      <CSVDimensionUploader
        fields={fields}
        edit={edit}
        partIndex={i}
        partName="Wrapped Door"
      />

      <Fragment>
        {fields.map((table, index) => (
          <Fragment key={index}>
            <hr />
            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="panel">
                    <strong>
                      Line #{' '}
                      {itemNumCounter?.part_list[i]?.dimensions[index]?.item}
                    </strong>
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
                        disabled={true}
                        className="form-control"
                        placeholder={'$0.00'}
                      />
                    )}
                  </td>
                  <td>
                    {edit ? (
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

                {/* <tr>
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
                      onChange={(e) => registerChange(index, e)}
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
                      onChange={(e) => registerChange(index, e)}
                    />
                  </td>

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
                      onChange={(e) => registerChange(index, e)}
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
                      onChange={(e) => registerChange(index, e)}
                    />
                  </td>
                </tr> */}

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

                {edit ? (
                  <tr>
                    <td>
                      <ButtonGroup vertical>
                        <Button
                          onClick={(e) => changeFraming(e, index)}
                          color="primary"
                          name="update_framing"
                        >
                          Update Framing
                        </Button>
                        <Button
                          onClick={(e) => changeFraming(e, index)}
                          color="primary"
                          name="default_framing"
                        >
                          Default Framing
                        </Button>
                      </ButtonGroup>
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
                  edit={true}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                {formState.part_list[i]?.dimensions[index]?.showBuilder ? (
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
                      validate={
                        glass_note_check(index) ? [required, trim_val] : null
                      }
                    />
                  </Col>

                  <Col lg="2">
                    {edit ? (
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

              {role?.type === 'authenticated' ||
              role?.type === 'owner' ||
              role?.type === 'administrator' ||
              role?.type === 'management' ||
              role?.type === 'office' ? (
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
              ) : null}
            </Row>
            <br />
          </Fragment>
        ))}
        <Row>
          <Col>
            {edit ? (
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
          <Col xs="9" />
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
  role: state?.users?.user?.role,
  formSyncErrors: getFormSyncErrors('Order')(state),
});

export default connect(mapStateToProps, null)(Cope_Table);
