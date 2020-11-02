import React, { useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import ProductCard from '../../components/Card';
import Cope from './Cope/Cope';
import MT from './MT/MT';
import Mitre from './Mitre/Mitre';
import CopePNG from './img/cope.png';
import mt_PNG from './img/MT_Doors.png';
import mitre_PNG from './img/Mitre.png';

const Selection = (props) => {

  const [subPage, setSubPage] = useState('index');

  let component;

  let index = (
    <div>
      <Row>
        <Col>
          <Button onClick={(e) => props.setHome('index')}>Home</Button>
        </Col>
      </Row>

      <Row>
        <Col xs='2' />
        <Col>
          <Row>
            <Col>
              <ProductCard title={'Cope and Stick'} img={CopePNG} setPage={setSubPage} page={'cope'} />
            </Col>
            <Col>
              <ProductCard title={'MT Doors'} img={mt_PNG} setPage={setSubPage} page={'mt'} />
            </Col>
            <Col>
              <ProductCard title={'Mitre Doors'} img={mitre_PNG} setPage={setSubPage} page={'m'} />
            </Col>
          </Row>
        </Col>
        <Col xs='2' />
      </Row>
      <Row>
        <Col xs='2' />
        <Col>
          <Row>
            <Col>
              <ProductCard title={'Face Frame'} img={CopePNG} setPage={setSubPage} page={'face_frame'} />
            </Col>
            <Col>
              <ProductCard title={'One Piece Door'} img={CopePNG} setPage={setSubPage} page={'cope'} />
            </Col>
            <Col>
              <ProductCard title={'Slab Type DF'} img={mitre_PNG} setPage={setSubPage} page={'slab_type_door'} />
            </Col>
          </Row>
        </Col>
        <Col xs='2' />
      </Row>
    </div>

  );




  switch (subPage) {
    case 'index':
      component = index;
      break;
    case 'cope':
      component = <Cope setHome={props.setHome} back={setSubPage} />;
      break;
    case 'mt':
      component = <MT setHome={props.setHome} back={setSubPage} />;
      break;
    case 'm':
      component = <Mitre setHome={props.setHome} back={setSubPage} />;
      break;
    case 'face_frame':
      component = <Cope setHome={props.setHome} back={setSubPage} />;
      break;
    case 'one_piece_door':
      component = <Cope setHome={props.setHome} back={setSubPage} />;
      break;
    case 'slab_type_door':
      component = <div />;
      break;
    default:
      component = <div />;
  }

  return (
    <div>
      {component}
    </div>
  );

};

export default Selection;