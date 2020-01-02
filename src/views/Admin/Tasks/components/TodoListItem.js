import React, { Component } from "react";
import { MdDone } from "react-icons/md";

class TodoListItem extends React.Component {
    constructor(props) {
      super(props);
      this.onClickClose = this.onClickClose.bind(this);
      this.onClickDone = this.onClickDone.bind(this);
    }
    onClickClose() {
      var index = this.props.index;
      var id = this.props.id
      this.props.removeItem(index, id);
    }
    onClickDone() {
      var index = this.props.index;
      var id = this.props.id
      this.props.markTodoDone(index, id);
    }
    render() {
      console.log(this.props.item.done)
      var todoClass = this.props.item.done ? "done" : "undone";
      return (
        <li className="list-group-item ">
          <div className={todoClass}>
            <MdDone
            onClick={this.onClickDone}
            />
            {this.props.item.todo}
            <button type="button" className="close" onClick={this.onClickClose}>
              &times;
            </button>
          </div>
        </li>
      );
    }
  }

  export default TodoListItem;