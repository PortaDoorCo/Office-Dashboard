import React from 'react';
import {
  Row,
  Col,
  Card,

  CardBody,
  Input,
  Button,
  FormGroup,
  InputGroup, InputGroupAddon, InputGroupText, Label
} from 'reactstrap';
import 'react-notifications/lib/notifications.css';
import {
  Field
} from 'redux-form';
import 'react-notifications/lib/notifications.css';
import { renderField, renderCheckboxToggle } from '../../../components/RenderInputs/renderInputs';
import NumberFormat from 'react-number-format';
import currencyMask from '../../../utils/currencyMask';
import Navigation from './Navigation';
// import NavBar from './NavBar';
// import NavModal from './MiscItemCollapse';

const CheckoutBox = (props) => {
  return(
    <Row>
      <Col>
        <Card>
          <CardBody>
            {/* <NavBar onSubNav={props.onSubNav} /> */}
            <hr />

            {/* <NavModal {...props} onSubNav={props.onSubNav} onUploaded={props.onUploaded} /> */}

            <form onKeyPress={props.onKeyPress} onSubmit={props.handleSubmit(props.submit)}>
              <Row>
            
                <Col>
                  <Row className='mb-0'>
                    <Col xs='9' />
                    <Col>
                      <FormGroup>
                        <Label htmlFor="companyName">Taxable?</Label>
                        <Field
                          name={'Taxable'}
                          edit={props.edit}
                          component={renderCheckboxToggle}
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
                      label="discount"
                      edit={props.edit}
                      validate={props.maxValue(100)}
                    />
                  </InputGroup>

                      
                  <strong>Tax: </strong>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <NumberFormat thousandSeparator={true} value={props.tax} disabled={true} customInput={Input} {...currencyMask} prefix={'$'} />
                  </InputGroup>


                  <strong>Total: </strong>
                  <InputGroup className='mb-3'>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <NumberFormat thousandSeparator={true} value={props.total} disabled={true} customInput={Input} {...currencyMask} prefix={'$'} />
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Navigation
                    {...props}
                  />
                </Col>
              </Row>

              {!props.edit ?
                <Row>
    
                  <Col>
                    <Row>
                      <Col>
                        <Button color="primary" className="submit" style={{ width: '100%' }}>Submit</Button>
                      </Col>
                      <Col>
                        <Button color="danger" onClick={props.toggleCancelModal} style={{ width: '100%' }}>
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                : null
              }

            </form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
  
};

export default CheckoutBox;