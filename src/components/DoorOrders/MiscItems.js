import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import {
  Button,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Table,
} from 'reactstrap';
import {
  change,
  Field,
  FieldArray,
  getFormValues,
  reduxForm,
} from 'redux-form';
import {
  miscItemLinePriceSelector,
  miscItemPriceSelector,
  miscTotalSelector,
} from '../../selectors/pricing';
import currencyMask from '../../utils/currencyMask';
import {
  renderDropdownListNoPhoto,
  renderField,
  renderInt,
} from '../RenderInputs/renderInputs';

let Inputs = (props) => {
  const { fields, misc_items, formState, linePrices, miscTotal } = props;

  let misc_items_category = ['Accessories', 'Door', 'DF'];

  let sorted_misc_items = misc_items.filter((e) =>
    e.categories.some((c) => misc_items_category.includes(c.value))
  );

  const changeMiscItem = (e, index) => {
    let total_qty = 0;

    props.dispatch(change('Order', `misc_items[${index}].price`, e.Price));

    if (e.count_items) {
      const categories = e.categories.map((i) => i.value);
      if (categories.includes('Door')) {
        const matched_orders = formState.part_list?.filter((i) =>
          [
            'Door',
            'Glass',
            'One_Piece',
            'Two_Piece',
            'Slab_Door',
            'Face_Frame',
          ].includes(i?.orderType?.value)
        );

        const quantities = matched_orders.map((i) => {
          const qty = i.dimensions.map((j) => {
            return parseInt(j.qty);
          });
          const sub_total_qty = parseFloat(
            qty.reduce((acc, item) => acc + item, 0)
          );
          return sub_total_qty;
        });
        const sub_quantity = quantities.reduce((acc, item) => acc + item, 0);
        total_qty = total_qty + sub_quantity;
      }
      if (categories.includes('DF')) {
        const matched_orders = formState.part_list?.filter((i) =>
          [
            'DF',
            'Glass_DF',
            'One_Piece_DF',
            'Two_Piece_DF',
            'Slab_DF',
          ].includes(i?.orderType?.value)
        );

        const quantities = matched_orders.map((i) => {
          const qty = i.dimensions.map((j) => {
            return parseInt(j.qty);
          });
          const sub_total_qty = parseFloat(
            qty.reduce((acc, item) => acc + item, 0)
          );
          return sub_total_qty;
        });
        const sub_quantity = quantities.reduce((acc, item) => acc + item, 0);
        total_qty = total_qty + sub_quantity;
      }
      props.dispatch(
        change(
          'Order',
          `misc_items[${index}].qty`,
          total_qty > 0 ? total_qty : 1
        )
      );
    }
  };

  return (
    <div className="resize">
      <Table>
        <thead>
          <tr>
            <th>QTY</th>
            <th>Item</th>
            <th>Price Per</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((table, index) => {
            return (
              <tr key={index}>
                <td style={{ width: '10%' }}>
                  <Field
                    name={`${table}.qty`}
                    component={renderInt}
                    type="text"
                  />
                </td>
                <td style={{ width: '40%' }}>
                  {formState &&
                  formState.misc_items &&
                  formState.misc_items[index] &&
                  formState.misc_items[index].category === 'preselect' ? (
                    <Field
                      name={`${table}.item`}
                      component={renderDropdownListNoPhoto}
                      data={sorted_misc_items}
                      onChange={(e) => changeMiscItem(e, index)}
                      dataKey="value"
                      textField="NAME"
                    />
                  ) : (
                    <Field
                      name={`${table}.item2`}
                      component={renderField}
                      dataKey="value"
                      textField="NAME"
                    />
                  )}
                </td>
                {formState &&
                formState.misc_items &&
                formState.misc_items[index] &&
                formState.misc_items[index].category === 'preselect' ? (
                  <>
                    <td style={{ width: '25%' }}>
                      <InputGroup>
                        <Field
                          name={`${table}.price`}
                          type="text"
                          component={renderField}
                          label="price"
                          {...currencyMask}
                        />
                      </InputGroup>
                    </td>
                    <td style={{ width: '25%' }}>
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
                ) : (
                  <>
                    <td style={{ width: '25%' }}>
                      <Field
                        name={`${table}.pricePer`}
                        component={renderField}
                        type="text"
                        required
                        {...currencyMask}
                      />
                    </td>
                    <td style={{ width: '25%' }}>
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
                <td>
                  <Button color="danger" onClick={() => fields.remove(index)}>
                    X
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Row>
        <Col>
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
                  pricePer: 0,
                })
              }
            >
              Custom Item
            </Button>
          </>
        </Col>
        <Col />
        <Col>
          <Label htmlFor="companyName">Added to Total</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>$</InputGroupText>
            </InputGroupAddon>
            <NumberFormat
              thousandSeparator={true}
              value={miscTotal}
              disabled={true}
              customInput={Input}
              {...currencyMask}
              prefix={'$'}
            />
          </InputGroup>
        </Col>
      </Row>
    </div>
  );
};

class MiscItems extends Component {
  render() {
    return (
      <div>
        <h3>Misc Items</h3>
        <FieldArray name="misc_items" component={Inputs} {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  formState: getFormValues('Order')(state),
  misc_items: state.misc_items.misc_items,
  prices: miscItemPriceSelector(state),
  linePrices: miscItemLinePriceSelector(state),
  miscTotal: miscTotalSelector(state),
});

MiscItems = reduxForm({
  form: 'Order',
  enableReinitialize: true,
  destroyOnUnmount: false,
})(MiscItems);

export default connect(mapStateToProps, null)(MiscItems);
