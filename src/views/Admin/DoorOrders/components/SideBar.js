import React, { Component } from 'react';
import CopeDoor from './SideBar/Cope/Door';
import MiterDoor from './SideBar/Miter/Door';
import MTDoor from './SideBar/MT/Door';
import CopeDF from './SideBar/Cope/DF';
import MiterDF from './SideBar/Miter/DF';
import MTDF from './SideBar/MT/DF';
import GlassDoor from './SideBar/Glass/Door';
import GlassDF from './SideBar/Glass/DF';

class SideBar extends Component {
  render() {

    const { part, i } = this.props;

    console.log('partt', part);

    let component;

    switch (part.orderType.value) {
      case 'Door':
        switch (part.construction.value) {
          case 'Cope':
            component = <CopeDoor part={part} i={i} />;
            break;
          case 'M':
            component = <MiterDoor part={part} i={i} />;
            break;
          case 'MT':
            component = <MTDoor part={part} i={i} />;
            break;
          case 'Glass':
            component = <GlassDoor part={part} i={i} />;
            break;
          default: 
            return;
        }
        break;
      case 'DF':
        switch (part.construction.value) {
          case 'Cope':
            component = <CopeDF part={part} i={i} />;
            break;
          case 'M':
            component = <MiterDF part={part} i={i} />;
            break;
          case 'MT':
            component = <MTDF part={part} i={i} />;
            break;
          case 'Glass':
            component = <GlassDF part={part} i={i} />;
            break;
          default:
            return;
        }
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
