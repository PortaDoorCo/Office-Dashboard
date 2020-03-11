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
import Maker from './MakerJS/Edit/Maker'
import PanelsTable from './Table/DoorEdit/PanelTable'
import GlassTable from './Table/DoorEdit/GlassTable'


const renderField = ({
  input,
  props,
  meta: { touched, error, warning },
  ...custom
}) => (
    <Fragment>
      <Input autocomplete="new-password" {...(touched ? { valid: !error } : {})} {...input} {...custom} />
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
  part_list,
  i,
  prices,
  subTotal,
  part,
  doorOptions
}) => (
    <div>
      {fields.map((dimension, index) => {
        return (
          <Fragment key={index}>

            {console.log(part_list)}
            {console.log(part)}
            {formState && formState.part_list && formState.part_list[i].panels.PANEL === "GLASS" ?
              <GlassTable
                dimension={dimension}
                renderField={renderField}
                i={i}
                index={index}
                prices={prices}
                fields={fields}
                doorOptions={doorOptions}
              />
              :
              <PanelsTable
                dimension={dimension}
                renderField={renderField}
                i={i}
                index={index}
                prices={prices}
                fields={fields}
              />
            }




            <Row>
              <Col>
                <div id={`edited-makerJS${index}`} style={{ width: '100%', height: '300px' }}>
                  <Maker
                    i={i}
                    index={index}
                    style={{ width: '100%', height: '300px' }}
                  />
                </div>



              </Col>
            </Row>

            {console.log(formState ? formState.part_list[i].dimensions[index] : 0)}


            {formState && formState.part_list[i].dimensions[index].unevenCheck ?
              <div className='mb-3'>
                <Row>
                  {Array.from(Array(parseInt(formState.part_list[i].dimensions[index].panelsH)).keys()).slice(1).map((i, index) => {
                    return (
                      <div>
                        <Col />
                        <Col>
                          <p style={{ textAlign: 'center', marginTop: "10px" }}><strong>Panel Opening {index + 1}</strong></p>
                          <Field
                            name={`${dimension}.unevenSplitInput${index}`}
                            component={renderField}
                          />
                        </Col>
                        <Col />
                      </div>
                    )
                  })}
                </Row>
              </div>
              : null
            }

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
