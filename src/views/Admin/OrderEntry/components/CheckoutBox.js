import React from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
} from 'reactstrap';
import 'react-notifications/lib/notifications.css';
import { Field } from 'redux-form';
import 'react-notifications/lib/notifications.css';
import {
  renderField,
  renderCheckboxToggle,
} from '../../../../components/RenderInputs/renderInputs';
import NumberFormat from 'react-number-format';
import currencyMask from '../../../../utils/currencyMask';
import NavBar from './NavBar';
import NavModal from './MiscItemCollapse';
import { connect } from 'react-redux';

const CheckoutBox = (props) => {
  const { role } = props;
  const jobInfo = props.formState?.job_info;

  return (
    <Row>
      <Col>
        <Card>
          <CardBody className="misc-item-tour">
            <NavBar onSubNav={props.onSubNav} {...props} />
            <hr />

            <Row>
              <Col>
                <h3>Reminder:</h3>
                <p>Please Add Shipping and Addon Charges in Misc Items</p>
              </Col>
            </Row>

            <hr />

            <NavModal
              {...props}
              onSubNav={props.onSubNav}
              onUploaded={props.onUploaded}
            />

            <form
              onKeyPress={props.onKeyPress}
              onSubmit={props.handleSubmit(props.submit)}
            >
              <Row>
                <Col xs="8" />
                <Col xs="4">
                  <Row className="mb-0">
                    <Col xs="9" />
                    <Col>
                      <FormGroup>
                        <Label htmlFor="companyName">Taxable?</Label>
                        <Field
                          name={'Taxable'}
                          component={renderCheckboxToggle}
                          edit={
                            role?.type === 'authenticated' ||
                            role?.type === 'owner' ||
                            role?.type === 'administrator' ||
                            role?.type === 'management' ||
                            role?.type === 'office'
                              ? true
                              : false
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mb-0">
                    <Col xs="9" />
                    <Col>
                      <FormGroup>
                        <Label htmlFor="nonCashPayment">
                          Non Cash Payment?
                        </Label>
                        <Field
                          name={'NonCashPayment'}
                          component={renderCheckboxToggle}
                          edit={
                            role?.type === 'authenticated' ||
                            role?.type === 'owner' ||
                            role?.type === 'administrator' ||
                            role?.type === 'management' ||
                            role?.type === 'office'
                              ? true
                              : false
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <strong>Discount: </strong>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>%</InputGroupText>
                    </InputGroupAddon>
                    <Field
                      name={'discount'}
                      type="text"
                      component={renderField}
                      edit={
                        role?.type === 'authenticated' ||
                        role?.type === 'owner' ||
                        role?.type === 'administrator' ||
                        role?.type === 'management' ||
                        role?.type === 'office'
                          ? true
                          : false
                      }
                      label="discount"
                      validate={props.maxValue(100)}
                    />
                  </InputGroup>

                  <strong>Tax: </strong>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <NumberFormat
                      thousandSeparator={true}
                      value={props.tax}
                      disabled={true}
                      customInput={Input}
                      {...currencyMask}
                      prefix={'$'}
                    />
                  </InputGroup>

                  <strong>Total: </strong>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <NumberFormat
                      thousandSeparator={true}
                      value={props.total}
                      disabled={true}
                      customInput={Input}
                      {...currencyMask}
                      prefix={'$'}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col xs="8" />
                <Col xs="4">
                  <Row>
                    <Col>
                      <Button
                        color="primary"
                        className="submit"
                        style={{ width: '100%' }}
                      >
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        color="danger"
                        onClick={props.toggleCancelModal}
                        style={{ width: '100%' }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state) => ({
  role: state?.users?.user?.role,
});

export default connect(mapStateToProps, null)(CheckoutBox);
