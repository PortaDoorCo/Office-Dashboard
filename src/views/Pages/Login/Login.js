import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  CardGroup,
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
import { login } from '../../../redux/users/actions';
import axios from 'axios';
import Cookies from 'js-cookie';
import { loadOrders } from '../../../redux/orders/actions';
import { loadCustomers } from '../../../redux/customers/actions';
import PropTypes from 'prop-types';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import db_url from '../../../redux/db_url';
import Background from '../../../assets/img/login-background.jpg';
import Logo from '../../../assets/img/photos/logo.png';

class Login extends Component {
  static propTypes = {
    login: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      email: [],
      password: [],
      loading: false
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;

    axios
      .post(`${db_url}/auth/local`, {
        identifier: email,
        password: password
      })
      .then(response => {
        if (!process.browser) {
          return;
        }
        Cookies.set('username', response.data.user);
        Cookies.set('jwt', response.data.jwt, { expires: 0.8 });
        this.setState({ loading: true }, () => {
          this.props.login(Cookies.get('jwt'));
        });
      })
      .catch((error) => {
        NotificationManager.error('Login Credentials Incorrect', 'Error', 2000);
      });
  };

  render() {
    const {loading} = this.state;
    const {loggedIn} = this.props;
    let loadingActive;
    if (loading) {
      loadingActive = <div />;
    } else {
      loadingActive = (
        <div className="app flex-row align-items-center" style={{ backgroundImage: `url(${Background})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
          <Container>
            <Row className="justify-content-center">
              <NotificationContainer />
              <Col md="8">
                <CardGroup className="mb-4">
                  <Card className="p-4">
                    <Form onSubmit={this.handleSubmit}>
                      <CardBody>
                        <img style={{float: 'right', height:40, width:40 }} alt="" src={Logo} />
                        <h1>Login</h1>
                        <p className="text-muted">Sign In to your account</p>
                        <InputGroup className="mb-3">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="icon-user" />
                            </span>
                          </div>
                          <Input
                            type="text"
                            placeholder="Email"
                            name="email"
                            onChange={this.handleChange}
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
                            name="password"
                            onChange={this.handleChange}
                          />
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button color="primary" className="px-4">
                              Login
                            </Button>
                          </Col>
                          <Col xs="6" className="text-right">
                            <Button color="link" className="px-0">
                              Forgot password?
                            </Button>
                          </Col>
                        </Row>
                      </CardBody>
                    </Form>
                  </Card>
                  
                  {/* <Card
                    className="text-white bg-primary py-5 d-md-down-none"
                    style={{ width: 44 + '%' }}
                  >
                    <CardBody className="text-center">
                      <div>
                        <h2>Sign up</h2>
                        <p>Employee Sign Up</p>

                        <Link to="/register">
                          <Button
                            color="primary"
                            className="mt-3"
                            active
                            onClick={this.handleSignUp}
                          >
                            Register Now!
                          </Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card> */}
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }

    return <div>
      {loggedIn && <Redirect to="/" />}
      {loadingActive}
    </div>;
  }
}

const mapStateToProps = state => ({
  loggedIn: state.users.loggedIn,
  customerDBLoaded: state.customers.customerDBLoaded
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      login,
      loadOrders,
      loadCustomers,
      // getWoodtypes,
      // getDesigns,
      // getEdges,
      // getFinish,
      // getMoulds,
      // getPanels,
      // getHinges
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);