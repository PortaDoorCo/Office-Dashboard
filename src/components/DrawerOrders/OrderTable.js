import React, { Component, Fragment } from 'react';
import { Table, Input, Row, Col, Button, FormGroup, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, change } from 'redux-form';
import {
  renderDropdownList,
  renderNumber,
  renderField,
  renderFieldDisabled,
  renderPrice,
  renderInt
} from '../RenderInputs/renderInputs';
import RenderPriceHolder from '../RenderInputs/RenderPriceHolder';
import { createNumberMask } from 'redux-form-input-masks';

const required = (value) => (value ? undefined : 'Required');

const currencyMask = createNumberMask({
  decimalPlaces: 2,
  locale: 'en-US',
});

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
      dispatch
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
                        validate={required}
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
                  <Row>
                    <Col lg='11'>
                      <Field
                        name={`${table}.notes`}
                        type="textarea"
                        component={renderField}
                        edit={edit}
                        label="notes"
                      />
                    </Col>
                    <Col lg='1'>
                      {!edit ?
                        <Button color='danger' className="btn-circle" onClick={(e) => clearNotes(index, e)}>X</Button>
                        : null }
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
          {!edit ? (
            <Button
              color="primary"
              className="btn-circle"
              onClick={() =>
                fields.push({
                  qty: 1,
                  scoop: scoop[1],
                  dividers: dividers[0],
                  item: fields.length + 1,
                })
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
}

export default connect()(OrderTable);
