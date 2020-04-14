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
import MTDoor from './SideBar/MT/Door'
import CopeDF from './SideBar/Cope/DF'
import MiterDF from './SideBar/Miter/DF'

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


    if(part.orderType.value === "Door") {

      if(part.construction.value === "Cope") {
        return (
          <CopeDoor part={part} />
        )
      }

      else if(part.construction.value === "M") {
        return (
          <MiterDoor part={part} />
        )
      }

      else if(part.construction.value === "MT") {
        return (
          <MTDoor part={part} />
        )
      }

      else {
        return (
          <div />
        )
      }

    } else if (part.orderType.value === "DF") {

      if(part.construction.value === "Cope") {
        return (
          <CopeDF part={part} />
        )
      }

      if(part.construction.value === "M") {
        return (
          <MiterDF part={part} />
        )
      }



      else {
        return (
          <div />
        )
      }

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
