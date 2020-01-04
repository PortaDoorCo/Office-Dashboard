import React, { Component } from "react";
import TodoListItem from './TodoListItem'

class TodoList extends React.Component {
    constructor(props){
      super(props)
    }

    render() {
      var items = this.props.items.map((item, index) => {
    
        return (
          <TodoListItem
            key={item._id}
            item={item}
            index={index}
            id={item._id}
            removeItem={this.props.removeItem}
            markTodoDone={this.props.markTodoDone}
          />
        );
      });
      return <ul className="list-group"> {items} </ul>;
    }
  }

  export default TodoList;