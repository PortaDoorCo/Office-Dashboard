import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import {
  Row,
  Col,
  Container,
  Navbar,
  NavbarBrand,
} from 'reactstrap';
import { unsetToken } from '../../../utils/auth';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typical from 'react-typical';
import video_bg from '../../../assets/background-videos';


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

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
          <source src={video_bg[getRandomInt(3)]} type="video/mp4" />
        </video>
      
        <div>
          <Navbar color="transparent" light expand="md">
            <NavbarBrand href="/" style={{color: 'white'}}>Porta Door Co. Inc.</NavbarBrand>

            
    
            {/* <Button color="primary" className="ml-auto" onClick={this.logOut}>Log Out</Button> */}

            <Tooltip title="Log Out" placement="bottom" className="ml-auto">
              <IconButton onClick={this.logOut}>
                <ExitToAppIcon style={{ width: '40', height: '40', fill:'white' }} />
              </IconButton>
            </Tooltip>
        
          </Navbar>
      
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
                    <div style={{ color: 'white' }}>
                      <Typical
                        steps={['Loading Databases...', 5000]}
                        loop={1}
                        wrapper="p"
                      
                      />
                    </div>
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
