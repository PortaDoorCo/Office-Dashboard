import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import numQty from 'numeric-quantity';

const WarningModal = (props) => {

  const { className, toggle, modal, warningType, twoWide, twoHigh, dispatch, change, prices } = props;

  

  const toggleAction = () => {
    const { value, tag, index } = warningType;
    switch(tag) {
      case 'height':
        if(value >= 48) {
          twoHigh(index, null, 2);
        }
        toggle();
        break;
      case 'width':
        if(value >= 24) {
          twoWide(index, null, 2);
        }
        toggle();
        break;
      default:
        toggle();
        return;
    }
  };

  const toggleCancel = () => {
    const { value, tag, i, index, part } = warningType;
    switch(tag) {
      case 'height':
        // code block
        if(numQty(value) >= 48) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              'OVERSIZE - NO GUARANTEE'
            )
          );
        }
        toggle();
        break;
      case 'width':
        if(numQty(value) >= 24) {
          dispatch(
            change(
              'DoorOrder',
              `part_list[${i}].dimensions[${index}].notes`,
              'OVERSIZE - NO GUARANTEE'
            )
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