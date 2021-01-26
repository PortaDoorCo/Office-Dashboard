import React, {useState} from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

const WarningModal = (props) => {

  const { className, toggle, modal, warningType, twoWide, twoHigh, dispatch, change, } = props;

  const toggleAction = () => {
    const { value, tag, i, index } = warningType;
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

  const toggleCancel = () => {
    const { value, tag, i, index } = warningType;
    switch(tag) {
      case 'height':
        // code block
        if(value > 48) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              'NO GUARANTEE'
            ),
          );
        }
        toggle();
        break;
      case 'width':
        if(value > 48) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              'NO GUARANTEE'
            ),
          );
        }
        toggle();
        break;
      default:
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
        {warningType.sub_tag === 'width_less_than' ?
          <ModalFooter>
            <Button color="danger" onClick={toggle}>{warningType.deny}</Button>
          </ModalFooter>
          : 
          <ModalFooter>
            <Button color="primary" onClick={toggleAction}>{warningType.action}</Button>{' '}
            <Button color="danger" onClick={toggleCancel}>{warningType.deny}</Button>
          </ModalFooter>
        }

      </Modal>
    </div>
  );
};

export default WarningModal;