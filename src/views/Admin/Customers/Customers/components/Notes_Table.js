import Cookies from 'js-cookie';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  Button, Modal, ModalBody,
  ModalFooter, ModalHeader, Table
} from 'reactstrap';
import { bindActionCreators } from 'redux';
import { arrayRemove, change, getFormValues, reduxForm } from 'redux-form';
import {
  deleteNote, updateNotes
} from '../../../../../redux/customers/actions';

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
              <th width={'35%'} style={{ fontSize: 11 }}>Date</th>
              <th width={'40%'} style={{ fontSize: 11 }}>Notes</th>
              <th width={'30%'} style={{ fontSize: 11 }}>Submitted By:</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {formState && formState.Customer_Notes
              ? formState.Customer_Notes.reverse().map((i, index) => (
                <tr key={index}>
                  <td width={'35%'} style={{ fontSize: 11 }}>
                    {moment(i.date).format('MMMM D YY, h:mm a')}
                  </td>
                  <td width={'40%'} style={{ fontSize: 11 }}>{i.note}</td>
                  <td width={'30%'} style={{ fontSize: 11 }}>{i.Name}</td>
                  <td>
                    <Button
                      color="danger"
                      className="btn-circle"
                      
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
