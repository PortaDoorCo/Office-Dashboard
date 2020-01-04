import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Button,
  Input,
  InputGroup,
  Form
} from "reactstrap";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { registerUser } from '../../../redux/users/actions';
import { strapiRegister } from '../../../utils/auth';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Email: [],
      FullName: [],
      Password: [],
      confirmPassword: [],
      Username: [],
      Company: [],
      signedUp: false
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = e => {
    e.preventDefault();


    // Request API.
    const { Username, Email, Password, FullName } = this.state;



    if (this.state.Password === this.state.confirmPassword) {
      strapiRegister(Username, Email, Password, FullName).then(() => this.setState({ signedUp: true }));
    } else {
      alert('Passwords do no match')
    }

  };

  renderRedirect = () => {
    window.location.reload();
  }

  signUp = () => {
    this.setState({ signedUp: true });
  };

  render() {
    if (this.state.signedUp) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Form onSubmit={this.handleSubmit}>
            <Row className="justify-content-center">
              <Col md="6">
                <Card className="mx-4">
                  <CardBody className="p-4">
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="icon-user" />
                        </span>
                      </div>
                      <Input
                        type="text"
                        placeholder="Username"
                        name="Username"
                        onChange={this.handleChange}
                        value={this.state.Username}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="icon-user" />
                        </span>
                      </div>
                      <Input
                        type="text"
                        placeholder="Full Name"
                        name="FullName"
                        onChange={this.handleChange}
                        value={this.state.FullName}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="icon-user" />
                        </span>
                      </div>
                      <Input
                        type="text"
                        placeholder="Company"
                        name="Company"
                        onChange={this.handleChange}
                        value={this.state.Company}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">@</span>
                      </div>
                      <Input
                        type="text"
                        placeholder="Email"
                        name="Email"
                        onChange={this.handleChange}
                        value={this.state.Email}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="icon-lock" />
                        </span>
                      </div>
                      <Input
                        type="password"
                        placeholder="Password"
                        name="Password"
                        onChange={this.handleChange}
                        value={this.state.Password}
                      />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="icon-lock" />
                        </span>
                      </div>
                      <Input
                        type="password"
                        placeholder="Password"
                        name="confirmPassword"
                        onChange={this.handleChange}
                        value={this.state.confirmPassword}
                      />
                    </InputGroup>
                    <Button color="success" block>
                      Create Account
                    </Button>
                  </CardBody>
                  <CardFooter className="p-4">
                    <Row>
                      <Col xs="12" sm="6">
                        <Button className="btn-facebook" block>
                          <span>facebook</span>
                        </Button>
                      </Col>
                      <Col xs="12" sm="6">
                        <Button className="btn-twitter" block>
                          <span>twitter</span>
                        </Button>
                      </Col>
                    </Row>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => bindActionCreators({
  registerUser
}, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(Register);
