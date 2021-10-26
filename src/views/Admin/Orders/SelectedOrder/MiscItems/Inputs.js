import React from 'react';
import {
  Field,
  change,
} from 'redux-form';
import {
  renderField,
  renderDropdownListFilter,
  renderPrice,
  renderInt
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

const required = (value) => (value ? undefined : 'Required');

let Inputs = (props) => {
  const {
    fields,
    misc_items,
    formState,
    prices,
    linePrices,
  } = props;

  const changeMiscItem = (e, index) => {
    props.dispatch(change(`misc_items[${index}].price`, e.Price));
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
                <td style={{ width: '90px' }}>
                  <Field
                    name={`${table}.qty`}
                    component={renderInt}
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
                        component={renderDropdownListFilter}
                        data={misc_items}
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
                      <td style={{ width: '150px' }}>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>$</InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder={prices[index]} />
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
                  ) : (
                    <>
                      <td style={{ width: '150px' }}>
                        <Field
                          name={`${table}.pricePer`}
                          component={renderPrice}
                          type="text"
                        />
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
                })
              }
            >
              Custom Item
            </Button>
          </>
        </Col>
      </Row>
    </div>
  );
};

export default Inputs;
