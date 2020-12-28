import React, { useState, Fragment, useEffect } from 'react';
import {
  Table,
  Input,
  Row,
  Col,
  Button,
  FormGroup,
  Label
} from 'reactstrap';
import 'semantic-ui-css/semantic.min.css';
import { Field, change } from 'redux-form';
import Ratio from 'lb-ratio';
import Maker from '../../../MakerJS/Maker';
import 'react-widgets/dist/css/react-widgets.css';
import { renderField, renderFieldDisabled, renderCheckboxToggle, renderPrice, renderDropdownListFilter } from '../../../../RenderInputs/renderInputs';
import RenderPriceHolder from '../../../../RenderInputs/RenderPriceHolder';
import numQty from 'numeric-quantity';
import { connect } from 'react-redux';

const required = value => (value ? undefined : 'Required');

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

const Miter_Table = ({ fields, formState, i, prices, subTotal, part, updateSubmit, doorOptions, edit, dispatch, lites }) => {

  const [width, setWidth] = useState([]);
  const [height, setHeight] = useState([]);
  const [changeValue, setChangeValue] = useState(null);
  const [leftStileWidth, setLeftStileWidth] = useState(null);
  const [rightStileWidth, setRightStileWidth] = useState(null);
  const [topRailWidth, setTopRailWidth] = useState(null);
  const [bottomRailWidth, setBottomRailWidth] = useState(null);




  useEffect(() => {

    let init = [];
    setWidth(init);
    setHeight(init);

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
        ),
      );

      dispatch(
        change(
          'DoorOrder',
          `part_list[${i}].dimensions[${index}].rightStile`,
          fraction(numQty(changeValue))
        ),
      );

      dispatch(
        change(
          'DoorOrder',
          `part_list[${i}].dimensions[${index}].topRail`,
          fraction(numQty(changeValue))
        ),
      );

      dispatch(
        change(
          'DoorOrder',
          `part_list[${i}].dimensions[${index}].bottomRail`,
          fraction(numQty(changeValue))
        ),
      );
    }

  };


  return (
    formState ?
      <div>
        <Fragment>
          {fields.map((table, index) => (
            <Fragment key={index}>
              <hr />
              <Row>
                <Col>
                  <FormGroup>
                    <Label htmlFor="panel"><strong>Line # {index + 1}</strong></Label>
                    <Field
                      name={`${table}.item`}
                      type="text"
                      component={renderFieldDisabled}
                      label="item"
                      edit={true}
                    />
                  </FormGroup>
                </Col>
                <Col xs='10' />
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
                        component={renderField}
                        label="qty"
                        validate={required}
                        edit={edit}
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
                        edit={edit}
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
                        edit={edit}
                      />
                    </td>

                    <td>
                      {prices[i] ?
                        <Input
                          type="text"
                          className="form-control"
                          disabled={edit}
                          placeholder={'$' + prices[i][index].toFixed(2) || 0}
                        /> :
                        <Input
                          type="text"
                          className="form-control"
                          disabled={edit}
                          placeholder={'$0.00'}
                        />
                      }

                    </td>
                    <td>
                      {!edit ?
                        <Button color="danger" className="btn-circle" onClick={() => fields.remove(index)}>
                          X
                        </Button>
                        : <div />
                      }
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
                        edit={edit}
                        validate={required}
                        onChange={(e) => (registerChange(index, e), setLeftStileWidth(e.target.value))}
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
                        edit={edit}
                        validate={required}
                        onChange={(e) => (registerChange(index, e), setRightStileWidth(e.target.value))}
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
                        edit={edit}
                        validate={required}
                        onChange={(e) => (registerChange(index, e), setTopRailWidth(e.target.value))}
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
                        edit={edit}
                        validate={required}
                        onChange={(e) => (registerChange(index, e), setBottomRailWidth(e.target.value))}
                      />
                    </td>
                  </tr>
                  {!edit ?
                    <tr>
                      <td>
                        <Button onClick={() => changeFraming(index)} color='primary'>Update Framing</Button>
                      </td>
                    </tr> : null
                  }
                  <Row>
                    <p className="ml-3">*Finish Stile/Rail Sizes*</p>
                  </Row>
                  <tr />
                </tbody>

              </Table>





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
                            <p style={{ textAlign: 'center', marginTop: '10px' }}><strong>Panel Opening {index + 1}</strong></p>
                            <Field
                              name={`${table}.unevenSplitInput${index}`}
                              component={renderField}
                              edit={edit}
                            />
                          </Col>
                          <Col />
                        </div>
                      );
                    })}
                  </Row>
                </div>
                : null
              }

              <Row>
                <Col xs='4'>
                  <FormGroup>
                    <Label htmlFor="design">Lites</Label>
                    <Field
                      name={`${table}.lite`}
                      component={renderDropdownListFilter}
                      data={lites}
                      valueField="value"
                      textField="NAME"
                      validate={required}
                      edit={edit}
                    />
                  </FormGroup>
                </Col>
              </Row>

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
                <Col xs='5' />
                <Col xs='3'>
                  <strong>Extra Design Cost</strong>
                  <Field
                    name={`${table}.extraCost`}
                    type="text"
                    component={renderPrice}
                    edit={edit}
                    label="extraCost"
                  />
                </Col>

              </Row>
              <br />
            </Fragment>
          ))}
          <Row>
            <Col>
              {!edit ?
                <Button
                  color="primary"
                  className="btn-circle"
                  onClick={(e) =>
                    (
                      (formState.part_list[i].construction.value === 'M' && formState.part_list[i].miter_df_design) ?
                        fields.push({
                          panelsH: 1,
                          panelsW: 1,
                          leftStile: leftStileWidth ? fraction(numQty(leftStileWidth)) : fraction(
                            formState.part_list[i].miter_df_design.PROFILE_WIDTH
                          ),
                          rightStile: rightStileWidth ? fraction(numQty(rightStileWidth)) : fraction(
                            formState.part_list[i].miter_df_design.PROFILE_WIDTH
                          ),
                          topRail: topRailWidth ? fraction(numQty(topRailWidth)) : fraction(
                            formState.part_list[i].miter_df_design.PROFILE_WIDTH
                          ),
                          bottomRail: bottomRailWidth ? fraction(numQty(bottomRailWidth)) : fraction(
                            formState.part_list[i].miter_df_design.PROFILE_WIDTH
                          ),
                          horizontalMidRailSize: 0,
                          verticalMidRailSize: 0,
                          unevenSplitInput: '0',
                          showBuilder: false,
                          item: fields.length + 1
                        })
                        : alert('please select a design')
                    )}
                >
                  +
                </Button> : <div />
              }

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
      </div> : <div />
  );
};


const mapStateToProps = state => ({
  lites: state.part_list.lites,
});


export default connect(
  mapStateToProps,
  null
)(Miter_Table);

