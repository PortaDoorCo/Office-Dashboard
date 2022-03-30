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

const Scheduler = (props) => {
  const {
    handleCardMove,
    handleMouseDown,
    handleMouseUp,
    controlledBoard,
    setBoard,
  } = props;

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
            <Button color="primary">Submit Schedule</Button>
          </Col>
        </Row>

        <Row>
          <Col className="d-flex justify-content-end">
            <Dates {...props} />
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
              renderCard={(
                { title, description, job_info },
                { removeCard, dragging }
              ) => (
                <Card
                  style={{ width: '600px' }}
                  dragging={dragging}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                >
                  <h4>{title}</h4>
                  <p>{job_info?.customer?.Company}</p>
                  <p>{job_info?.Address1}</p>
                  <p>{job_info?.Address2}</p>
                  <p>{job_info?.City}</p>
                  <p>{job_info?.State}</p>
                  <p>{job_info?.Zip}</p>
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
};

export default Scheduler;
