import React from 'react';
import { Collapse } from 'reactstrap';
import MiscItems from '../../Orders/MiscItems';
import Photos from './Photos';

const MiscCollapse = (props) => {


  switch(props.subNavPage) {
    case 'misc':
      // code block
      return(
        <MiscItems {...props} /> 
      );
    case 'photos':
      // code block
      return(
        <Photos {...props} />
      );
    default:
      // code block
      return(
        <div />
      );
  }

};

export default MiscCollapse;