import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardSubtitle,
  CardBody,
  Collapse,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  Table,
  Badge
} from 'reactstrap';

class BasicForms extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = { collapse: true };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="8">
            <Card>
              <CardHeader>
                <strong>Employee Profile</strong>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col sm="6">
                    <FormGroup>
                      <Label htmlFor="company-name">Full Name</Label>
                      <Input type="text" id="full-name" placeholder="Enter your Full Name" required />
                    </FormGroup>
                  </Col>
                  <Col sm="6">
                    <FormGroup>
                      <Label htmlFor="company-name">Position</Label>
                      <Input type="text" id="position" placeholder="Enter your position" required />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Label htmlFor="address1">Address 1</Label>
                      <Input type="text" id="address1" placeholder="Address 1" required />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Label htmlFor="address2">Address 2</Label>
                      <Input type="text" id="address2" placeholder="Address 2" required />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="3">
                    <FormGroup>
                      <Label htmlFor="city">City</Label>
                      <Input type="text" id="city" placeholder="City" required />
                    </FormGroup>
                  </Col>
                  <Col xs="3">
                    <FormGroup>
                      <Label htmlFor="state">State</Label>
                      <Input type="text" id="state" placeholder="State" required />
                    </FormGroup>
                  </Col>
                  <Col xs="3">
                    <FormGroup>
                      <Label htmlFor="zipcode">Zip Code</Label>
                      <Input type="text" id="zipcode" placeholder="Zip Code" required />
                    </FormGroup>
                  </Col>
                  <Col xs="3">
                    <FormGroup>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input type="text" id="phone" placeholder="Phone Number" required />
                    </FormGroup>
                  </Col>
                </Row>

                <Button color="primary" size="lg">Submit</Button>{' '}

              </CardBody>
            </Card>
          </Col>

        </Row>


      </div>
    )
  }
}

export default BasicForms;
