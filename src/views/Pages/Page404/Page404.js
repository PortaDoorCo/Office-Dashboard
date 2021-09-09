import React, { Component } from 'react';
import {Container, Row, Col, Button, Input, InputGroup} from 'reactstrap';

const Page404 = (props) => {
  return (
    <div className="app flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="6">
            <div className="clearfix">
              <h1 className="float-left display-3 mr-4">Uh oh!</h1>
              <h4 className="pt-3">The application has crashed</h4>
              <p className="text-muted float-left">Please try logging out and refreshing the app</p>
              <p className="text-muted float-right">If this does not fix the problem please contact support</p>
            </div>
            <InputGroup className="input-prepend float-right">
              <div className="input-group-append">
                <Button color="info">Contact Support</Button>
              </div>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
};



  

export default Page404;
