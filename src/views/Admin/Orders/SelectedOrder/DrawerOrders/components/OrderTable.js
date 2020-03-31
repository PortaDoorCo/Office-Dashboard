import React, { Component, Fragment } from 'react';
import {
  Table,
  Input,
  Row,
  Col,
  Button
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, change } from 'redux-form';
import 'react-widgets/dist/css/react-widgets.css';
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField, renderFieldDisabled } from './RenderInputs/renderInputs'

const required = value => value ? undefined : 'Required';

class OrderTable extends Component {

  render() {

    const { fields, scoop, dividers, prices, i, subTotal, part, formState, edit } = this.props;


    return (
      formState ?
        <div>
          <Fragment>
            {fields.map((table, index) =>
              < Fragment key={index} >
                <Table>
                  <Field
                    name={`${table}.item`}
                    type="text"
                    component={renderFieldDisabled}
                    label="item"
                    edit={edit}
                  />
                  <thead>
                    <tr>
                      <th>Qty</th>
                      <th>Width</th>
                      <th>Depth</th>
                      <th>Height</th>
                      <th>Scoop</th>
                      <th>Divider</th>
                      <th>Price</th>
                      <th></th>
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
                          edit={edit}
                          />
                      </td>
                      <td>
                        <Field
                          name={`${table}.width`}
                          type="text"
                          component={renderField}
                          label="width"
                          validate={required}
                          edit={edit}
                          />
                      </td>
                      <td>
                        <Field
                          name={`${table}.depth`}
                          type="text"
                          component={renderField}
                          label="depth"
                          validate={required}
                          edit={edit}
                          />
                      </td>
                      <td>
                        <Field
                          name={`${table}.height`}
                          type="text"
                          component={renderField}
                          label="height"
                          validate={required}
                          edit={edit}
                          />
                      </td>
                      <td >
                        <Field
                          name={`${table}.scoop`}
                          component={renderDropdownList}
                          data={scoop}
                          valueField="Value"
                          textField="Name"
                          validate={required}
                          edit={edit} />
                      </td>
                      <td>
                        <Field
                          name={`${table}.dividers`}
                          component={renderDropdownList}
                          data={dividers}
                          valueField="Value"
                          textField="Name"
                          validate={required}
                          edit={edit} />
                      </td>
                      <td style={{ width: '150px' }}>
                      {prices[i] ?
                        <Input
                          type="text"
                          className="form-control"
                          disabled={edit}
                          placeholder={"$" + prices[i][index].toFixed(2) || 0}
                        /> : <Input
                          type="text"
                          className="form-control"
                          placeholder={"$0.00"}
                          disabled={edit}
                        />
                      }
                      </td>

                      <td >
                        {!edit ? 
                        <Button color="danger" className="btn-circle" onClick={() => fields.remove(index)}>X</Button> :
                        <div />
                      }
                        
                      </td>

                    </tr>


                    <tr>

                    </tr>
                  </tbody>
                </Table>
                <Row>
                  <Col>
                    <strong>Notes</strong>
                    <Field
                      name={`${table}.notes`}
                      type="textarea"
                      component={renderField}
                      edit={edit}
                      label="notes" />
                  </Col>
                  <Col>
                  </Col>
                  <Col></Col>
                </Row>
                <br />

              </Fragment>

            )}
            {!edit ?
            <Button color="primary" className="btn-circle" onClick={() => fields.push({
              scoop: scoop[0],
              dividers: dividers[0]
            })}>+</Button> 
            : <div />
          }

            <Row>
              <Col xs="4" />
              <Col xs="5" />
              <Col xs="2">
                <strong>Addtional Price: </strong>
                <Field
                  name={`${part}.addPrice`}
                  type="text"
                  component={renderField}
                  edit={edit}
                  label="addPrice" />
                <strong>Sub Total: </strong>
                {subTotal[i] ? (
                  <Input disabled={edit} placeholder={subTotal[i].toFixed(2) || 0} />
                ) : (
                    <Input disabled={edit} placeholder="0" />
                  )}
              </Col>
            </Row>
          </Fragment >
        </div> : <div />
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  setMain: (table) => dispatch(change(`DrawerOrder`, `${table}.price`, 5))
}, dispatch);

export default connect(null, mapDispatchToProps)(OrderTable);