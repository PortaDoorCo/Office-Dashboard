import React from 'react';
import { Row, Col, Table, Button } from 'reactstrap';
import { renderNumber } from '../../../../../components/RenderInputs/renderInputs';
import {
  Field,
} from 'redux-form';
const required = (value) => (value ? undefined : 'Required');


const Rails = ({fields, edit }) => {

  return (
    <div>
      {fields.map((table, index) => {
        return (
          <div>
            <Row>
              <Col>
                <strong>Rail #{index + 1}</strong>
                <Table>
                  <tr>
                    <td>
                      <strong>
                        <p>Rail Width</p>
                      </strong>
                      <Field
                        name={`${table}.width`}
                        type="text"
                        component={renderNumber}
                        label="width"
                        validate={[required]}
                        edit={edit}
                      />
                    </td>
                    <td>
                      <strong>
                        <p>Rail Length</p>
                      </strong>
                      <Field
                        name={`${table}.length`}
                        type="text"
                        component={renderNumber}
                        label="height"
                        validate={[required]}
                        edit={edit}
                      />
                    </td>

                    <td>
                      <Button
                        color="danger"
                        className="btn-circle"
                        style={{ marginTop: '1.25rem' }}
                        onClick={() => fields.remove(index)}
                      >
                          X
                      </Button>
                    </td>
                  </tr>
                </Table>
              </Col>
            </Row>
          </div>
        );
      })}
      <Row>
        <Col>
          <Button
            color="primary"
            onClick={() => fields.push()}
          >
              Add Rails
          </Button>
        </Col>
      </Row>
    </div>
  );
      
};

export default Rails;