import React from 'react';
import DoorModal from './DoorModal';
import DrawerModal from './DrawerModal';
import MiscModal from './MiscModal';
import FaceFrameModal from './FaceFrameModal';
import downloadPDF from '../../../utils/downloadPDF';

const Modal = (props) => {
  const { selectedOrder, formState } = props;

  const orderType = selectedOrder && selectedOrder.orderType;

  let printMaterial = formState
    ? formState
    : selectedOrder
    ? selectedOrder
    : null;

  switch (orderType) {
    case 'Door Order':
      return (
        <DoorModal
          {...props}
          printMaterial={printMaterial}
          downloadPDF={downloadPDF}
        />
      );
    case 'Drawer Order':
      return (
        <DrawerModal
          {...props}
          printMaterial={printMaterial}
          downloadPDF={downloadPDF}
        />
      );

    case 'Mouldings':
      return (
        <MiscModal
          {...props}
          printMaterial={printMaterial}
          downloadPDF={downloadPDF}
        />
      );

    case 'Misc Items':
      return (
        <MiscModal
          {...props}
          printMaterial={printMaterial}
          orderType={orderType}
          downloadPDF={downloadPDF}
        />
      );
    case 'Flat Stock':
      return (
        <MiscModal
          {...props}
          printMaterial={printMaterial}
          orderType={orderType}
          downloadPDF={downloadPDF}
        />
      );
    case 'Face Frame':
      return (
        <FaceFrameModal
          {...props}
          printMaterial={printMaterial}
          downloadPDF={downloadPDF}
        />
      );
    default:
      return <div />;
  }
};

export default Modal;
