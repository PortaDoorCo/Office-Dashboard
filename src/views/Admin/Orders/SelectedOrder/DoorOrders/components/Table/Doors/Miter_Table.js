import React, { useState, Fragment, useEffect } from "react";
import {
  Label,
  Table,
  Input,
  Row,
  Col,
  Button
} from "reactstrap";
import 'semantic-ui-css/semantic.min.css';
import { Field } from "redux-form";
import Ratio from "lb-ratio";
import Maker from '../../MakerJS/Maker';
import 'react-widgets/dist/css/react-widgets.css';
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField, renderFieldDisabled, renderCheckboxToggle } from '../../RenderInputs/renderInputs'


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




const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

const Miter_Table = ({ fields, formState, i, prices, subTotal, part, updateSubmit, doorOptions, edit }) => {

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
                      <Field
                        name={`${table}.panelsH`}
                        type="text"
                        component={renderField}
                        label="horizontalMidRail"
                        edit={edit}
                      />
                    </td>
                    <td>
                      <Field
                        name={`${table}.panelsW`}
                        type="text"
                        component={renderField}
                        label="verticalMidRail"
                        edit={edit}
                      />
                    </td>
                    <td>
                      {prices[i] ?
                        <Input
                          type="text"
                          disabled={edit}
                          className="form-control"
                          placeholder={"$" + prices[i][index].toFixed(2) || 0}
                        /> :
                        <Input
                          type="text"
                          disabled={edit}
                          className="form-control"
                          placeholder={"$0.00"}
                        />
                      }

                    </td>
                    <td>
                      {!edit ?
                        <Button color="danger" className="btn-circle" onClick={() => fields.remove(index)}>
                          X
                        </Button>
                        :
                        <div />
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
                        component={renderField}
                        label="verticalMidRail"
                        edit={edit}
                      />
                    </td>
                  </tr>
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
                  {!edit ?
                    (parseInt(formState.part_list[i].dimensions[index].panelsH) > 1 && parseInt(formState.part_list[i].dimensions[index].panelsW) === 1) ? <Field name={`${table}.unevenCheck`} component={renderCheckboxToggle} label="Uneven Split" /> : null
                    :
                    null
                  }
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
                            <p style={{ textAlign: 'center', marginTop: "10px" }}><strong>Panel Opening {index + 1}</strong></p>
                            <Field
                              name={`${table}.unevenSplitInput${index}`}
                              component={renderField}
                              edit={edit}
                            />
                          </Col>
                          <Col />
                        </div>
                      )
                    })}
                  </Row>
                </div>
                : null
              }

              <Row>
                <Col xs="4">
                  <strong>Notes</strong>
                  <Field
                    name={`${table}.notes`}
                    type="textarea"
                    component={renderField}
                    label="notes"
                    edit={edit}
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
                      (formState.part_list[formState.part_list.length - 1].construction.value === "M" && formState.part_list[formState.part_list.length - 1].miter_design) ?
                        fields.push({
                          panelsH: 1,
                          panelsW: 1,
                          leftStile: fraction(
                            formState.part_list[formState.part_list.length - 1].miter_design.PROFILE_WIDTH
                          ),
                          rightStile: fraction(
                            formState.part_list[formState.part_list.length - 1].miter_design.PROFILE_WIDTH
                          ),
                          topRail: fraction(
                            formState.part_list[formState.part_list.length - 1].miter_design.PROFILE_WIDTH
                          ),
                          bottomRail: fraction(
                            formState.part_list[formState.part_list.length - 1].miter_design.PROFILE_WIDTH
                          ),
                          horizontalMidRailSize: 0,
                          verticalMidRailSize: 0,
                          unevenSplitInput: "0",
                          showBuilder: false
                        })
                        : alert('please select a profile')
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
              <strong>Addtional Price: </strong>
              <Field
                edit={edit}
                name={`${part}.addPrice`}
                type="text"
                component={renderField}
                label="addPrice"
              />
              <strong>Sub Total: </strong>
              {subTotal[i] ? (
                <Input disabled={edit} placeholder={subTotal[i].toFixed(2) || 0} />

              ) : (
                  <Input disabled={edit} placeholder="0" />
                )}
            </Col>
          </Row>
        </Fragment>
      </div> : <div />
  )
};

export default Miter_Table;
