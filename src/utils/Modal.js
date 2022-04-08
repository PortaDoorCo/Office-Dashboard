import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const ModalUtil = (props) => {
  const {
    className,
    modal,
    toggle,
    message,
    title,
    action,
    actionButton,
    isEdit,
  } = props;

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          {action && isEdit ? (
            <Button
              color={props.buttonColor ? props.buttonColor : 'primary'}
              onClick={action}
            >
              {actionButton}
            </Button>
          ) : null}

          <Button color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalUtil;
