import React, { useState, Fragment, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  CardSubtitle,
  Table,

} from 'reactstrap';


const Cope_Door = ({ part }) => {

  return (
    <div>
      <Row>
        <Col xs="3">
          <FormGroup>
            <strong>
              <Label htmlFor="woodtype">Woodtype</Label>
            </strong>
            <Input
              placeholder={part.woodtype.NAME}
              disabled
            />
          </FormGroup>
        </Col>
        <Col xs="3">
          <FormGroup>
            <strong>
              <Label htmlFor="design">Design</Label>
            </strong>

            <Input placeholder={part.design.NAME} disabled />
          </FormGroup>
        </Col>
        <Col xs="3">
          <FormGroup>
            <strong>
              <Label htmlFor="edge">Edge</Label>
            </strong>
            <Input placeholder={part.edge.NAME} disabled />
          </FormGroup>
        </Col>
        <Col xs="3">
          <FormGroup>
            <strong>
              <Label htmlFor="mould">Mould</Label>
            </strong>
            <Input placeholder={part.profile.NAME} disabled />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col xs="4">
          <FormGroup>
            <strong>
              <Label htmlFor="panel">Panel</Label>
            </strong>
            <Input placeholder={part.panel.NAME} disabled />
          </FormGroup>
        </Col>

        <Col xs="4">
          <FormGroup>
            <strong>
              <Label htmlFor="grade-thickness">Applied Profile</Label>
            </strong>
            <Input placeholder={part.applied_profile.NAME} disabled />
          </FormGroup>
        </Col>

        <Col xs="4">
          <FormGroup>
            <strong>
              <Label htmlFor="finish">Finish</Label>
            </strong>
            <Input placeholder={part.finish.NAME} disabled />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col xs="4">
          <FormGroup>
            <strong>
              <Label for="exampleText">Job Notes</Label>
            </strong>
          </FormGroup>
        </Col>
      </Row>
    </div>
  )
};

export default Cope_Door;
