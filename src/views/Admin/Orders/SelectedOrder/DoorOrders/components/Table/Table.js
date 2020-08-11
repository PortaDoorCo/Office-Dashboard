import React from 'react';
import {
  Table,
  Input,
  Row,
  Button
} from 'reactstrap';

import 'semantic-ui-css/semantic.min.css';
import { Field } from 'redux-form';
import { renderField, renderFieldDisabled } from '../RenderInputs/renderInputs';


const PanelsTable = ({ table, index, required, w, i, h, formState, prices, fields }) => {

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
              name={`${table}.panelsH`}
              type="text"
              component={renderField}
              label="horizontalMidRail"
            />
          </td>
          <td>
            <Field
              name={`${table}.panelsW`}
              type="text"
              component={renderField}
              label="verticalMidRail"
            />
          </td>
          <td>
            {/* {prices[i] ?
                            <Input
                                type="text"
                                className="form-control"
                                // placeholder={"$" + prices[i][index].toFixed(2) || 0}
                            /> : */}
            <Input
              type="text"
              className="form-control"
              placeholder={'$0.00'}
            />
            {/* } */}

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
          <td>
            <strong>
              <p>Hori. Mid Rail</p>
            </strong>
            <Field
              name={`${table}.horizontalMidRailSize`}
              type="text"
              component={renderField}
              label="horizontalMidRail"
            />
          </td>
          <td>
            <strong>
              <p>Vert. Mid Rail</p>
            </strong>
            <Field
              name={`${table}.verticalMidRailSize`}
              type="text"
              component={renderField}
              label="verticalMidRail"
            />
          </td>
        </tr>
        <Row>
          <p className="ml-3">*Finish Stile/Rail Sizes*</p>
        </Row>
        <tr />
      </tbody>

    </Table>
  );
};

export default PanelsTable;