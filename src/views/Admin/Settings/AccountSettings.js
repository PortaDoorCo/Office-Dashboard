import React, { useState } from 'react'
import { Col, Row, Input, Card, CardBody, Form, FormGroup, Label, FormText, Button, CardTitle } from 'reactstrap'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AppSwitch } from '@coreui/react'
import Avatar from 'react-avatar';
import { FileUploader } from 'devextreme-react';
import Cookies from "js-cookie";

const cookie = Cookies.get("jwt");
const header = { 'Authorization': 'Bearer ' + cookie };


const AccountSettings = props => {

  const [user, setUser] = useState(props.user)


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

  return (
    <div>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle>Account Settings</CardTitle>
              <Form>
                <Row className="mb-3">
                  <Col>
                    <Avatar name="Foo Bar" src={user.profile_picture ? '' : 'https://ombud.alaska.gov/wp-content/uploads/2018/01/no-user.jpg'} size="150" round />
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
                    <Button outline color="danger" onClick={() => alert('change password')}>Change Password</Button>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <FormGroup>
                      <Label>Units</Label><br />
                      Fractions
                      <AppSwitch className={'mx-1'} variant={'pill'} color={'primary'} />
                      Decimals
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="mt-5">
                  <Col>
                    <Button color="primary">Submit</Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col />
      </Row>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.users.user

});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {

    },
    dispatch
  );



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountSettings);
