import React, { useState } from 'react';
import { Row, Col, Input } from 'reactstrap';

const Printer_Settings = () => {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <Row>
        <Col>
                Assembly List:
          <Input />
        </Col>
        <Col>
                Stiles:
          <Input />
        </Col>
        <Col>
                Rails:
          <Input />
        </Col>
      </Row>
      <Row>
        <Col>
                Panels:
          <Input />
        </Col>
        <Col>
                Profiles:
          <Input />
        </Col>
        <Col>
                Materials:
          <Input />
        </Col>
      </Row>
      <Row>
        <Col>
                QC:
          <Input />
        </Col>
        <Col />
        <Col />
      </Row>
    </div>
  );
};

export default Printer_Settings;