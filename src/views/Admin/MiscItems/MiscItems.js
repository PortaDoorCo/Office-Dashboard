import React, { useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
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
