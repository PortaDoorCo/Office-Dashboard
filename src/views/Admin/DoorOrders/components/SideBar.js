import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';
import CopeDoor from './SideBar/Cope/Door'
import MiterDoor from './SideBar/Miter/Door'

const style = {
  margin: 'auto',
  width: '100%',
  height: 'auto'
};

const comingSoon =
  'https://res.cloudinary.com/porta-door/image/upload/v1567619819/d4apmwwcrqmpe3tilboe.png';

class SideBar extends Component {
  render() {

    const { part } = this.props;

    console.log(part)

    if(part.orderType.value === "Door") {

      if(part.construction.value === "Cope") {
        return (
          <CopeDoor part={part} />
        )
      }

      if(part.construction.value === "M") {
        return (
          <MiterDoor part={part} />
        )
      }

    } else if (part.orderType.value === "DF") {

    } else if (part.orderType.value === "Face_Frame") {

    } else if (part.orderType.value === "One_Piece") {

    } else if (part.orderType.value === "Slab") {

    } else {
      return (
        <div />
      );
    }
  }
}

export default SideBar;
