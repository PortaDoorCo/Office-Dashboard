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
  startAsyncValidation,
  touch,
  getFormSyncErrors,
} from 'redux-form';
import Ratio from 'lb-ratio';
import Maker from '../../MakerJS/Maker';
// import 'react-widgets/dist/css/react-widgets.css';
import {
  renderField,
  renderNumber,
  renderInt,
  renderDropdownList,
  renderCheckboxToggle,
  renderPrice,
  renderTextField,
} from '../../../RenderInputs/renderInputs';
import RenderPriceHolder from '../../../RenderInputs/RenderPriceHolder';
import { connect } from 'react-redux';
import numQty from 'numeric-quantity';
import WarningModal from '../Warnings/Modal';
import currencyMask from '../../../../utils/currencyMask';

const required = (value) => (value ? undefined : 'Required');
const trim_val = (value) => (value.trim('') ? undefined : 'Required');

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
  formError,
  formSyncErrors,
}) => {
  const [width, setWidth] = useState([]);
  const [height, setHeight] = useState([]);
  const [changeValue, setChangeValue] = useState(null);
  const [modal, setModal] = useState(false);
  const [warningType, setWarningType] = useState(null);
  const [panels, setPanels] = useState([[]]);
  const [stiles, setStiles] = useState([[]]);
  const [rails, setRails] = useState([[]]);
  const toggle = () => setModal(!modal);

  const index = fields.length - 1;

  const styles = {
    border: '2px solid #d1d4d7', 
    borderRadius: '25px',
    padding: '3%',
  };

  // const leftStile =
  //   index >= 0 ? formState?.part_list[i]?.dimensions[index]?.leftStile : null;
  // const rightStile =
  //   index >= 0 ? formState?.part_list[i]?.dimensions[index]?.rightStile : null;
  // const topRail =
  //   index >= 0 ? formState?.part_list[i]?.dimensions[index]?.topRail : null;
  // const bottomRail =
  //   index >= 0 ? formState?.part_list[i]?.dimensions[index]?.bottomRail : null;
  // const defaultLeftStile = formState?.part_list[i]?.leftStile;
  // const defaultRightStile = formState?.part_list[i]?.rightStile;
  // const defaultTopRail = formState?.part_list[i]?.topRail;
  // const defaultBottomRail = formState?.part_list[i]?.bottomRail;
  // const panelsH = formState?.part_list[i]?.dimensions[index]?.panelsH;
  // const panelsW = formState?.part_list[i]?.dimensions[index]?.panelsW;

  // const topRailAdd = formState?.part_list[i]?.design?.TOP_RAIL_ADD;
  // const bottomRailAdd = formState?.part_list[i]?.design?.BTM_RAIL_ADD;

  // const construction = formState?.part_list[i]?.construction?.value;

  useEffect(() => {
    setWidth([]);
    setHeight([]);
    setChangeValue(null);
  }, [updateSubmit]);


  const clearNotes = (index, e) => {
    dispatch(change('Order', `part_list[${i}].dimensions[${index}].notes`, ''));
  };

  const registerChange = (index, e) => {
    const value = e.target.value;
    setChangeValue(value);
  };





  const addFields = (i) => {
    const construction = formState?.part_list[i]?.construction?.value;
    // const profile = formState?.part_list[i]?.profile?.PROFILE_WIDTH;
    // const design = formState?.part_list[i]?.design?.PROFILE_WIDTH;

    if (fields.length >= 0) {
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

    fields.push({
      qty: 1,
      panelsH: 1,
      panelsW: 1,
      // leftStile: leftStile ? leftStile : defaultLeftStile,
      // rightStile: rightStile ? rightStile : defaultRightStile,
      // topRail: topRail ? topRail : defaultTopRail,
      // bottomRail: bottomRail ? bottomRail : defaultBottomRail,
      horizontalMidRailSize: 0,
      verticalMidRailSize: 0,
      unevenSplitInput: '0',
      showBuilder: false,
      unevenCheck: false,
      unevenSplit: false,
      notes: '',
      glass_check_0:
        formState.part_list[i]?.panel?.NAME === 'Glass' ? true : false,
    });
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

  console.log({panels});

  return (
    <div>
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
            </tbody>
          </Table>

          <div style={styles}>
            {stiles.map((i, index) => {
              return (
                <div>
                  <Row>
                    <Col>
                      <strong>Stile {index + 1}</strong>
                      <Table>
                        <tr>
                          <td>
                            <strong>
                              <p>Stile Width</p>
                            </strong>
                            <Field
                              name={`${table}.stile_width_${index}`}
                              type="text"
                              component={renderNumber}
                              label="width"
                              validate={[required]}
                              edit={edit}
                            />
                          </td>
                          <td>
                            <strong>
                              <p>Stile Length</p>
                            </strong>
                            <Field
                              name={`${table}.stile_length_${index}`}
                              type="text"
                              component={renderNumber}
                              label="height"
                              validate={[required]}
                              edit={edit}
                            />
                          </td>
                        </tr>
                      </Table>
                    </Col>
                  </Row>

                </div>
              );
            })}
            <Row>
              <Col>
                <Button onClick={() => setStiles(stiles => [...stiles, []])}>
                    Add Stiles
                </Button>
              </Col>
            </Row>

          </div>

          <hr />

          <div style={styles}>

            {rails.map((i, index) => {
              return (
                <div>
                  <Row>
                    <Col>
                      <strong>Rail {index + 1}</strong>
                      <Table>
                        <tr>
                          <td>
                            <strong>
                              <p>Rail Width</p>
                            </strong>
                            <Field
                              name={`${table}.rail_width_${index}`}
                              type="text"
                              component={renderNumber}
                              label="width"
                              validate={[required]}
                              edit={edit}
                            />
                          </td>
                          <td>
                            <strong>
                              <p>Rail Length</p>
                            </strong>
                            <Field
                              name={`${table}.rail_length_${index}`}
                              type="text"
                              component={renderNumber}
                              label="height"
                              validate={[required]}
                              edit={edit}
                            />
                          </td>
                        </tr>
                      </Table>
                    </Col>
                  </Row>

                </div>
              );
            })}
            <Row>
              <Col>
                <Button onClick={() => setRails(rails => [...rails, []])}>
                    Add Rails
                </Button>
              </Col>
            </Row>

          </div>

          <hr />

          <div style={styles}>

            {panels.map((i, index) => {
              return (
                <div>
                  <Row>
                    <Col>
                      <strong>Panel {index + 1}</strong>
                      <Table>
                        <tr>
                          <td>
                            <strong>
                              <p>Panel Width</p>
                            </strong>
                            <Field
                              name={`${table}.panel_width_${index}`}
                              type="text"
                              component={renderNumber}
                              label="width"
                              validate={[required]}
                              edit={edit}
                            />
                          </td>
                          <td>
                            <strong>
                              <p>Panel Height</p>
                            </strong>
                            <Field
                              name={`${table}.panel_height_${index}`}
                              type="text"
                              component={renderNumber}
                              label="height"
                              validate={[required]}
                              edit={edit}
                            />
                          </td>
                        </tr>
                      </Table>
                    </Col>
                  </Row>

                </div>
              );
            })}
            <Row>
              <Col>
                <Button onClick={() => setPanels(panels => [...panels, []])}>
                    Add Panels
                </Button>
              </Col>
            </Row>

          </div>

          <hr />

          {/* <Row>
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
              {parseInt(formState.part_list[i]?.dimensions[index]?.panelsH) >
                1 &&
              parseInt(formState.part_list[i]?.dimensions[index]?.panelsH) <
                3 &&
              parseInt(formState.part_list[i]?.dimensions[index]?.panelsW) ===
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
          </Row> */}

          {/* <Row>
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
          </Row> */}



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
    </div>
  );
};

const mapStateToProps = (state) => ({
  lites: state.part_list.lites,
  formSyncErrors: getFormSyncErrors('Order')(state),
});

export default connect(mapStateToProps, null)(DoorTable);
