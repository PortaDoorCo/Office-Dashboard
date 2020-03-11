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






const PanelsTable = ({ info, order, index, i }) => {

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
              <Input
                placeholder={info.qty}
                disabled
              />
            </td>
            <td>
              <Input
                placeholder={info.width}
                disabled
              />
            </td>
            <td>
              <Input
                placeholder={info.height}
                disabled
              />
            </td>

            <td>
              <Input
                placeholder={info.panelsH}
                disabled
              />
            </td>
            <td>
              <Input
                placeholder={info.panelsW}
                disabled
              />
            </td>
            <td>
              <Input
                disabled
                type="text"
                className="form-control"
                placeholder={
                  '$' +
                  order.linePrice[i][index].toFixed(
                    2
                  ) || 0
                }
              />
            </td>
            <td />
          </tr>

          <tr>
            <td>
              <strong>
                <p>Left Stile</p>
              </strong>
              <Input
                placeholder={info.leftStile}
                disabled
              />
            </td>
            <td>
              <strong>
                <p>Right Stile</p>
              </strong>
              <Input
                placeholder={info.rightStile}
                disabled
              />
            </td>
            <td>
              <strong>
                <p>Top Rail</p>
              </strong>
              <Input
                placeholder={info.topRail}
                disabled
              />
            </td>
            <td>
              <strong>
                <p>Bottom Rail</p>
              </strong>
              <Input
                placeholder={info.bottomRail}
                disabled
              />
            </td>
            <td>
              <strong>
                <p>Hori. Mid Rail</p>
              </strong>
              <Input
                placeholder={
                  info.horizontalMidRailSize
                }
                disabled
              />
            </td>
            <td>
              <strong>
                <p>Vert. Mid Rail</p>
              </strong>
              <Input
                placeholder={info.verticalMidRailSize}
                disabled
              />
            </td>
          </tr>
          <tr />
        </tbody>
      </Table>
    )
}

export default PanelsTable;