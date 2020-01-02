import React, { Component, Fragment } from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import { Field } from "redux-form";
import DropdownList from "react-widgets/lib/DropdownList";
import "react-widgets/dist/css/react-widgets.css";

const renderDropdownList = ({
  input,
  data,
  valueField,
  textField,
  meta: { touched, error, warning }
}) => (
    <div>
      <DropdownList
        {...input}
        data={data}
        valueField={valueField}
        textField={textField}
        onChange={input.onChange}
        filter
      />
      {touched &&
        ((error && <span style={{ color: "red" }}>{error}</span>) ||
          (warning && <span style={{ color: "red" }}>{warning}</span>))}
    </div>
  );

const renderField = ({
  input,
  props,
  meta: { touched, error, warning },
  ...custom
}) => (
    <Fragment>
      <Input {...(touched ? { valid: !error } : {})} {...input} {...custom} />
      {/* {error && <FormFeedback>{error}</FormFeedback>}
    {!error && warning && <FormText>{warning}</FormText>} */}
    </Fragment>
  );

const status = ["Quote", "Ordered", "Shipped"];

class JobInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    console.log()
    return (
      <div>
        <Row>
          <Col xs="3">
            <FormGroup>
              <strong>
                {" "}
                <Label htmlFor="job-name">Job Name</Label>{" "}
              </strong>
              <Field
                name="jobName"
                type="text"
                component={renderField}
                label="JobName"
              />
            </FormGroup>
          </Col>
          <Col xs="5">
            <FormGroup>
              <strong>
                {" "}
                <Label htmlFor="customers">Customer</Label>{" "}
              </strong>
              <Field
                name={"jobInfo.customer"}
                type="text"
                component={renderDropdownList}
                data={this.props.companies}
                label="JobName"
                valueField="value"
                textField="Company"
              />
            </FormGroup>
          </Col>
          <Col xs="2">
            <FormGroup>
              <strong>
                {" "}
                <Label htmlFor="status">Status</Label>{" "}
              </strong>
              <Field
                name="status"
                type="text"
                component={renderDropdownList}
                data={status}
                label="JobName"
                valueField="value"
                textField="name"
              />
            </FormGroup>
          </Col>
          <Col xs="2">
            <FormGroup>
              <strong>
                <Label htmlFor="po">PO #</Label>
              </strong>
              <Field
                name="poNum"
                type="text"
                component={renderField}
                label="JobName"
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs="6">
            <FormGroup>
              <strong>
                <Label htmlFor="address1">Address 1</Label>
              </strong>
              <Field
                name="shippingAddress.Address1"
                type="text"
                component={renderField}
                label="JobName"
              />
            </FormGroup>
          </Col>
          <Col xs="6">
            <FormGroup>
              <strong>
                <Label htmlFor="address2">Address 2</Label>
              </strong>
              <Field
                name="shippingAddress.Address2"
                type="text"
                component={renderField}
                label="JobName"
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs="3">
            <FormGroup>
              <strong>
                <Label htmlFor="city">City</Label>
              </strong>
              <Field
                name="shippingAddress.City"
                type="text"
                component={renderField}
                label="JobName"
              />
            </FormGroup>
          </Col>
          <Col xs="3">
            <FormGroup>
              <strong>
                <Label htmlFor="state">State</Label>
              </strong>
              <Field
                name="shippingAddress.State"
                type="text"
                component={renderField}
                label="JobName"
              />
            </FormGroup>
          </Col>
          <Col xs="3">
            <FormGroup>
              <strong>
                <Label htmlFor="zipcode">Zip Code</Label>
              </strong>
              <Field
                name="shippingAddress.Zip"
                type="text"
                component={renderField}
                label="JobName"
              />
            </FormGroup>
          </Col>
          <Col xs="3">
            <FormGroup>
              <strong>
                <Label htmlFor="phone">Phone Number</Label>
              </strong>
              <Field
                name="shippingAddress.Phone"
                type="text"
                component={renderField}
                label="JobName"
              />
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default JobInfo;
