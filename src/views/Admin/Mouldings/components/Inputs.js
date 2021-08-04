import React, { useState } from 'react';
import { Field } from 'redux-form';
import {
  renderNumber,
  renderDropdownList,
  renderInt,
} from '../../../../components/RenderInputs/renderInputs';
import {
  Button,
  Table,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import styles from '../styles';
import currencyMask from '../../../../utils/currencyMask';

const thickness = [
  {
    name: 'Standard Grade',
    db_name: 'STANDARD_GRADE',
    value: 1,
  },
  {
    name: 'Select Grade',
    db_name: 'SELECT_GRADE',
    value: 2,
  },
];

let Inputs = (props) => {
  const { fields, formState, linePrices, edit, part_list } = props;
  const filtered_woodtypes = part_list?.woodtypes.filter(
    (wood) => wood.mouldings === true
  );
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>QTY</th>
            <th>Style</th>
            <th>Grade</th>
            <th>Woodtype</th>
            <th>Item</th>
            <th>Linear FT</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((table, index) => {
            return (
              <tr key={index}>
                <td style={{ width: '90px' }}>
                  <Field
                    name={`${table}.qty`}
                    component={renderInt}
                    edit={edit}
                    type="text"
                  />
                </td>
                <td>
                  <Field
                    name={`${table}.style`}
                    component={renderDropdownList}
                    data={styles}
                    // onChange={(e) => changeMiscItem(e, index)}
                    valueField="value"
                    textField="name"
                    edit={edit}
                    required
                  />
                </td>
                <td>
                  <Field
                    name={`${table}.grade`}
                    component={renderDropdownList}
                    data={thickness}
                    // onChange={(e) => changeMiscItem(e, index)}
                    valueField="value"
                    textField="name"
                    edit={edit}
                    required
                  />
                </td>
                <td>
                  <Field
                    name={`${table}.woodtype`}
                    component={renderDropdownList}
                    data={filtered_woodtypes.filter(
                      (wood) =>
                        wood[formState?.mouldings[index]?.grade?.db_name]
                    )}
                    // onChange={(e) => changeMiscItem(e, index)}
                    valueField="value"
                    textField="NAME"
                    edit={edit}
                    required
                  />
                </td>
                <td style={{ width: '150px' }}>
                  <Field
                    name={`${table}.item`}
                    component={renderDropdownList}
                    data={part_list?.mouldings.filter(
                      (item) =>
                        item.Style === formState?.mouldings[index]?.style?.value
                    )}
                    // onChange={(e) => changeMiscItem(e, index)}
                    valueField="value"
                    textField="NAME"
                    edit={edit}
                    required
                  />
                </td>

                <>
                  <td style={{ width: '150px' }}>
                    <InputGroup>
                      <Field
                        name={`${table}.linearFT`}
                        type="text"
                        component={renderNumber}
                        label="price"
                        edit={edit}
                        required
                      />
                    </InputGroup>
                  </td>
                  <td style={{ width: '150px' }}>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>$</InputGroupText>
                      </InputGroupAddon>
                      <NumberFormat
                        thousandSeparator={true}
                        value={linePrices[index]}
                        disabled={true}
                        customInput={Input}
                        {...currencyMask}
                        prefix={'$'}
                      />
                      {/* <Input  placeholder={linePrices[index]} {...currencyMask} disabled /> */}
                    </InputGroup>
                  </td>
                </>

                {!edit ? (
                  <td>
                    <Button color="danger" onClick={() => fields.remove(index)}>
                      X
                    </Button>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Row>
        <Col>
          {!edit ? (
            <>
              <Button
                color="primary"
                className="mt-3"
                onClick={() =>
                  fields.push({
                    qty: 1,
                    linearFT: '0',
                    price: 0,
                  })
                }
              >
                Add Item{' '}
              </Button>
            </>
          ) : null}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  part_list: state.part_list,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      dispatch,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Inputs);
