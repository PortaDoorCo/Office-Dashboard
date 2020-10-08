import React, { Component, Suspense } from 'react';
import { Field, reduxForm, FieldArray, getFormValues, change, FormSection, } from 'redux-form';
import { renderField, renderDropdownListFilter, renderPrice, renderCheckboxToggle } from '../../../../components/RenderInputs/renderInputs';
import { Button, Table, Row, Col, Input, Label, FormGroup, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


const required = value => (value ? undefined : 'Required');

let Inputs = props => {
  const { fields, misc_items, formState, miscTotal, prices, linePrices, edit } = props;

  const changeMiscItem = (e, index) => {
    props.dispatch(
      change(
        'MiscItems',
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
                <td style={{ width: '90px' }}><Field name={`${table}.qty`} component={renderField} edit={edit} type="text" /></td>
                <td>
                  {formState &&  formState.misc_items && formState.misc_items[index] && formState.misc_items[index].category === 'preselect' ?
                    <Field
                      name={`${table}.item`}
                      component={renderDropdownListFilter}
                      data={misc_items}
                      onChange={(e) => changeMiscItem(e, index)}
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
                        <Field
                          name={`${table}.price`}
                          type="text"
                          component={renderField}
                          label="price"
                          edit={edit}
                        />
                      </InputGroup>
                    </td>
                    <td style={{ width: '150px' }}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <Input disabled={edit} placeholder={linePrices[index]} disabled />
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
                        <Input disabled={edit} placeholder={linePrices[index]} disabled />
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

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      dispatch
    },
    dispatch
  );



export default connect(
  null,
  mapDispatchToProps
)(Inputs);