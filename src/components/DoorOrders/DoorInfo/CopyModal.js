import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const CopyModal = (props) => {
  const {
    className,
    toggle,
    modal,
    copy,
    type
  } = props;

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Copy?</ModalHeader>
        <ModalBody>
          Do you want to copy attributes?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => copy(type)}>Yes</Button>{' '}
          <Button color="danger" onClick={() => copy(null)}>No</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CopyModal;