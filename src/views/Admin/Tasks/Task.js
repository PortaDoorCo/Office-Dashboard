import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  CardSubtitle,
  Table,
  Badge
} from "reactstrap";

import TodoApp from './components/ToDoApp'

/*
Todo app structure

TodoApp
	- TodoHeader
	- TodoList
    - TodoListItem #1
		- TodoListItem #2
		  ...
		- TodoListItem #N
	- TodoForm
*/
var todoItems = [];
todoItems.push({ index: 1, value: "learn react", done: false });
todoItems.push({ index: 2, value: "saksldjaskldj", done: true });
todoItems.push({ index: 3, value: "buy flowers", done: true });






class Tasks extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="animated">
        <Row>
          <Col xs="6" lg="6">
            <Card>
              <CardHeader>
                <i className="icon-menu" />
                Tasks
                <div className="card-actions"></div>
              </CardHeader>
              <CardBody>
                <TodoApp initItems={todoItems} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Tasks;
