import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { forgotPassword } from '../../../redux/users/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { unsetToken } from '../../../utils/auth';

const LogOutModal = props => {
  const { modal, toggle, className } = props;

  const [confirmed, setConfirmed] = useState(false);

  const changePassword = async () => {
    const { forgotPassword, user } = props;
    const userInfo = {
      'email': user.email
    };


    await forgotPassword(userInfo);
    await setConfirmed(true);

    setTimeout(function(){ 
      unsetToken().then(() => window.location.reload());
    }, 5000);
  };


  if (confirmed) {
    return (
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>You Will Be Logged Out</ModalHeader>
        <ModalBody>
          <p>Please Check Your Email. Be sure to check your spam folder.</p>
          <p>You will be logged out in 5 seconds...</p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  } else {
    return(
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Are You Sure?</ModalHeader>
        <ModalBody>
          <p>Are You Sure You Want To Change Your Password?</p>
          <p>You will be logged out...</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={changePassword}>Yes</Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );

  }


};

const mapStateToProps = state => ({
  user: state.users.user

});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      forgotPassword
    },
    dispatch
  );



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogOutModal);