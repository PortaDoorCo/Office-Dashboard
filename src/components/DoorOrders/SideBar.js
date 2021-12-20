import React, { Component } from 'react';
import Door from './SideBar/Door/Door';
import DF from './SideBar/DF/DF';


class SideBar extends Component {
  render() {

    const { part, i } = this.props;

    let component;

    switch (part?.orderType?.value) {
      case 'Door':
        component = <Door part={part} i={i} />;
        break;
      case 'DF':
        component = <DF part={part} i={i} />;
        break;
      case 'Face_Frame':
        component = <div />;
        break;
      case 'One_Piece':
        component = <div />;
        break;
      case 'Slab_Door':
        component = <div />;
        break;
      default:
        component = <div />;
    }

    return (
      <div>
        {component}
      </div>
    );
  }
}

export default SideBar;
