import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MiscItems from '../../../components/DoorOrders/MiscItems';

const ModalExample = (props) => {
  const {
    buttonLabel,
    className
  } = props;

  return (
    <div>
      <Modal isOpen={props.subNavModal} toggle={props.onSubNav} className={className}>
        <ModalHeader toggle={props.onSubNav}>Modal title</ModalHeader>
        <ModalBody>

          <MiscItems />

          
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => props.onSubNav()}>Do Something</Button>{' '}
          <Button color="secondary" onClick={() => props.onSubNav()}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalExample;