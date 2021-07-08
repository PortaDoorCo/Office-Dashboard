import React, { useState } from 'react';
import { Row, Col, Button, Input } from 'reactstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import db_url from '../../../../redux/db_url';

const cookie = Cookies.get('jwt');

const Message = props => {


  const [message, setMessage ] = useState('');


  const sendMessage = async () => {

    const m = {
      message: message
    };

    await axios.post(`${db_url}/messages/`, m,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );

    await setMessage('');
  };

  return (
    <div>
      <h3>Message Center</h3>
      <Row>
        <Col>
          <Input type="textarea" value={message} onChange={(e) => setMessage(e.target.value)} />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Button color="warning" onClick={sendMessage}>Submit</Button>
        </Col>
      </Row>

    </div>
  );
};

export default Message;