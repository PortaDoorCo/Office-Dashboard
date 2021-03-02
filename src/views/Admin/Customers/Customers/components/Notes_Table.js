import React, { useState } from 'react';
import {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import {
  updateNotes,
  deleteNote,
} from '../../../../../redux/customers/actions';
import { reduxForm, change, getFormValues, arrayRemove } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Cookies from 'js-cookie';

const cookie = Cookies.get('jwt');

let Notes_Table = props =>  {

  const { formState, deleteNote, className } = props;
  const [modal, setModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);


  const toggle = () => {
    setModal(!modal);
  };

  const del = (id, index) => {
    props.dispatch(
      arrayRemove(
        'CustomerEdit',
        'Customer_Notes',
        index
      )
    );
    deleteNote(id, formState, cookie);
    toggle();
    

  };

  if (formState) {
    return (
      <div>
        <Modal isOpen={modal} toggle={toggle} className={className}>
          <ModalHeader toggle={toggle}>Are You Sure?</ModalHeader>
          <ModalBody>
              Are You Sure You Want To Delete This Item?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => del(selectedItemId, selectedItemIndex)}>
                Yes
            </Button>{' '}
            <Button color="primary" onClick={toggle}>
                No
            </Button>
          </ModalFooter>
        </Modal>
        <Table striped>
          <thead>
            <tr>
              <th>Date</th>
              <th>Notes</th>
              <th>Submitted By:</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {formState && formState.Customer_Notes
              ? formState.Customer_Notes.reverse().map((i, index) => (
                <tr key={index}>
                  <td width={250}>
                    {moment(i.date).format('MMMM Do YYYY, h:mm:ss a')}
                  </td>
                  <td>{i.note}</td>
                  <td>{i.Name}</td>
                  <td>
                    <Button
                      color="danger"
                      onClick={(e) => {
                        toggle();
                        setSelectedItemId(i.id);
                        setSelectedItemIndex(index);
                      }}
                    >
                          X
                    </Button>
                  </td>
                </tr>
              ))
              : null}
          </tbody>
        </Table>
      </div>
    );
  } else {
    return <div />;
  }
};


const mapStateToProps = (state, props) => ({
  formState: getFormValues('CustomerEdit')(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      change,
      updateNotes,
      deleteNote,
    },
    dispatch
  );

Notes_Table = reduxForm({
  form: 'CustomerEdit',
})(Notes_Table);

export default connect(mapStateToProps, mapDispatchToProps)(Notes_Table);
