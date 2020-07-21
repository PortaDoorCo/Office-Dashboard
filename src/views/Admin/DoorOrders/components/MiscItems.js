import React from 'react';
import { Field, reduxForm, FieldArray } from 'redux-form';
import { renderField } from '../components/RenderInputs/renderInputs';
import { Button, Row, Col, Table, Input } from 'reactstrap';


let Inputs = props => {
  const { fields } = props
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>QTY</th>
            <th>Item</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((table, index) => {
            return (
              <tr key={index}>
                <td><Input /></td>
                <td><Field name={`${table}.item`} component={renderField} type="text" /></td>
                <td><Field name={`${table}.price`} component={renderField} type="text" /></td>
                <td><Button color="danger" onClick={() => fields.remove(index)}>X</Button></td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      <Button color="primary" className="mt-3" onClick={() => fields.push({
        item: '',
        price: 0
      })}>Add Item</Button>
    </div>
  )
}

let MiscItems = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <div>
      <h3>Misc Items</h3>
      <FieldArray name="misc_items" component={Inputs} />
    </div>

  )
}



MiscItems = reduxForm({
  form: 'DoorOrder',
  enableReinitialize: true
})(MiscItems)

export default MiscItems;