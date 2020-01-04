import React, { Component } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,

} from 'reactstrap';
import toPercent from 'decimal-to-percent'

class NonEdit extends Component {

  render() {
    const props = this.props;




    return (
      <div className="animated resize">
        <Row>
          <Card>
            <CardHeader>
              <strong>Customer Profile</strong>
            </CardHeader>
            <CardBody>
              <Form onSubmit={this.handleSubmit}>
                <Row>
                  <Col xs="12">
                    <h6>Company Info</h6>
                  </Col>
                </Row>

                <Row>
                  <Col sm="4">
                    <FormGroup>
                      <Label htmlFor="companyName">Company Name</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.Company}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="4">
                    <FormGroup>
                      <Label htmlFor="full-name">Full Name</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.Contact}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="4">
                    <FormGroup>
                      <Label htmlFor="full-name">Email</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.EMAIL}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col sm="3">
                    <FormGroup>
                      <Label htmlFor="companyName">Payment Method</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.PaymentMethod}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="3">
                    <FormGroup>
                      <Label htmlFor="full-name">Shipping Method</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.Ship_Via}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="3">
                    <FormGroup>
                      <Label htmlFor="full-name">Sales Rep</Label>
                      <br />
                      <Input
                        placeholder={this.props.salesRep.fullName}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="3">
                    <FormGroup>
                      <Label htmlFor="full-name">Sales Tax</Label>
                      <Input
                        placeholder={props.selectedCompanies.TaxRate}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm="4">
                    <FormGroup>
                      <Label htmlFor="companyName">Payment Terms</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.PMT_TERMS}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col />
                </Row>

                <hr />

                <Row>
                  <Col xs="12">
                    <h6>Billing Address</h6>
                  </Col>
                </Row>

                <Row>
                  <Col xs="6">
                    <FormGroup>
                      <Label htmlFor="address1">Address 1</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.Address1}
                        disabled
                      />
                    </FormGroup>
                  </Col>

                  <Col xs="6">
                    <FormGroup>
                      <Label htmlFor="address2">Address 2</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.Address2}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col xs="3">
                    <FormGroup>
                      <Label htmlFor="city">City</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.City}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="3">
                    <FormGroup>
                      <Label htmlFor="state">State</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.State}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="3">
                    <FormGroup>
                      <Label htmlFor="zipcode">Zip Code</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.Zip}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="3">
                    <FormGroup>
                      <Label htmlFor="phone">Phone Number</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.Phone1}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <hr />

                <Row>
                  <Col xs="12">
                    <h6>Shipping Address</h6>
                  </Col>
                </Row>

                <Row>
                  <Col xs="6">
                    <FormGroup>
                      <Label htmlFor="address1">Address 1</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.Shipping_Address1}
                        disabled
                      />
                    </FormGroup>
                  </Col>

                  <Col xs="6">
                    <FormGroup>
                      <Label htmlFor="address2">Address 2</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.Shipping_Address2}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col xs="3">
                    <FormGroup>
                      <Label htmlFor="city">City</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.Shipping_City}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="3">
                    <FormGroup>
                      <Label htmlFor="state">State</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.Shipping_State}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="3">
                    <FormGroup>
                      <Label htmlFor="zipcode">Zip Code</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.Shipping_Zip}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="3">
                    <FormGroup>
                      <Label htmlFor="phone">Phone Number</Label>
                      <br />
                      <Input
                        placeholder={props.selectedCompanies.Shipping_Phone}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <hr />

                <Row>
                  <Col>
                    <FormGroup>
                      <h6>Extra Notes</h6>
                      <br />
                      {/* <TextArea disabled /> */}
                    </FormGroup>
                  </Col>
                </Row>

                <Button color="primary" size="lg" onClick={this.props.onEdit}>
                  Edit
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Row>
      </div>
    );
  }
}

export default NonEdit;
