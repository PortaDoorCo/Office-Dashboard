import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  Form
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { registerUser } from '../../../redux/users/actions';
import { strapiRegister } from '../../../utils/auth';
import Background from '../../../assets/img/register-background.jpg';
import axios from 'axios';
import db_url from '../../../redux/db_url';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Email: '',
      FirstName: '',
      LastName: '',
      Password: '',
      confirmPassword: '',
      Username: '',
      Company: '',
      signedUp: false
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    // Request API.
    const { Username, Email, Password } = this.state;

    if (this.state.Password === this.state.confirmPassword) {
      axios
        .post(`${db_url}/auth/local/register`, {
          username: Username,
          email: Email,
          password: Password,
        })
        .then(response => {
        // Handle success.
          console.log('Well done!');
          console.log('User profile', response.data.user);
          console.log('User token', response.data.jwt);
        })
        .catch(error => {
        // Handle error.
          console.log('An error occurred:', error.response);
        });
    } else {
      alert('Passwords do no match');
    }
  };

  renderRedirect = () => {
    window.location.reload();
  };

  signUp = () => {
    this.setState({ signedUp: true });
  };

  render() {
    if (this.state.signedUp) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <div className="app flex-row align-items-center" style={{ backgroundImage: `url(${Background})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
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
                </Card>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      registerUser
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(Register);
