import Ratio from 'lb-ratio';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import {
  Field,
  getFormSyncErrors,
  startAsyncValidation,
  touch,
} from 'redux-form';
import 'semantic-ui-css/semantic.min.css';
import currencyMask from '../../../../utils/currencyMask';
// import 'react-widgets/dist/css/react-widgets.css';
import {
  renderCheckboxToggle,
  renderField,
  renderFieldDisabled,
  renderInt,
  renderNumber,
  renderPrice,
} from '../../../RenderInputs/renderInputs';
import RenderPriceHolder from '../../../RenderInputs/RenderPriceHolder';
import Maker from '../../MakerJS/Maker';
import CSVDimensionUploader from '../../../CSVDimensionUploader/CSVDimensionUploader';

const required = (value) => (value ? undefined : 'Required');

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

const Slab_Door_Table = ({
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
  formSyncErrors,
  role,
}) => {
  const [width, setWidth] = useState([]);
  const [height, setHeight] = useState([]);
  const [changeValue, setChangeValue] = useState(null);

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
        partName="Slab Door"
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
                        disabled={true}
                        className="form-control"
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
                {edit ? (
                  parseInt(formState.part_list[i]?.dimensions[index]?.panelsH) >
                    1 &&
                  parseInt(
                    formState.part_list[i]?.dimensions[index]?.panelsW
                  ) === 1 ? (
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

            {formState.part_list[i]?.dimensions[index]?.unevenCheck ? (
              <div className="mb-3">
                <Row>
                  {Array.from(
                    Array(
                      parseInt(
                        formState.part_list[i]?.dimensions[index]?.panelsH
                      )
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

                  if (construction !== 'Miter') {
                    dispatch(touch('Order', `part_list[${i}].edge`));
                  }

                  dispatch(touch('Order', `part_list[${i}].applied_profile`));

                  dispatch(startAsyncValidation('Order'));

                  fields.push({
                    qty: 1,
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
  role: state?.users?.user?.role,
  formSyncErrors: getFormSyncErrors('Order')(state),
});

export default connect(mapStateToProps, null)(Slab_Door_Table);
