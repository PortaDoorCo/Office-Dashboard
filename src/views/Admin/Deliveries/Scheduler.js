import React, { useState } from 'react';
import Board, { moveCard } from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';
import {
  Button,
  Row,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import { Card } from 'antd';
import moment from 'moment';
import states from './states';
import Dates from './Dates';
// Use your own styles to override the default styles
// import "./styles.css";

const board = {
  columns: [
    {
      id: 1,
      title: 'Ready to Ship',
      cards: [
        {
          id: 1,
          title: 'Card title 1',
          description: 'Card content',
        },
        {
          id: 2,
          title: 'Card title 2',
          description: 'Card content',
        },
        {
          id: 3,
          title: 'Card title 3',
          description: 'Card content',
        },
      ],
    },
    {
      id: 2,
      title: `${moment().format('M/D/YYYY')} - Deliveries`,
      cards: [
        {
          id: 9,
          title: 'Card title 9',
          description: 'Card content',
        },
      ],
    },
  ],
};

function ControlledBoard() {
  // You need to control the state yourself.
  const [controlledBoard, setBoard] = useState(board);

  let clickHoldTimer = null;

  const handleMouseDown = () => {
    console.log('press');
    clickHoldTimer = setTimeout(() => {
      //Action to be performed after holding down mouse
    }, 1000); //Change 1000 to number of milliseconds required for mouse hold
  };

  const handleMouseUp = () => {
    console.log('stop');
    clearTimeout(clickHoldTimer);
  };

  function handleCardMove(_card, source, destination) {
    const updatedBoard = moveCard(controlledBoard, source, destination);
    setBoard(updatedBoard);
  }

  return (
    <div>
      <Container
        style={{
          background: '#FBFBFB',
          maxWidth: '90%',
          borderRadius: '25px',
          padding: '20px',
        }}
        className="mt-3"
      >
        <Row className="mb-2">
          <Col>
            <h1>Shipping Schedule for {moment().format('M/D/YYYY')}</h1>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button color="primary">Submit</Button>
          </Col>
        </Row>

        <Row>
          <Col className="d-flex justify-content-end">
            <Dates />
          </Col>
        </Row>

        <Row>
          {/* <Col /> */}
          <Col className="d-flex justify-content-end">
            <FormGroup style={{ height: '100%', width: '10%' }}>
              <Label>Select Shipping State</Label>
              <Input
                type="select"
                name="select"
                id="status_dropdown"
                defaultValue="Quote"
              >
                {' '}
                {states.map((i, index) => (
                  <option key={index} value={i.title}>
                    {i.title}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <Board
              onCardDragEnd={handleCardMove}
              disableColumnDrag
              renderCard={({ title }, { removeCard, dragging }) => (
                <Card
                  style={{ width: '400px' }}
                  dragging={dragging}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                >
                  {title}
                </Card>
              )}
            >
              {controlledBoard}
            </Board>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function Scheduler() {
  return (
    <>
      <ControlledBoard />
    </>
  );
}

export default Scheduler;
