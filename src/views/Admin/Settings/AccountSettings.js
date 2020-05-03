import React from 'react'
import { Col, Row, Input, Card, CardBody, Form, FormGroup, Label, FormText, Button, CardTitle } from 'reactstrap'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AppSwitch } from '@coreui/react'
import Avatar from 'react-avatar';



const AccountSettings = props => {

  
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
                    <Avatar name="Foo Bar" src={"https://scontent.fphx1-2.fna.fbcdn.net/v/t1.0-9/12112383_10205202385274443_1374108948203053228_n.jpg?_nc_cat=100&_nc_sid=09cbfe&_nc_ohc=vNlkn60oggUAX_xmmcK&_nc_ht=scontent.fphx1-2.fna&oh=689ac33fdd5769641f997e1e4276a5ad&oe=5ED1D3F2"} size="150" round />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>First Name</Label>
                      <Input type="text" name="name" id="account_name" placeholder="Justin" />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Last Name</Label>
                      <Input type="text" name="name" id="account_name" placeholder="Romanos" />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <FormGroup>
                      <Label>Username</Label>
                      <Input type="text" name="name" id="account_name" placeholder="heyjaypray" />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Email</Label>
                      <Input type="text" name="name" id="account_name" placeholder="hey@jaypray.com" />
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="mb-5">
                  <Col>
                    <Button outline color="danger" onClick={()=>alert('change password')}>Change Password</Button>
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
