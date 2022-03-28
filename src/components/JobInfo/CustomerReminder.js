import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const CustomerReminder = (props) => {
  const { className, modal, toggle, formState, orders } = props;

  // useEffect(() => {
  //   const id = formState?.job_info?.customer?.id;
  //   const companyOrders = orders.filter(
  //     (order) => order?.companyprofile?.id === id
  //   );

  //   const balanceDue = companyOrders.map((i) => {
  //     let updated_total = i.total;

  //     const balance = i.balance_history?.slice(0).map((i, index) => {
  //       updated_total =
  //         updated_total -
  //         parseFloat(i.balance_paid || 0) -
  //         parseFloat(i.deposit_paid || 0);
  //       return updated_total;
  //     });

  //     console.log({ updated_total });
  //   });

  //   console.log({ companyOrders });
  // }, [orders, formState?.job_info?.customer]);

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Customer Reminder</ModalHeader>
        <ModalBody>{formState?.job_info?.Notes}</ModalBody>
        <ModalFooter>
          {/* <Button color="primary" onClick={toggle}>Do Something</Button>{' '} */}
          <Button color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CustomerReminder;
