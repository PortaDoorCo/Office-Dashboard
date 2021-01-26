import React, {useState} from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

const WarningModal = (props) => {

  const { className, toggle, modal, warningType, twoWide, twoHigh } = props;

  const toggleAction = () => {
    const { value, tag, index } = warningType;
    switch(tag) {
      case 'height':
        // code block
        if(value > 48) {
          twoHigh(index, null, 2);
        }
        toggle();
        break;
      case 'width':
        // code block
        if(value > 48) {
          twoWide(index, null, 2);
        }
        toggle();
        break;
      default:
        // code block
        toggle();
        return;
    }
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>{warningType.title}</ModalHeader>
        <ModalBody>
          {warningType.message}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleAction}>{warningType.action}</Button>{' '}
          <Button color="danger" onClick={toggle}>{warningType.deny}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default WarningModal;