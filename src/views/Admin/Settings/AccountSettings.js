import React, { useState } from 'react'
import { Col, Row, Input, Card, CardBody, FormGroup, Label, Button, CardTitle } from 'reactstrap'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AppSwitch } from '@coreui/react'
import Avatar from 'react-avatar';
import { FileUploader } from 'devextreme-react';
import Cookies from "js-cookie";
import { updateAccount, login, forgotPassword } from '../../../redux/users/actions'
import LogOutModal from './LogOutModal'


const cookie = Cookies.get("jwt");
const header = { 'Authorization': 'Bearer ' + cookie };


const AccountSettings = props => {

  const [user, setUser] = useState(props.user)
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const change = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setUser((prevState) => {
      return ({
        ...prevState,
        [name]: value
      })
    })
  }

  const onUploaded = (e) => {
    const data = JSON.parse(e.request.response);
    setUser((prevState) => {
      return ({
        ...prevState,
        profile_picture: data[0]
      })
    })
    return
  }

  const updateUser = async () => {
    const { updateAccount } = props;
    const id = user.id
    const userInfo = {
      FirstName: user.FirstName,
      LastName: user.LastName,
      username: user.username,
      email: user.email,
      profile_picture: user.profile_picture ? user.profile_picture.id : '',
      units: user.units
    }
    await updateAccount(cookie, id, userInfo)
    await login(cookie)
  }



  return (
    <div>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>Account Settings</CardTitle>
              <Row className="mb-3">
                <Col>
                  <Avatar name="Foo Bar" src={user.profile_picture ? user.profile_picture.url : 'https://ombud.alaska.gov/wp-content/uploads/2018/01/no-user.jpg'} size="150" round />
                </Col>
              </Row>
              <Row>
                <Col>
                  <form id="form" method="post" action="" encType="multipart/form-data">
                    <FileUploader name="files" uploadMode="instantly" onUploaded={onUploaded} uploadHeaders={header} uploadUrl="https://server.portadoor.com/upload" />
                  </form>
                </Col>
                <Col xs='8' />
              </Row>
              <Row className="mb-3">
                <Col>
                  <p><strong>Status:</strong> {user.role.name}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label>First Name</Label>
                    <Input value={user.FirstName} name="FirstName" onChange={(e) => change(e)} />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input value={user.LastName} name="LastName" onChange={(e) => change(e)} />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormGroup>
                    <Label>Username</Label>
                    <Input value={user.username} name="username" onChange={(e) => change(e)} />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input value={user.email} name="email" onChange={(e) => change(e)} />
                  </FormGroup>
                </Col>
              </Row>

              <Row className="mb-5">
                <Col>
                  <Button outline color="danger" onClick={toggle}>Change Password</Button>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormGroup>
                    <Label>Units</Label><br />
                      Fractions
                      <AppSwitch className={'mx-1'} variant={'pill'} color={'primary'} onChange={() => setUser((prevState) => {
                      return ({
                        ...prevState,
                        units: !prevState.units
                      })
                    })} checked={user.units} />
                      Decimals
                    </FormGroup>
                </Col>
              </Row>

              <Row className="mt-5">
                <Col>
                  <Button color="primary" onClick={updateUser}>Submit</Button>
                </Col>
              </Row>

            </CardBody>
          </Card>
        </Col>
        <Col />
      </Row>
      <LogOutModal modal={modal} toggle={toggle} email={user.email} />
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.users.user

});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateAccount,
      login,
      forgotPassword
    },
    dispatch
  );



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountSettings);
