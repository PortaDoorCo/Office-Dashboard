import React, { Component, Fragment, useState } from 'react';
import { Table, Input, Row, Col, Button, FormGroup, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { Field, change, touch, startAsyncValidation, getFormSyncErrors } from 'redux-form';
import {
  renderDropdownList,
  renderNumber,
  renderField,
  renderPrice,
  renderInt,
  renderTextField
} from '../RenderInputs/renderInputs';
import RenderPriceHolder from '../RenderInputs/RenderPriceHolder';
import currencyMask from '../../utils/currencyMask';
import numQty from 'numeric-quantity';
import { NotificationManager } from 'react-notifications';


const required = (value) => (value ? undefined : 'Required');

const height_limit = value => numQty(value) < 2.125 ? 'Height is too small' : numQty(value) > 33 ? 'Height is too big' : value ? undefined : 'Required';




const OrderTable = ({       
  fields,
  scoop,
  dividers,
  prices,
  i,
  subTotal,
  formState,
  edit,
  dispatch,
  formSyncErrors 
}) => {

  const [standardSize, setStandardSize] = useState(true);

  const clearNotes = (index, e) => {
    dispatch(
      change(
        'Order',
        `part_list[${i}].dimensions[${index}].notes`,
        ''
      )
    );
  };

  const checkSize = (e, index) => {

    switch(numQty(e.target.value)) {
      case 9:
        // code block
        break;
      case 12:
        // code block
        break;
      case 15:
        // code block
        break;
      case 18:
        // code block
        break;
      case 21:
        // code block
        break;
      case 24:
        // code block
        break;
      case 27:
        // code block
        break;
      case 30:
        // code block
        break;
      default:
        // code block
        setStandardSize(false);
        dispatch(
          change(
            'Order',
            `part_list[${i}].dimensions[${index}].notes`,
            'CANNOT WORK WITH UNDER MOUNT'
          )
        );
    }
  };



  const checkScoop = (index, e) => {
    // const value = e.target.value;
    
    const str = 'WITH SCOOP';

    
    switch(numQty(formState.part_list[i]?.dimensions[index]?.depth)) {
      case 9:
        // code block
        break;
      case 12:
        // code block
        break;
      case 15:
        // code block
        break;
      case 18:
        // code block
        break;
      case 21:
        // code block
        break;
      case 24:
        // code block
        break;
      case 27:
        // code block
        break;
      case 30:
        // code block
        break;
      default:
        // code block
        setStandardSize(false);
        if(e.NAME === 'Yes'){
          if(!standardSize){
            dispatch(
              change(
                'Order',
                `part_list[${i}].dimensions[${index}].notes`,
                'CANNOT WORK WITH UNDER MOUNT \nWITH SCOOP'
              )
            );
          } else {
            dispatch(
              change(
                'Order',
                `part_list[${i}].dimensions[${index}].notes`,
                'WITH SCOOP'
              )
            );
          }
  
        } else {
          dispatch(
            change(
              'Order',
              `part_list[${i}].dimensions[${index}].notes`,
              str.replace(str, '')
            )
          );
        }
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
                  <th>Depth</th>
                  <th>Height</th>
                  <th>Scoop</th>
                  <th>Divider</th>
                  <th>Cab #</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: '7%' }}>
                    <Field
                      name={`${table}.qty`}
                      type="text"
                      component={renderInt}
                      label="qty"
                      validate={required}
                      edit={edit}
                    />
                  </td>
                  <td style={{ width: '14%' }}>
                    <Field
                      name={`${table}.width`}
                      type="text"
                      component={renderNumber}
                      label="width"
                      validate={required}
                      edit={edit}
                    />
                  </td>
                  <td style={{ width: '14%' }}>
                    <Field
                      name={`${table}.depth`}
                      type="text"
                      component={renderNumber}
                      label="depth"
                      validate={required}
                      edit={edit}
                      onBlur={(e) => checkSize(e, index)}
                    />
                  </td>
                  <td style={{ width: '14%' }}>
                    <Field
                      name={`${table}.height`}
                      type="text"
                      component={renderNumber}
                      label="height"
                      validate={height_limit}
                      edit={edit}
                    />
                  </td>
                  <td style={{ width: '14%' }}>
                    <Field
                      name={`${table}.scoop`}
                      component={renderDropdownList}
                      data={scoop}
                      dataKey="Value"
                      textField="NAME"
                      validate={required}
                      edit={edit}
                      onChange={(e) => checkScoop(index, e)}
                    />
                  </td>
                  <td style={{ width: '14%' }}>
                    <Field
                      name={`${table}.dividers`}
                      component={renderDropdownList}
                      data={dividers}
                      dataKey="Value"
                      textField="Name"
                      validate={required}
                      edit={edit}
                    />
                  </td>
                  <td style={{ width: '10%' }}>
                    <Field
                      name={`${table}.cab_number`}
                      component={renderField}
                      edit={edit}
                    />
                  </td>
                  <td style={{ width: '14%' }}>
                    {prices[i] ? (
                      <Input
                        type="text"
                        className="form-control"
                        disabled={true}
                        placeholder={
                          '$' + prices[i][index]?.toFixed(2) ? prices[i][index]?.toFixed(2) : 0
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

                <tr></tr>
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
              <Col lg='4' />
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
        {!edit ? (
          <Button
            color="primary"
            className="btn-circle"
            onClick={() =>
            {

              const index = fields.length - 1;

              if(fields.length > 0){
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
                dispatch(
                  touch(
                    'Order',
                    `part_list[${i}].dimensions[${index}].depth`
                  )
                );
              }

              dispatch(
                touch(
                  'Order',
                  `part_list[${i}].woodtype`
                )
              );

              dispatch(
                touch(
                  'Order',
                  `part_list[${i}].box_thickness`
                )
              );

              dispatch(
                touch(
                  'Order',
                  `part_list[${i}].box_bottom_woodtype`
                )
              );

              dispatch(
                touch(
                  'Order',
                  `part_list[${i}].box_bottom_thickness`
                )
              );

              dispatch(
                touch(
                  'Order',
                  `part_list[${i}].box_notch`
                )
              );

              dispatch(
                touch(
                  'Order',
                  `part_list[${i}].box_finish`
                )
              );



              dispatch(
                startAsyncValidation('Order')
              );

           

              fields.push({
                qty: 1,
                scoop: scoop[1],
                dividers: dividers[0],
                // depth: index >= 0 ? formState.part_list[i]?.dimensions[index]?.depth : null,
                // height: index >= 0 ? formState.part_list[i]?.dimensions[index]?.height : null
              });

                
            }

            }
          >
              +
          </Button>
        ) : (
          <div />
        )}

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
  formSyncErrors: getFormSyncErrors('Order')(state),
});

export default connect(mapStateToProps, null)(OrderTable);
