import React from 'react';
import { Row, Col } from 'reactstrap';
import MiscItemComponent from './components/MiscItemsComponent';

const MiscItems = () => {

  return (
    <div>
      <Row>
        <Col>
          <MiscItemComponent />  
        </Col>
      </Row>
    </div>
  );
};

export default MiscItems;
