import React, { useState, Fragment, useEffect } from "react";
import {
  Label,
  Table,
  Input,
  Row,
  Col,
  Button
} from "reactstrap";

import 'semantic-ui-css/semantic.min.css';
import { Field } from "redux-form";






const GlassTable = ({ table, index, renderField, renderFieldDisabled, required, w, i, h, formState, prices, fields, renderMultiSelect, doorOptions, renderDropdownList }) => {

  return (
    <Table>

      <Field
        name={`${table}.item`}
        type="text"
        component={renderFieldDisabled}
        label="item"
      />

      <thead>
        <tr>
          <th>Qty</th>
          <th>Width</th>
          <th>Height</th>
          <th>Lites</th>
          <th>Price</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Field
              name={`${table}.qty`}
              type="text"
              component={renderField}
              label="qty"
              validate={required}
            />
          </td>
          <td>
            <Field
              name={`${table}.width`}
              type="text"
              component={renderField}
              onBlur={e => w(e, formState.part_list[i].dimensions[index].width, index)}
              label="width"
              validate={required}
            />
          </td>

          <td>
            <Field
              name={`${table}.height`}
              type="text"
              component={renderField}
              onBlur={e => h(e, formState.part_list[i].dimensions[index].height, index)}
              label="height"
              validate={required}
            />
          </td>

          <td>
            <Field
              name={`${table}.lites`}
              component={renderDropdownList}
              data={doorOptions}
              textField="option"
            />
          </td>
          <td>
            {prices[i] ?
              <Input
                type="text"
                className="form-control"
                placeholder={"$" + prices[i][index].toFixed(2) || 0}
              /> : <Input
                type="text"
                className="form-control"
                placeholder={"$0.00"}
              />
            }

          </td>
          <td>
            <Button color="danger" className="btn-circle" onClick={() => fields.remove(index)}>
              X
           </Button>
          </td>
        </tr>

        <tr>
          <td>
            <strong>
              <p>Left Stile</p>
            </strong>
            <Field
              name={`${table}.leftStile`}
              type="text"
              component={renderField}
              label="leftStile"
            />
          </td>
          <td>
            <strong>
              <p>Right Stile</p>
            </strong>
            <Field
              name={`${table}.rightStile`}
              type="text"
              component={renderField}
              label="rightStile"

            />
          </td>
          <td>
            <strong>
              <p>Top Rail</p>
            </strong>
            <Field
              name={`${table}.topRail`}
              type="text"
              component={renderField}
              label="topRail"

            />
          </td>
          <td>
            <strong>
              <p>Bottom Rail</p>
            </strong>
            <Field
              name={`${table}.bottomRail`}
              type="text"
              component={renderField}
              label="bottomRail"
            />
          </td>
        </tr>
        <Row>
          <p className="ml-3">*Finish Stile/Rail Sizes*</p>
        </Row>
        <tr />
      </tbody>

    </Table>
  )
}

export default GlassTable;