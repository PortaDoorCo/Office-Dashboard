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
import LoadingBar from 'react-redux-loading-bar';
import Background from '../../../assets/img/background-video.mp4';

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
        <video autoPlay muted loop id="myVideo">
          <source src={Background} type="video/mp4" />
        </video>
      
        <div>
          {/* <Navbar color="light" light expand="md">
            <NavbarBrand href="/">Porta Door Co. Inc.</NavbarBrand>
    
            <Button color="primary" className="ml-auto" onClick={this.logOut}>Log Out</Button>
        
          </Navbar> */}
      
          <div className="app flex-row align-items-center">
            <Container>
              <Row>
                <Col lg='9' />
                <Col>
              
                </Col>
              </Row>
              <Row className="justify-content-center" >
                <Col />
                <Col>
                  <center>

                    {/* <h5 style={{ margin: 'auto', color: 'white' }}>Please wait while loading...</h5> */}
                    <ReactLoading
                      type={'bubbles'}
                      color={'white'}
                      height={50}
                      width={50}
                    />
                  </center>
                </Col>
                <Col />
              </Row>
              {/* <Row className="mt-4">
                <Col>
         
                  <LoadingBar loading="1" updateTime={1500} maxProgress={95} progressIncrease={10} style={{ backgroundColor: 'white', height: '20px', opacity: '0.7' }} />
                </Col>
              </Row> */}

            </Container>
          </div>
        </div>
      </div>
    );
  }
}

export default Loader;
