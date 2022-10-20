import React, { Fragment } from 'react';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import {
  Button,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Table,
} from 'reactstrap';
import { bindActionCreators } from 'redux';
import { Field } from 'redux-form';
import {
  flatStockLineItemSelector,
  flatStockLinePriceSelector,
  flatStockPriceSelector,
  flatStockTotalSelector,
  subTotalSelector,
  taxSelector,
  totalSelector,
} from '../../selectors/pricing';
import currencyMask from '../../utils/currencyMask';
import {
  renderDropdownList,
  renderDropdownListFilter,
  renderDropdownListNoPhoto,
  renderMouldingInputs,
  renderNumber,
  renderTextField,
  renderPrice,
} from '../RenderInputs/renderInputs';
import styles from '../Mouldings/styles';
import thickness from './thickness';

let Inputs = (props) => {
  const { fields, formState, linePrices, edit, part_list } = props;
  const filtered_woodtypes = part_list?.woodtypes.filter(
    (wood) => wood.mouldings === true
  );

  return (
    <div>
      {fields.map((table, index) => {
        return (
          <Fragment key={index}>
            <Table>
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>QTY</th>
                  <th style={{ width: '150px' }}>Width (Inches)</th>
                  <th style={{ width: '150px' }}>Length (Inches)</th>
                  <th style={{ width: '175px' }}>Woodtype</th>
                  <th style={{ width: '175px' }}>Thickness / Grade</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr key={index}>
                  <td style={{ width: '100px' }}>
                    <InputGroup>
                      <Field
                        name={`${table}.qty`}
                        type="text"
                        component={renderNumber}
                        label="price"
                        edit={edit}
                        required
                      />
                    </InputGroup>
                  </td>
                  <td style={{ width: '150px' }}>
                    <InputGroup>
                      <Field
                        name={`${table}.width`}
                        type="text"
                        component={renderNumber}
                        label="price"
                        edit={edit}
                        required
                      />
                    </InputGroup>
                  </td>
                  <td style={{ width: '150px' }}>
                    <InputGroup>
                      <Field
                        name={`${table}.length`}
                        type="text"
                        component={renderNumber}
                        label="price"
                        edit={edit}
                        required
                      />
                    </InputGroup>
                  </td>
                  <td style={{ width: '175px' }}>
                    <Field
                      name={`${table}.woodtype`}
                      component={renderDropdownListFilter}
                      data={filtered_woodtypes}
                      // onChange={(e) => changeMiscItem(e, index)}
                      valueField="value"
                      textField="NAME"
                      edit={edit}
                      required
                    />
                  </td>

                  <td style={{ width: '175px' }}>
                    <Field
                      name={`${table}.thickness`}
                      component={renderDropdownList}
                      data={thickness}
                      // onChange={(e) => changeMiscItem(e, index)}
                      valueField="value"
                      textField="name"
                      edit={edit}
                      required
                    />
                  </td>

                  <>
                    <td style={{ width: '125px' }}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <NumberFormat
                          thousandSeparator={true}
                          value={linePrices[index]}
                          disabled={true}
                          customInput={Input}
                          {...currencyMask}
                          prefix={'$'}
                        />
                        {/* <Input  placeholder={linePrices[index]} {...currencyMask} disabled /> */}
                      </InputGroup>
                    </td>
                  </>

                  {edit ? (
                    <td>
                      <Button
                        color="danger"
                        onClick={() => fields.remove(index)}
                      >
                        X
                      </Button>
                    </td>
                  ) : null}
                </tr>
              </tbody>
            </Table>
            <Row mb="4">
              <Col xs="5">
                <strong>Notes</strong>
                <Row>
                  <Col lg="10">
                    <Field
                      name={`${table}.notes`}
                      type="textarea"
                      component={renderTextField}
                      edit={edit}
                      placeholder={'Please specify any required lengths'}
                      label="notes"
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col lg="6" />
                  <Col>
                    {' '}
                    <strong>Adjust Price</strong>
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
              </Col>
            </Row>
          </Fragment>
        );
      })}

      <Row>
        <Col>
          {edit ? (
            <>
              <Button
                color="primary"
                className="mt-3"
                onClick={() =>
                  fields.push({
                    linearFT: '0',
                    price: 0,
                  })
                }
              >
                Add Item{' '}
              </Button>
            </>
          ) : null}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  part_list: state.part_list,
  subTotal: subTotalSelector(state),
  total: totalSelector(state),
  tax: taxSelector(state),
  prices: flatStockPriceSelector(state),
  linePrices: flatStockLinePriceSelector(state),
  mouldingTotal: flatStockTotalSelector(state),
  miscLineItemSelector: flatStockLineItemSelector(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      dispatch,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Inputs);
