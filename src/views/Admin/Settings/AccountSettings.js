import React, { useState } from 'react';
import {
  Col,
  Row,
  Input,
  Card,
  CardBody,
  FormGroup,
  Label,
  Button,
  CardTitle,
  Collapse,
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AppSwitch } from '@coreui/react';
import Avatar from 'react-avatar';
import Cookies from 'js-cookie';
import {
  updateAccount,
  login,
  forgotPassword,
} from '../../../redux/users/actions';
import LogOutModal from './LogOutModal';
import FileUploader from '../../../components/FileUploader/FileUploader';
import Message from './components/Message';

const cookie = Cookies.get('jwt');

const AccountSettings = (props) => {
  const [user, setUser] = useState(props.user);
  const [modal, setModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);

  const toggle = () => setModal(!modal);
  const toggle_printing = () => setIsOpen(!isOpen);
  const toggle_message = () => setMessageOpen(!messageOpen);

  const change = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setUser((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const onUploaded = (e) => {
    setUser((prevState) => {
      return {
        ...prevState,
        profile_picture: e[0],
      };
    });
    return;
  };

  const updateUser = async () => {
    const { updateAccount } = props;
    const id = user.id;
    const userInfo = {
      FirstName: user.FirstName,
      LastName: user.LastName,
      username: user.username,
      email: user.email,
      profile_picture: user.profile_picture ? user.profile_picture.id : '',
      units: user.units,
      assembly_list: user.assembly_list,
      stiles: user.stiles,
      rails: user.rails,
      panels: user.panels,
      profiles: user.profiles,
      materials: user.materials,
      qc: user.qc
    };
    await updateAccount(cookie, id, userInfo);
    await login(cookie);
  };

  return (
    <div>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>Account Settings</CardTitle>
              <Row className="mb-3">
                <Col>
                  <Avatar
                    name="Foo Bar"
                    src={
                      user.profile_picture
                        ? user.profile_picture.url
                        : 'https://ombud.alaska.gov/wp-content/uploads/2018/01/no-user.jpg'
                    }
                    size="150"
                    round
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FileUploader onUploaded={onUploaded} multi={false} />
                </Col>
                <Col xs="8" />
              </Row>
              <Row className="mb-3">
                <Col>
                  <p>
                    <strong>Status:</strong>{' '}
                    {user && user.role && user.role.name}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label>First Name</Label>
                    <Input
                      value={user.FirstName}
                      name="FirstName"
                      onChange={(e) => change(e)}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input
                      value={user.LastName}
                      name="LastName"
                      onChange={(e) => change(e)}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormGroup>
                    <Label>Username</Label>
                    <Input
                      value={user.username}
                      name="username"
                      onChange={(e) => change(e)}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input
                      value={user.email}
                      name="email"
                      onChange={(e) => change(e)}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row className="mb-5">
                <Col>
                  <Button outline color="danger" onClick={toggle}>
                    Change Password
                  </Button>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <FormGroup>
                    <Label>Units</Label>
                    <br />
                    Fractions
                    <AppSwitch
                      className={'mx-1'}
                      variant={'pill'}
                      color={'primary'}
                      onChange={() =>
                        setUser((prevState) => {
                          return {
                            ...prevState,
                            units: !prevState.units,
                          };
                        })
                      }
                      checked={user.units}
                    />
                    Decimals
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Button
                    color="primary"
                    onClick={toggle_printing}
                    style={{ marginBottom: '1rem' }}
                  >
                    Printer Settings
                  </Button>
                  <Collapse isOpen={isOpen}>
                    <Card>
                      <CardBody>
                        <h3>Printer Settings</h3>
                        <p>Default Breakdown Pages Printed</p>
                        <Row>
                          <Col>
                            Assembly List:
                            <Input
                              value={user.assembly_list}
                              name="assembly_list"
                              type="number"
                              onChange={(e) => change(e)}
                            />
                          </Col>
                          <Col>
                            Stiles:
                            <Input
                              value={user.stiles}
                              name="stiles"
                              type="number"
                              onChange={(e) => change(e)}
                            />
                          </Col>
                          <Col>
                            Rails:
                            <Input
                              value={user.rails}
                              name="rails"
                              type="number"
                              onChange={(e) => change(e)}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            Panels:
                            <Input
                              value={user.panels}
                              name="panels"
                              type="number"
                              onChange={(e) => change(e)}
                            />
                          </Col>
                          <Col>
                            Profiles:
                            <Input
                              value={user.profiles}
                              name="profiles"
                              type="number"
                              onChange={(e) => change(e)}
                            />
                          </Col>
                          <Col>
                            Materials:
                            <Input
                              value={user.materials}
                              name="materials"
                              type="number"
                              onChange={(e) => change(e)}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            QC:
                            <Input
                              value={user.qc}
                              name="qc"
                              type="number"
                              onChange={(e) => change(e)}
                            />
                          </Col>
                          <Col />
                          <Col />
                        </Row>
                      </CardBody>
                    </Card>
                  </Collapse>
                </Col>
              </Row>

              {user && user.role && user.role.name === 'Administrator' ?
                <Row>
                  <Col>
                    <Button
                      color="primary"
                      onClick={toggle_message}
                      style={{ marginBottom: '1rem' }}
                    >
                                Message Center
                    </Button>
                    <Collapse isOpen={messageOpen}>
                      <Message />
                    </Collapse>
                  </Col>
                </Row> : null
              }

              
              

              <Row className="mt-5">
                <Col>
                  <Button color="primary" onClick={updateUser}>
                    Submit
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col />
      </Row>
      <LogOutModal modal={modal} toggle={toggle} email={user.email} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.users.user,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateAccount,
      login,
      forgotPassword,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
