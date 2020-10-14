import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import {
  Row,
  Col,
  Container,
  Button,
  Navbar,
  NavbarBrand,
} from 'reactstrap';
import { unsetToken } from '../../../utils/auth';
import LoadingBar from 'react-redux-loading-bar'

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
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Porta Door Co. Inc.</NavbarBrand>
    
          <Button color="primary" className="ml-auto" onClick={this.logOut}>Log Out</Button>
        
        </Navbar>
      
        <div className="app flex-row align-items-center">
          <Container>
            <Row>
              <Col lg='9' />
              <Col>
              
              </Col>
            </Row>
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
                  <h5 style={{ margin: 'auto' }}>Please wait while loading..</h5>

                </center>
              </Col>
              <Col />
            </Row>
            <Row className="mt-4">
              <Col>
                {/* loading bar */}
                <LoadingBar updateTime={1500} maxProgress={95} progressIncrease={10} style={{ backgroundColor: '#20a8d8', height: '20px', opacity: '0.7' }} />
              </Col>
            </Row>

          </Container>
        </div>
      </div>
    );
  }
}

export default Loader;
