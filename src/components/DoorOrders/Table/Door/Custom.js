import Ratio from 'lb-ratio';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button, Col, FormGroup,
  Label, Row, Table
} from 'reactstrap';
import {
  change, Field, FieldArray, getFormSyncErrors, startAsyncValidation,
  touch
} from 'redux-form';
import 'semantic-ui-css/semantic.min.css';
import currencyMask from '../../../../utils/currencyMask';
// import 'react-widgets/dist/css/react-widgets.css';
import {
  renderField, renderInt, renderNumber, renderPrice,
  renderTextField
} from '../../../RenderInputs/renderInputs';
import RenderPriceHolder from '../../../RenderInputs/RenderPriceHolder';
import RenderRails from './Components/Rails';
import RenderStiles from './Components/Stiles';
import RenderPanels from './Components/Panels';

const required = (value) => (value ? undefined : 'Required');
const trim_val = (value) => (value.trim('') ? undefined : 'Required');

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

const DoorTable = ({
  props,
  fields,
  formState,
  i,
  prices,
  subTotal,
  updateSubmit,
  edit,
  dispatch,
  addPrice,
  lites,
  formError,
  formSyncErrors,
}) => {
  const [width, setWidth] = useState([]);
  const [height, setHeight] = useState([]);
  const [changeValue, setChangeValue] = useState(null);
  const [modal, setModal] = useState(false);
  const [warningType, setWarningType] = useState(null);
  const [panels, setPanels] = useState([[]]);
  const [stiles, setStiles] = useState([[]]);
  const [rails, setRails] = useState([[]]);
  const toggle = () => setModal(!modal);

  const index = fields.length - 1;

  const styles = {
    border: '2px solid #d1d4d7',
    borderRadius: '25px',
    padding: '3%',
  };

  useEffect(() => {
    setWidth([]);
    setHeight([]);
    setChangeValue(null);
  }, [updateSubmit]);

  const clearNotes = (index, e) => {
    dispatch(change('Order', `part_list[${i}].dimensions[${index}].notes`, ''));
  };

  const registerChange = (index, e) => {
    const value = e.target.value;
    setChangeValue(value);
  };

  const addFields = (i) => {
    const construction = formState?.part_list[i]?.construction?.value;
    // const profile = formState?.part_list[i]?.profile?.PROFILE_WIDTH;
    // const design = formState?.part_list[i]?.design?.PROFILE_WIDTH;

    if (fields.length >= 0) {
      dispatch(touch('Order', `part_list[${i}].dimensions[${index}].notes`));
      dispatch(touch('Order', `part_list[${i}].dimensions[${index}].width`));
      dispatch(touch('Order', `part_list[${i}].dimensions[${index}].height`));
    }

    dispatch(touch('Order', `part_list[${i}].woodtype`));
    dispatch(touch('Order', `part_list[${i}].design`));

    if (construction !== 'Miter') {
      dispatch(touch('Order', `part_list[${i}].edge`));
    }

    if (construction === 'Cope') {
      dispatch(touch('Order', `part_list[${i}].profile`));
    }

    dispatch(touch('Order', `part_list[${i}].applied_profile`));
    dispatch(touch('Order', `part_list[${i}].panel`));

    dispatch(startAsyncValidation('Order'));

    fields.push({
      qty: 1,
      notes: '',
    });
  };

  let itemNum = 0;

  const itemNumCounter = {
    ...formState,
    part_list: formState?.part_list?.map((i) => {
      return {
        ...i,
        dimensions: i?.dimensions?.map((j) => {
          itemNum += 1;
          return {
            ...j,
            item: itemNum,
          };
        }),
      };
    }),
  };



  return (
    <div>
      {fields.map((table, index) => (
        <Fragment key={index}>
          <hr />
          <Row>
            <Col>
              <FormGroup>
                <Label htmlFor="panel">
                  <strong>
                    Line #{' '}
                    {itemNumCounter?.part_list[i]?.dimensions[index]?.item}
                  </strong>
                </Label>
              </FormGroup>
            </Col>
            <Col xs="10" />
          </Row>
          <Table>
            <thead>
              <tr>
                <th>Qty</th>
                <th>Width</th>
                <th>Height</th>
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
                    component={renderInt}
                    label="qty"
                    validate={required}
                    edit={edit}
                  />
                </td>
                <td>
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
                  <Field
                    name={`${table}.height`}
                    type="text"
                    component={renderNumber}
                    label="height"
                    validate={required}
                    edit={edit}
                  />
                </td>
                <td>
                  <Field
                    name={`${table}.price`}
                    type="text"
                    component={renderPrice}
                    edit={edit}
                    label="extraCost"
                    {...currencyMask}
                  />
                </td>
                <td>
                  {!edit ? (
                    <Button
                      color="danger"
                      className="btn-circle"
                      onClick={() => fields.remove(index)}
                    >
                      X
                    </Button>
                  ) : (
                    <div />
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>
                    <p>Cab#</p>
                  </strong>
                  <Field
                    name={`${table}.cab_number`}
                    type="text"
                    component={renderField}
                    label="cab"
                    edit={edit}
                  />
                </td>
              </tr>
            </tbody>
          </Table>

          <div style={styles}>
            <FieldArray name={`${table}.Stiles`} component={RenderStiles} edit={edit} />
          </div>

          <hr />

          <div style={styles}>
            <FieldArray name={`${table}.Rails`} component={RenderRails} edit={edit} />
          </div>


          <hr />

          <div style={styles}>
            <FieldArray name={`${table}.Panels`} component={RenderPanels} edit={edit} />
          </div>

          <hr />


          <Row>
            <Col xs="5">
              <strong>Notes</strong>
              <Row>
                <Col lg="10">
                  <Field
                    name={`${table}.notes`}
                    type="textarea"
                    component={renderTextField}
                    edit={edit}
                    label="notes"
                  />
                </Col>

                <Col lg="2">
                  {!edit ? (
                    <Button
                      color="danger"
                      className="btn-circle"
                      onClick={(e) => clearNotes(index, e)}
                    >
                      X
                    </Button>
                  ) : null}
                </Col>
              </Row>
            </Col>
            <Col lg="4" />
            <Col xs="3">
              <strong>Extra Design Cost</strong>
              <Field
                name={`${table}.extraCost`}
                type="text"
                component={renderPrice}
                edit={edit}
                label="extraCost"
                {...currencyMask}
              />
            </Col>
          </Row>
          <br />
        </Fragment>
      ))}
      <Row>
        <Col>
          {!edit ? (
            <div>
              <Button
                color="primary"
                className="btn-circle add-item-tour"
                onClick={(e) => addFields(i)}
              >
                +
              </Button>
            </div>
          ) : (
            <div />
          )}
        </Col>
      </Row>

      <Row>
        <Col xs="9" />
        <Col xs="3">
          <strong>Sub Total: </strong>
          {subTotal[i] ? (
            <RenderPriceHolder input={subTotal[i].toFixed(2)} edit={true} />
          ) : (
            <RenderPriceHolder input={'0.00'} edit={true} />
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lites: state.part_list.lites,
  formSyncErrors: getFormSyncErrors('Order')(state),
});

export default connect(mapStateToProps, null)(DoorTable);
