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






const PanelsTable = ({ dimension, index, renderField, renderFieldDisabled, required, w, i, h, formState, prices, fields }) => {

    return (
        <Table>
        <thead>
          <tr>
            <th>Qty</th>
            <th>Width</th>
            <th>Height</th>
            <th>Panel High</th>
            <th>Panels Wide</th>
            <th>Price</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Field
                name={`${dimension}.qty`}
                type="text"
                component={renderField}
                label="qty"
              />
            </td>
            <td>
              <Field
                name={`${dimension}.width`}
                type="text"
                onBlur
                component={renderField}
                label="width"
              />
            </td>
            <td>
              <Field
                name={`${dimension}.height`}
                type="text"
                onBlur
                component={renderField}
                label="height"
              />
            </td>

            <td>
              <Field
                name={`${dimension}.panelsH`}
                type="text"
                component={renderField}
                label="horizontalMidRail"
              />
            </td>
            <td>
              <Field
                name={`${dimension}.panelsW`}
                type="text"
                component={renderField}
                label="verticalMidRail"
              />
            </td>
            <td>
              {prices[i] ? (
                <Input
                  type="text"
                  className="form-control"
                  name="linePrice"
                  disabled
                  placeholder={"$" + prices[i][index].toFixed(2) || 0}
                />
              ) : null}
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
                name={`${dimension}.leftStile`}
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
                name={`${dimension}.rightStile`}
                type="text"
                component={renderField}
                label="rightStile"
                value="2 3/4"
              />
            </td>
            <td>
              <strong>
                <p>Top Rail</p>
              </strong>
              <Field
                name={`${dimension}.topRail`}
                type="text"
                component={renderField}
                label="topRail"
                value="2 3/4"
              />
            </td>
            <td>
              <strong>
                <p>Bottom Rail</p>
              </strong>
              <Field
                name={`${dimension}.bottomRail`}
                type="text"
                component={renderField}
                label="bottomRail"
                value="2 3/4"
              />
            </td>
            <td>
              <strong>
                <p>Hori. Mid Rail</p>
              </strong>
              <Field
                name={`${dimension}.horizontalMidRailSize`}
                type="text"
                component={renderField}
                label="horizontalMidRail"
                value="2 3/4"
              />
            </td>
            <td>
              <strong>
                <p>Vert. Mid Rail</p>
              </strong>
              <Field
                name={`${dimension}.verticalMidRailSize`}
                type="text"
                component={renderField}
                label="verticalMidRail"
                value="2 3/4"
              />
            </td>
          </tr>
          <tr />
        </tbody>
      </Table>
    )
}

export default PanelsTable;