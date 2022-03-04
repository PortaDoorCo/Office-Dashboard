import React, { Component, useCallback, useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { Row, Col, Container, Navbar, NavbarBrand } from 'reactstrap';
import { unsetToken } from '../../../utils/auth';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typical from 'react-typical';
import video_bg from '../../../assets/background-videos';
import axios from 'axios';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const Loader = (props) => {
  const [bgImage, setBgImage] = useState({});

  const logOut = () => {
    unsetToken().then(() => window.location.reload());
  };

  useEffect(() => {
    const callImage = async () => {
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?client_id=txfHTtPG93PHFGcKlzg2N00cczvVPwA0m54Y_P-P6_o&query=woodworking`
      );
      await setBgImage(
        res.data.results[Math.floor(Math.random() * 10)].urls.raw
      );
    };

    callImage();
  }, []);

  console.log({ bgImage });

  return (
    <div
      style={{ backgroundImage: `url(${bgImage})`, backgroundColor: '#F0F8FF' }}
    >
      {/* <video autoPlay muted loop id="myVideo">
        <source src={video_bg[getRandomInt(3)]} type="video/mp4" />
      </video> */}

      <div>
        <Navbar color="transparent" light expand="md">
          <NavbarBrand
            href="/"
            style={{
              color: 'white',
            }}
          >
            Porta Door Co. Inc.
          </NavbarBrand>

          <Tooltip title="Log Out" placement="bottom" className="ml-auto">
            <IconButton onClick={logOut}>
              <ExitToAppIcon
                style={{
                  width: '40',
                  height: '40',
                  fill: 'white',
                }}
              />
            </IconButton>
          </Tooltip>
        </Navbar>

        <div className="app flex-row align-items-center">
          <Container>
            <Row>
              <Col lg="9" />
              <Col></Col>
            </Row>
            <Row className="justify-content-center">
              <Col />
              <Col>
                <center>
                  <div
                    style={{
                      color: 'white',
                    }}
                  >
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
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Loader;
