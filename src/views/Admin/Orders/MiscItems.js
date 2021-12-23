import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import {
  Button, Col, Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText, Label, Row, Table
} from 'reactstrap';
import {
  change, Field, FieldArray,
  getFormValues, reduxForm
} from 'redux-form';
import {
  renderDropdownListFilterNoPhoto, renderField, renderInt
} from '../../../components/RenderInputs/renderInputs';
import {
  miscItemLinePriceSelector, miscItemPriceSelector, miscTotalSelector
} from '../../../selectors/pricing';
import currencyMask from '../../../utils/currencyMask';


let Inputs = (props) => {
  const { fields, misc_items, formState, linePrices, miscTotal, edit, orderType } = props;

  console.log({orderType});

  let misc_items_category = ['Accessories', 'Door', 'DF', 'Drawer_Box'];

  if(orderType === 'Door Order'){
    misc_items_category = ['Accessories', 'Door', 'DF'];
  }

  if(orderType === 'Drawer Order'){
    console.log('here');
    misc_items_category = ['Accessories', 'Drawer_Box'];
  }
  

  let sorted_misc_items = misc_items.filter(e => {
    
    console.log({e});
    return e.categories.some(c => {
      
      console.log({c: misc_items_category.includes(c.value)});
      return misc_items_category.includes(c.value);
    
    }
    );
  });

  console.log({length: sorted_misc_items.length});


  const changeMiscItem = (e, index) => {

    let total_qty = 0;

    props.dispatch(change('Order', `misc_items[${index}].price`, e.Price));

    if(e.count_items){
      const categories = e.categories.map(i => i.value);
      if(categories.includes('Door')){
        const matched_orders = formState.part_list.filter(i => ['Door', 'Glass', 'One_Piece', 'Two_Piece', 'Slab_Door', 'Face_Frame'].includes(i.orderType.value));

        const quantities = matched_orders.map(i => {
          const qty = i.dimensions.map(j => {
            return parseInt(j.qty);
          });
          const sub_total_qty = parseFloat(qty.reduce((acc, item) => acc + item, 0));
          return sub_total_qty;
        });
        const sub_quantity = quantities.reduce((acc, item) => acc + item, 0);
        total_qty = total_qty + sub_quantity;
      }
      if(categories.includes('DF')){
        const matched_orders = formState.part_list.filter(i => ['DF', 'Glass_DF', 'One_Piece_DF', 'Two_Piece_DF', 'Slab_DF'].includes(i.orderType.value));
        
        const quantities = matched_orders.map(i => {
          const qty = i.dimensions.map(j => {
            return parseInt(j.qty);
          });
          const sub_total_qty = parseFloat(qty.reduce((acc, item) => acc + item, 0));
          return sub_total_qty;
        });
        const sub_quantity = quantities.reduce((acc, item) => acc + item, 0);
        total_qty = total_qty+sub_quantity;
      }
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
      props.dispatch(change('Order', `misc_items[${index}].qty`, total_qty > 0 ? total_qty : 1));
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
                        component={renderDropdownListFilterNoPhoto}
                        data={sorted_misc_items}
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
                      <td style={{ width: '25%' }}>
                        <InputGroup>
                          <Field
                            name={`${table}.price`}
                            type="text"
                            component={renderField}
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
                          component={renderField}
                          type="text"
                          required
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
  asyncBlurFields: ['misc_items'] 
})(MiscItems);

export default connect(mapStateToProps, null)(MiscItems);
