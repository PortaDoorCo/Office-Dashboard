import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import numQty from 'numeric-quantity';

const WarningModal = (props) => {
  const {
    className,
    toggle,
    modal,
    warningType,
    twoWide,
    twoHigh,
    dispatch,
    change,
    prices,
    formState, // Assume you pass formState as a prop
  } = props;

  const appendNotes = (i, index, newNote) => {
    const currentNotes =
      formState?.part_list[i]?.dimensions[index]?.notes || '';

    // Check if the note is already in the current notes
    if (!currentNotes.includes(newNote)) {
      const updatedNotes = currentNotes
        ? `${currentNotes} | ${newNote}`
        : newNote;

      dispatch(
        change(
          'Order',
          `part_list[${i}].dimensions[${index}].notes`,
          updatedNotes
        )
      );
    }
  };

  const toggleAction = () => {
    const { value, tag, index } = warningType;
    switch (tag) {
      case 'height':
        if (numQty(value) >= 48) {
          twoHigh(index, null, 2);
        }
        toggle();
        break;
      case 'width':
        if (numQty(value) >= 24) {
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
    switch (tag) {
      case 'height':
        if (
          numQty(value) >= 48 &&
          numQty(formState?.part_list[i]?.dimensions[index]?.panelsH) < 2
        ) {
          appendNotes(i, index, 'SINGLE - NO GUARANTEE');
        }
        toggle();
        break;
      case 'width':
        if (
          numQty(value) >= 24 &&
          numQty(formState?.part_list[i]?.dimensions[index]?.panelsW) < 2
        ) {
          appendNotes(i, index, 'SINGLE - NO GUARANTEE');
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
        <ModalBody>{warningType.message}</ModalBody>
        {warningType.sub_tag === 'width_less_than' ||
        warningType.sub_tag === 'no_unequal_panels' ? (
          <ModalFooter>
            <Button color="danger" onClick={toggle}>
              {warningType.deny}
            </Button>
          </ModalFooter>
        ) : (
          <ModalFooter>
            <Button color="primary" onClick={toggleAction}>
              {warningType.action}
            </Button>{' '}
            <Button color="danger" onClick={toggleCancel}>
              {warningType.deny}
            </Button>
          </ModalFooter>
        )}
      </Modal>
    </div>
  );
};

export default WarningModal;
