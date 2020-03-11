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






const GlassTable = ({ info, order, index, i }) => {

    return (
        <Table>
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
                            placeholder={info.lites ? info.lites.option : "None"}
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
                </tr>
                <tr />
            </tbody>
        </Table>
    )
}

export default GlassTable;