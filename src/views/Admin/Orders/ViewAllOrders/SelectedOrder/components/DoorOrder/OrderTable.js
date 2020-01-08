import React, { Fragment } from "react";
import {
  Button,
  Table,
  Input,
  FormFeedback,
  FormText,
  Row,
  Col
} from "reactstrap";
import {
  Field,
} from "redux-form";
import Ratio from "lb-ratio";


const renderField = ({
  input,
  props,
  meta: { touched, error, warning },
  ...custom
}) => (
    <Fragment>
      <Input {...(touched ? { valid: !error } : {})} {...input} {...custom} />
      {error && <FormFeedback>{error}</FormFeedback>}
      {!error && warning && <FormText>{warning}</FormText>}
    </Fragment>
  );

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

const OrderTable = ({
  fields,
  formState,
  i,
  prices,
  subTotal,
  part
}) => (
    <div>
      {fields.map((dimension, index) => {
        return (
          <Fragment key={index}>
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
                      component={renderField}
                      label="width"
                    />
                  </td>
                  <td>
                    <Field
                      name={`${dimension}.height`}
                      type="text"
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
            <Row>
              <Col>
{/* 

                <div id={`makerJS${index}`} style={{ width: '100%', height: '300px' }}>
                  <Maker
                    width={width[index]}
                    height={height[index]}
                    i={i}
                    index={index}
                    style={{ width: '100%', height: '300px' }}
                  />
                </div> */}
                


                </Col>
            </Row>
            <Row>
              <Col>
                <strong>Notes</strong>
                <Field
                  name={`${dimension}.notes`}
                  type="textarea"
                  component={renderField}
                  label="notes"
                />
              </Col>
              <Col />
              <Col />
            </Row>
            <br />
          </Fragment>
        );
      })}
      <Fragment>
        <Button
          color="primary"
          className="btn-circle"
          onClick={() =>
            fields.push({
              panelsH: 1,
              panelsW: 1,
              leftStile: fraction(
                formState.part_list[formState.part_list.length - 1].design.L_STILE_W
              ),
              rightStile: fraction(
                formState.part_list[formState.part_list.length - 1].design.R_STILE_W
              ),
              topRail: fraction(
                formState.part_list[formState.part_list.length - 1].design.TOP_RAIL_W
              ),
              bottomRail: fraction(
                formState.part_list[formState.part_list.length - 1].design.BOT_RAIL_W
              ),
              horizontalMidRailSize: 0,
              verticalMidRailSize: 0
            })
          }
        >
          +
      </Button>
        <Row>
          <Col xs="4" />
          <Col xs="5" />
          <Col xs="2">
            <strong>Addtional Price: </strong>
            <Field
              name={`${part}.addPrice`}
              type="text"
              component={renderField}
              label="addPrice"
            />
            <strong>Sub Total: </strong>
            {subTotal[i] ? (
              <Input
                type="text"
                className="form-control"
                // onChange={this.handleChange}
                name="subTotal"
                disabled
                placeholder={"$" + subTotal[i].toFixed(2) || 0}
              />
            ) : null}
          </Col>
        </Row>
      </Fragment>
    </div>
  );

export default OrderTable;
