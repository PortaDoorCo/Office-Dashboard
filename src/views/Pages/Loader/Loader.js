import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import {
  Row,
  Col,
  Container
} from 'reactstrap';

class Loader extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {

    return (
      <div className="app flex-row align-items-center" style={{backgroundColor: 'black'}}>
        <Container>
          <Row className="justify-content-center">
            <Col />
            <Col>
              <center>
                <ReactLoading
                  type={'spinningBubbles'}
                  color={'black'}
                  height={300}
                  width={300}
                />
                <h5>Please wait while loading..</h5>
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
