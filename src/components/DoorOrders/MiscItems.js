import React, { Component, useState, useEffect } from 'react';
import { Field, reduxForm, FieldArray, getFormValues, change } from 'redux-form';
import { renderField, renderDropdownListFilter, renderPrice } from '../RenderInputs/renderInputs';
import { Button, Table, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Col, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { miscItemPriceSelector, miscItemLinePriceSelector, miscTotalSelector } from '../../selectors/doorPricing';


let Inputs = props => {
  const { fields, misc_items, formState, prices, linePrices, miscTotal, onChange } = props;
  console.log(linePrices);


  const changeMiscItem = (e, index) => {

    console.log('eeeeeeeeee', e);
    console.log('indexxxxxxx', index)

    props.dispatch(
      change(
        'DoorOrder',
        `misc_items[${index}].price`,
        (e.Price)
      )
    );
  }



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
                <td style={{ width: '90px' }}><Field name={`${table}.qty`} component={renderField} type="text" /></td>
                <td>
                  {formState && formState.misc_items && formState.misc_items[index] && formState.misc_items[index].category === 'preselect' ?
                    <Field
                      name={`${table}.item`}
                      component={renderDropdownListFilter}
                      data={misc_items}
                      onChange={(e) => changeMiscItem(e, index)}
                      valueField="value"
                      textField="NAME"
                    /> :
                    <Field
                      name={`${table}.item2`}
                      component={renderField}
                      valueField="value"
                      textField="NAME"
                    />
                  }
                </td>
                {formState && formState.misc_items && formState.misc_items[index] && formState.misc_items[index].category === 'preselect' ?
                  <>
                    <td style={{ width: '150px' }}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <Field
                          name={`${table}.price`}
                          type="text"
                          component={renderField}
                          label="price"

                        />
                      </InputGroup>
                    </td>
                    <td style={{ width: '150px' }}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder={linePrices[index]} />
                      </InputGroup>
                    </td>
                  </>
                  :
                  <>
                    <td style={{ width: '150px' }}><Field name={`${table}.pricePer`} component={renderPrice} type="text" /></td>
                    <td style={{ width: '150px' }}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder={linePrices[index]} />
                      </InputGroup></td>
                  </>
                }
                <td><Button color="danger" onClick={() => fields.remove(index)}>X</Button></td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Row>
        <Col>
          <>
            <Button color="primary" className="mt-3" onClick={() => fields.push({
              category: 'preselect',
              qty: 1,
              price: 0
            })}>Add Item </Button>

            <Button color="primary" className="mt-3" onClick={() => fields.push({
              category: 'custom',
              qty: 1,
              price: 0
            })}>Custom Item</Button>
          </>
        </Col>
        <Col />
        <Col>
          <Label htmlFor="companyName">Added to Total</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>$</InputGroupText>
            </InputGroupAddon>
            <Input placeholder={miscTotal} />
          </InputGroup>
        </Col>
      </Row>



    </div>
  );
};

class MiscItems extends Component {

  // componentDidUpdate(prevProps) {
  //   const { formState } = this.props;
  //   if (formState && formState.misc_items) {
  //     if (formState.misc_items !== prevProps.formState.misc_items) {

  //       const misc_items = formState.misc_items;

  //       misc_items.forEach((i, index) => {
  //         if (i.item) {

  //           if (i.item.Price !== 0) {
  //             this.props.dispatch(
  //               change(
  //                 'DoorOrder',
  //                 `misc_items[${index}].price`,
  //                 (i.item.Price)
  //               )
  //             );
  //           } else {
  //             return;
  //           }

  //         }

  //       });

  //     }
  //   }
  // }

  render() {
    const { misc_items, formState, prices, linePrices, miscTotal } = this.props;
    console.log('prices', prices);
    return (
      <div>
        <h3>Misc Items</h3>
        <FieldArray name="misc_items" component={Inputs} {...this.props} />
      </div>
    );
  }
}



const mapStateToProps = state => ({
  formState: getFormValues('DoorOrder')(state),
  misc_items: state.misc_items.misc_items,
  prices: miscItemPriceSelector(state),
  linePrices: miscItemLinePriceSelector(state),
  miscTotal: miscTotalSelector(state)
});

MiscItems = reduxForm({
  form: 'DoorOrder',
  enableReinitialize: true
})(MiscItems);


export default connect(
  mapStateToProps,
  null
)(MiscItems);