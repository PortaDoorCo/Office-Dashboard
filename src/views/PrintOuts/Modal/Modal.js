import React from 'react';
import DoorModal from './DoorModal';
import DrawerModal from './DrawerModal';
import MiscModal from './MiscModal';
import FaceFrameModal from './FaceFrameModal';

const Modal = (props) => {
  const { selectedOrder } = props;

  const orderType = selectedOrder && selectedOrder.orderType;

  switch (orderType) {
    case 'Door Order':
      return <DoorModal {...props} />;
    case 'Drawer Order':
      return <DrawerModal {...props} />;

    case 'Mouldings':
      return <MiscModal {...props} />;

    case 'Misc Items':
      return <MiscModal {...props} orderType={orderType} />;
    case 'Face Frame':
      return <FaceFrameModal {...props} />;
    default:
      return <div />;
  }
};

export default Modal;
