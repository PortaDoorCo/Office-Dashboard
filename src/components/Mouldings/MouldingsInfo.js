import React, { Fragment, useState } from 'react';
import { Field, change } from 'redux-form';
import {
  renderNumber,
  renderDropdownList,
  renderInt,
  renderTextField,
  renderPrice,
  renderDropdownListFilter,
  renderMouldingInputs
} from '../RenderInputs/renderInputs';
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
import styles from './styles';
import currencyMask from '../../utils/currencyMask';

import {
  subTotalSelector,
  taxSelector,
  totalSelector,
  mouldingTotalSelector,
  mouldingLineItemSelector,
  mouldingPriceSelector,
  mouldingLinePriceSelector,
} from '../../selectors/pricing';


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
      
      {fields.map((table, index) => {
        return (
          <Fragment key={index}>
            <Table>
              <thead>
                <tr>
                  <th style={{ width: '125px' }}>Total Linear FT</th>
                  <th>Style</th>
                  <th>Grade</th>
                  <th>Woodtype</th>
                  <th>Item</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr key={index}>
                  <td style={{ width: '125px' }}>
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
                  <td style={{ width: '175px' }}>
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
                  <td style={{ width: '175px' }}>
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
                  <td style={{ width: '175px' }}>
                    <Field
                      name={`${table}.woodtype`}
                      component={renderDropdownListFilter}
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
                  <td style={{ width: '200px' }}>
                    <Field
                      name={`${table}.item`}
                      component={renderMouldingInputs}
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

                    <td style={{ width: '125px' }}>
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
              </tbody>
            </Table>
            <Row mb='4'>
              <Col xs="5">
                <strong>Notes</strong>
                <Row>
                  <Col lg="10">
                    <Field
                      name={`${table}.notes`}
                      type="textarea"
                      component={renderTextField}
                      edit={edit}
                      placeholder={'Please specify any required lengths'}
                      label="notes"
                    />
                  </Col>
                
                 
                </Row>
              </Col>
            </Row>
          </Fragment>
        );
      })}


      <Row>
        <Col>
          {!edit ? (
            <>
              <Button
                color="primary"
                className="mt-3"
                onClick={() =>
                  fields.push({
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
  subTotal: subTotalSelector(state),
  total: totalSelector(state),
  tax: taxSelector(state),
  prices: mouldingPriceSelector(state),
  linePrices: mouldingLinePriceSelector(state),
  mouldingTotal: mouldingTotalSelector(state),
  miscLineItemSelector: mouldingLineItemSelector(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      dispatch,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Inputs);