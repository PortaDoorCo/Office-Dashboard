import React, { Component, Fragment } from 'react';
import { Table, Input, Row, Col, Button, FormGroup, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { Field, change, touch, startAsyncValidation, getFormSyncErrors } from 'redux-form';
import {
  renderDropdownList,
  renderNumber,
  renderField,
  renderPrice,
  renderInt
} from '../RenderInputs/renderInputs';
import RenderPriceHolder from '../RenderInputs/RenderPriceHolder';
import currencyMask from '../../utils/currencyMask';
import numQty from 'numeric-quantity';
import { NotificationManager } from 'react-notifications';


const required = (value) => (value ? undefined : 'Required');

const height_limit = value => numQty(value) < 2.125 ? 'Height is too small' : numQty(value) > 33 ? 'Height is too big' : value ? undefined : 'Required';



class OrderTable extends Component {


  render() {
    const {
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
    } = this.props;




    const clearNotes = (index, e) => {
      dispatch(
        change(
          'DrawerOrder',
          `part_list[${i}].dimensions[${index}].notes`,
          ''
        )
      );
    };



    const checkScoop = (index, e) => {
      // const value = e.target.value;
      console.log({ e });
      const str = 'WITH SCOOP';

      if(e.NAME === 'Yes'){
        dispatch(
          change(
            'DrawerOrder',
            `part_list[${i}].dimensions[${index}].notes`,
            'WITH SCOOP'
          )
        );
      } else {
        dispatch(
          change(
            'DrawerOrder',
            `part_list[${i}].dimensions[${index}].notes`,
            str.replace(str, '')
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
                        valueField="Value"
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
                        valueField="Value"
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
                          placeholder={'$' + prices[i][index].toFixed(2) || 0}
                        />
                      ) : (
                        <Input
                          type="text"
                          className="form-control"
                          placeholder={'$0.00'}
                          disabled={true}
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
                      'DrawerOrder',
                      `part_list[${i}].dimensions[${index}].notes`
                    )
                  );
                  dispatch(
                    touch(
                      'DrawerOrder',
                      `part_list[${i}].dimensions[${index}].width`
                    )
                  );
                  dispatch(
                    touch(
                      'DrawerOrder',
                      `part_list[${i}].dimensions[${index}].height`
                    )
                  );
                  dispatch(
                    touch(
                      'DrawerOrder',
                      `part_list[${i}].dimensions[${index}].depth`
                    )
                  );
                }

                dispatch(
                  touch(
                    'DrawerOrder',
                    `part_list[${i}].woodtype`
                  )
                );

                dispatch(
                  touch(
                    'DrawerOrder',
                    `part_list[${i}].box_thickness`
                  )
                );

                dispatch(
                  touch(
                    'DrawerOrder',
                    `part_list[${i}].box_bottom_woodtype`
                  )
                );

                dispatch(
                  touch(
                    'DrawerOrder',
                    `part_list[${i}].box_bottom_thickness`
                  )
                );

                dispatch(
                  touch(
                    'DrawerOrder',
                    `part_list[${i}].box_notch`
                  )
                );

                dispatch(
                  touch(
                    'DrawerOrder',
                    `part_list[${i}].box_finish`
                  )
                );



                dispatch(
                  startAsyncValidation('DrawerOrder')
                );

                if(formSyncErrors && !formSyncErrors?.part_list[i]?.dimensions){
                  NotificationManager.error(
                    'You are missing required info',
                    'Missing Items',
                    3000
                  );
                } else {

                  fields.push({
                    qty: 1,
                    scoop: scoop[1],
                    dividers: dividers[0],
                  });

                }
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
  }
};

const mapStateToProps = (state) => ({
  lites: state.part_list.lites,
  formSyncErrors: getFormSyncErrors('DrawerOrder')(state),
});

export default connect(mapStateToProps, null)(OrderTable);
