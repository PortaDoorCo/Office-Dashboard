import React, {useState} from 'react';
import { Field, change, } from 'redux-form';
import { renderField, renderNumber, renderDropdownList, renderDropdownListFilter, renderPrice } from '../../../../../components/RenderInputs/renderInputs';
import { Button, Table, Row, Col, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createNumberMask } from 'redux-form-input-masks';
import NumberFormat from 'react-number-format';
import styles from './styles';

const currencyMask = createNumberMask({
  decimalPlaces: 2,
  locale: 'en-US',
});

const thickness = [
  {
    NAME: '4/4',
    value: 0.75
  },
  {
    NAME: '5/4',
    value: 1
  },
];

let Inputs = props => {
  const { fields, formState, linePrices, edit, part_list } = props;
  const [data, setData] = useState([]);

  const changeMiscItem = (e, index) => {

    console.log({e});

    console.log(eval(`part_list.${e.value}`));

    setData(eval(`part_list.${e.value}`));
  };


  console.log({data});
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>QTY</th>
            <th>Style</th>
            <th>Woodtype</th>
            {/* <th>Thickness</th> */}
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
                <td style={{ width: '90px' }}><Field name={`${table}.qty`} component={renderNumber} edit={edit} type="text" /></td>
                <td>

                  <Field
                    name={`${table}.style`}
                    component={renderDropdownList}
                    data={styles}
                    onChange={(e) => changeMiscItem(e, index)}
                    valueField="value"
                    textField="name"
                    edit={edit}
                    required
                  />  
                </td>
                <td>
                  <Field
                    name={`${table}.moulding_material`}
                    component={renderDropdownList}
                    data={part_list.moulding_material}
                    // onChange={(e) => changeMiscItem(e, index)}
                    valueField="value"
                    textField="NAME"
                    edit={edit}
                    required
                  />  
                </td>
                {/* <td>
                  <Field
                    name={`${table}.thickness`}
                    component={renderDropdownList}
                    data={thickness}
                    // onChange={(e) => changeMiscItem(e, index)}
                    valueField="value"
                    textField="NAME"
                    edit={edit}
                    required
                  />  
                </td> */}
                <td>
                  <Field
                    name={`${table}.item`}
                    component={renderDropdownList}
                    data={data}
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
                      <NumberFormat thousandSeparator={true} value={linePrices[index]} disabled={true} customInput={Input} {...currencyMask} prefix={'$'} />
                      {/* <Input  placeholder={linePrices[index]} {...currencyMask} disabled /> */}
                    </InputGroup>
                  </td>
                </>
                 
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
                qty: 1,
                linearFT: '0',
                price: 0
              })}>Add Item </Button>
            </>
            : null
          }

        </Col>
      </Row>



    </div>
  );
};

const mapStateToProps = state => ({
  part_list: state.part_list
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      dispatch
    },
    dispatch
  );



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Inputs);