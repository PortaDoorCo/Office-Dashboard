import React, { Component } from 'react';
import {  Button, Table } from 'reactstrap';
import { updateNotes, deleteNote } from '../../../../../redux/customers/actions';
import { reduxForm, change, getFormValues, arrayRemove } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Cookies from 'js-cookie';

const cookie = Cookies.get('jwt');

class Notes_Table extends Component {
  render() {

    const { formState, deleteNote } = this.props;

    if (formState) {

      return (
        <div>
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
              {(formState && formState.Customer_Notes) ? formState.Customer_Notes.reverse().map((i, index) => (
                <tr key={index}>
                  <td width={250}>{moment(i.date).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{i.note}</td>
                  <td>{i.Name}</td>
                  <td><Button color="danger" onClick={() => (this.props.dispatch(arrayRemove('CustomerEdit', 'Customer_Notes', index)),deleteNote(i.id,formState, cookie))}>X</Button></td>
                </tr>
              )) : null}
            </tbody>
          </Table>

        </div>
      );
    } else {
      return (
        <div />
      );
    }
  }
}


const mapStateToProps = (state, props) => ({
  formState: getFormValues('CustomerEdit')(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      change,
      updateNotes,
      deleteNote
    },
    dispatch
  );

Notes_Table = reduxForm({
  form: 'CustomerEdit',
})(Notes_Table);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes_Table);