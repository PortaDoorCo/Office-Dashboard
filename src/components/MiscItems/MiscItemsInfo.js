import React from 'react';
import { Field, change } from 'redux-form';
import {
  renderField,
  renderNumber,
  renderDropdownListFilter,
  renderDropdownListNoPhoto,
  renderPrice,
  renderInt
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
import currencyMask from '../../utils/currencyMask';
import {
  subTotalSelector,
  taxSelector,
  totalSelector,
  miscTotalSelector,
  miscLineItemSelector,
  miscItemPriceSelector,
  miscItemLinePriceSelector,
} from '../../selectors/pricing';



let Inputs = (props) => {
  const { fields, misc_items, formState, linePrices, edit } = props;

  const changeMiscItem = (e, index) => {
    props.dispatch(change('Order', `misc_items[${index}].price`, e.Price));
  };
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th style={{ width: '90px' }}>QTY</th>
            <th>Item</th>
            <th style={{ width: '150px' }}>Price Per</th>
            <th style={{ width: '150px' }}>Price</th>
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
                  {formState &&
                  formState.misc_items &&
                  formState.misc_items[index] &&
                  formState.misc_items[index].category === 'preselect' ? (
                      <Field
                        name={`${table}.item`}
                        component={renderDropdownListNoPhoto}
                        data={misc_items}
                        onChange={(e) => changeMiscItem(e, index)}
                        dataKey="value"
                        textField="NAME"
                        edit={edit}
                      />
                    ) : (
                      <Field
                        name={`${table}.item2`}
                        component={renderField}
                        dataKey="value"
                        textField="NAME"
                        edit={edit}
                      />
                    )}
                </td>
                {formState &&
                formState.misc_items &&
                formState.misc_items[index] &&
                formState.misc_items[index].category === 'preselect' ? (
                    <>
                      <td style={{ width: '150px' }}>
                        <InputGroup>
                          <Field
                            name={`${table}.price`}
                            type="text"
                            component={renderField}
                            label="price"
                            edit={edit}
                            {...currencyMask}
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
                  ) : (
                    <>
                      <td style={{ width: '150px' }}>
                        <Field
                          name={`${table}.pricePer`}
                          component={renderField}
                          edit={edit}
                          type="text"
                          {...currencyMask}
                        />
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
                        </InputGroup>
                      </td>
                    </>
                  )}
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
                    category: 'preselect',
                    qty: 1,
                    price: 0,
                  })
                }
              >
                Add Item{' '}
              </Button>

              <Button
                color="primary"
                className="mt-3"
                onClick={() =>
                  fields.push({
                    category: 'custom',
                    qty: 1,
                    price: 0,
                  })
                }
              >
                Custom Item
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
  misc_items: state.misc_items.misc_items,
  subTotal: subTotalSelector(state),
  total: totalSelector(state),
  tax: taxSelector(state),
  prices: miscItemPriceSelector(state),
  linePrices: miscItemLinePriceSelector(state),
  miscTotal: miscTotalSelector(state),
  miscLineItemSelector: miscLineItemSelector(state),
});
  
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      dispatch,
    },
    dispatch
  );
  
export default connect(mapStateToProps, mapDispatchToProps)(Inputs);
  
