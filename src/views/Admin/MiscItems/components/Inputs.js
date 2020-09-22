import React, { Component, Suspense } from 'react';
import { Field, reduxForm, FieldArray, getFormValues, change, FormSection, } from 'redux-form';
import { renderField, renderDropdownListFilter, renderPrice, renderCheckboxToggle } from '../../../../components/RenderInputs/renderInputs';
import { Button, Table, Row, Col, Input, Label, FormGroup, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';


const required = value => (value ? undefined : 'Required');

let Inputs = props => {
  const { fields, misc_items, formState, miscTotal, prices, linePrices, edit } = props;
  console.log(prices);
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
                <td style={{ width: '90px' }}><Field name={`${table}.qty`} component={renderField} edit={edit} type="text" /></td>
                <td>
                  {formState &&  formState.misc_items && formState.misc_items[index] && formState.misc_items[index].category === 'preselect' ?
                    <Field
                      name={`${table}.item`}
                      component={renderDropdownListFilter}
                      data={misc_items}
                      valueField="value"
                      textField="NAME"
                      edit={edit}
                    />  : 
                    <Field
                      name={`${table}.item2`}
                      component={renderField}
                      valueField="value"
                      textField="NAME"
                      edit={edit}
                    />
                  }
                </td>
                {formState &&  formState.misc_items && formState.misc_items[index] && formState.misc_items[index].category === 'preselect' ?
                  <>
                    <td style={{ width: '150px' }}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <Input disabled={edit} placeholder={prices[index]} />
                      </InputGroup>
                    </td>
                    <td style={{ width: '150px' }}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <Input disabled={edit} placeholder={linePrices[index]} />
                      </InputGroup>
                    </td>
                  </>
                  : 
                  <>
                    <td style={{ width: '150px' }}><Field name={`${table}.pricePer`} component={renderPrice} edit={edit} type="text" /></td> 
                    <td style={{ width: '150px' }}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <Input disabled={edit} placeholder={linePrices[index]} />
                      </InputGroup></td> 
                  </> 
                }
                {!edit ?
                  <td><Button color="danger" onClick={() => fields.remove(index)}>X</Button></td> 
                  : null
                }
                
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Row>
        <Col>
          {!edit ?
            <>
              <Button color="primary" className="mt-3" onClick={() => fields.push({
                category: 'preselect',
                qty: 1,
                price: 0
              })}>Add Item </Button>

              <Button color="primary" className="mt-3" onClick={() => fields.push({
                category:'custom',
                qty: 1,
                price: 0
              })}>Custom Item</Button>
            </>
            : null
          }

        </Col>
      </Row>



    </div>
  );
};

export default Inputs;