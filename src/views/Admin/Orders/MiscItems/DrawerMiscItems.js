import React, { Component } from 'react';
import {
  Field,
  reduxForm,
  FieldArray,
  getFormValues,
  change,
} from 'redux-form';
import {
  renderField,
  renderNumber,
  renderDropdownListFilter,
  renderPrice,
  renderInt
} from '../../../../components/RenderInputs/renderInputs';
import {
  Button,
  Table,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Col,
  Label,
} from 'reactstrap';
import { connect } from 'react-redux';
import {
  miscItemPriceSelector,
  miscItemLinePriceSelector,
  miscTotalSelector,
} from '../../../../selectors/drawerPricing';
import NumberFormat from 'react-number-format';
import currencyMask from '../../../../utils/currencyMask';

let Inputs = (props) => {
  const {
    fields,
    misc_items,
    formState,
    linePrices,
    miscTotal,
    edit
  } = props;

  let misc_items_category = ['Accessories', 'Drawer_Box'];

  let sorted_misc_items = misc_items.filter(e => e.categories.some(c => misc_items_category.includes(c.value)));

  const changeMiscItem = (e, index) => {

    let total_qty = 0;

    props.dispatch(change('DrawerOrder', `misc_items[${index}].price`, e.Price));

    if(e.count_items){
      const categories = e.categories.map(i => i.value);
      if(categories.includes('Drawer_Box')){
        const quantities = formState && formState.part_list.map(i => {
          const qty = i.dimensions.map(j => {
            return parseInt(j.qty);
          });
          const sub_total_qty = parseFloat(qty.reduce((acc, item) => acc + item, 0));
          return sub_total_qty;
        });
        const sub_quantity = quantities.reduce((acc, item) => acc + item, 0);
        total_qty = total_qty+sub_quantity;
      }
      props.dispatch(change('DrawerOrder', `misc_items[${index}].qty`, total_qty));
    }
  };

  return (
    <div>
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
                    edit={edit}
                  />
                </td>
                <td style={{ width: '40%' }}>
                  {formState &&
                  formState.misc_items &&
                  formState.misc_items[index] &&
                  formState.misc_items[index].category === 'preselect' ? (
                      <Field
                        name={`${table}.item`}
                        component={renderDropdownListFilter}
                        data={sorted_misc_items}
                        onChange={(e) => changeMiscItem(e, index)}
                        valueField="value"
                        textField="NAME"
                        edit={edit}
                      />
                    ) : (
                      <Field
                        name={`${table}.item2`}
                        component={renderField}
                        valueField="value"
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
                      <td style={{ width: '25%' }}>
                        <InputGroup>
                          <Field
                            name={`${table}.price`}
                            type="text"
                            component={renderPrice}
                            label="price"
                            {...currencyMask}
                            edit={edit}
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
                          component={renderPrice}
                          type="text"
                          {...currencyMask}
                          edit={edit}
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
                  {!edit ? 
                    <Button color="danger" onClick={() => fields.remove(index)}>
                    X
                    </Button>
                    : null }
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Row>
        <Col>
          {!edit ? 
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
            : null }
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
    const { misc_items, formState, prices, linePrices, miscTotal } = this.props;

    return (
      <div>
        <h3>Misc Items</h3>
        <FieldArray name="misc_items" component={Inputs} {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  formState: getFormValues('DrawerOrder')(state),
  misc_items: state.misc_items.misc_items,
  prices: miscItemPriceSelector(state),
  linePrices: miscItemLinePriceSelector(state),
  miscTotal: miscTotalSelector(state),
});

MiscItems = reduxForm({
  form: 'DrawerOrder',
  enableReinitialize: true,
})(MiscItems);

export default connect(mapStateToProps, null)(MiscItems);
