import React, { Component } from "react";
import TodoHeader from './ToDoHeader'
import TodoList from './TodoList'
import TodoForm from './TodoForm'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadTasks } from '../actions'
import { createTask, markDone, removeTask } from '../../../../redux/users/actions'

var todoItems = [];

class TodoApp extends React.Component {
    constructor(props) {
      super(props);
      this.addItem = this.addItem.bind(this);
      this.removeItem = this.removeItem.bind(this);
      this.markTodoDone = this.markTodoDone.bind(this);
      this.state = { todoItems: this.props.tasks };
    }
  
    componentDidMount() {
      // this.props.loadTasks()
      
    }
  
    addItem(todoItem) {
      const task = {
        todo: todoItem.newItemValue,
        user: this.props.user.id
      }
      this.props.createTask(task)
      // this.setState({ todoItems: todoItems });
   
    }
    removeItem(itemIndex, id) {
      this.props.removeTask(id)
    }
    markTodoDone(itemIndex, id) {
      // var todo = todoItems[itemIndex];
      // todoItems.splice(itemIndex, 1);
      // todo.done = !todo.done;
      // todo.done ? todoItems.push(todo) : todoItems.unshift(todo);
      // this.setState({ todoItems: todoItems });

      const done = {
        done: !this.props.tasks[itemIndex].done
      }

      this.props.markDone(id, done)
    }
    render() {
     
      return (
        <div id="main">
          <TodoHeader />
          <TodoList
            items={this.props.tasks}
            removeItem={this.removeItem}
            markTodoDone={this.markTodoDone}
          />
          <TodoForm addItem={this.addItem} />
        </div>
      );
    }
  }
  
  
  const mapStateToProps = (state, prop) => ({
    tasks: state.users.tasks,
    user: state.users.user
  });
  
  const mapDispatchToProps = dispatch => bindActionCreators({
    loadTasks,
    createTask,
    markDone,
    removeTask
  }, dispatch);
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(TodoApp);