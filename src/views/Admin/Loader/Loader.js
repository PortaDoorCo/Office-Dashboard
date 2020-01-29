import React, { Component } from "react";
import ReactLoading from "react-loading";
import {
  Row,
  Col,
  Container,
  Button
} from "reactstrap";
import { unsetToken } from "../../../utils/auth";

class Loader extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  logOut = () => {
    unsetToken().then(() => window.location.reload());
  };

  render() {

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row>
            <Col lg='9' />
            <Col>
              <Button color="primary" className="mr-5" onClick={this.logOut}>Log Out</Button>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col />
            <Col>
              <center>
                <ReactLoading
                  type={"spinningBubbles"}
                  color={"black"}
                  height={300}
                  width={300}
                />
                <h5 style={{ margin: 'auto' }}>Please wait while loading..</h5>

              </center>
            </Col>
            <Col />
          </Row>

        </Container>
      </div>
    );
  }
}

export default Loader;
