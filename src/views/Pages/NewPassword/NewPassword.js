import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { registerUser, resetPassword } from '../../../redux/users/actions';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const NewPassword = props => {

  const { passwordReset } = props;
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');


  const submit = async () => {
    const { resetPassword } = props;
    const submitNewPassword = { code, password, passwordConfirmation };
    if ((password === passwordConfirmation) && password.length > 0) {
      await resetPassword(submitNewPassword);
      await NotificationManager.success('Password Updated!', 'Password Updated!', 2000);
    } else {
      alert('your password do not match');
    }
  };

  if (passwordReset) {
    return (
      <div>
        <NotificationContainer />
        <Redirect to='/' />
      </div>

    );
  } else {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <NotificationContainer />
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <h1>New Password</h1>
                  <p className="text-muted">Paste Code Emailed To You</p>
                  <InputGroup className="mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="icon-user" />
                      </span>
                    </div>
                    <Input
                      type="text"
                      placeholder="Paste Code Here"
                      name="Code"
                      onChange={(e) => setCode(e.target.value)}
                      value={code}
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
                      placeholder="New Password"
                      name="NewPassword"
                      autoComplete="new-password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
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
                      placeholder="Confirm New Password"
                      name="confirmPassword"
                      autoComplete="new-password"
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      value={passwordConfirmation}
                    />
                  </InputGroup>
                  <Button color="success" block onClick={submit}>
                    Change Password
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }



};

const mapStateToProps = state => ({
  user: state.users.user,
  passwordReset: state.users.passwordReset

});

const mapDispatchToProps = dispatch => bindActionCreators({
  registerUser,
  resetPassword
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPassword);
