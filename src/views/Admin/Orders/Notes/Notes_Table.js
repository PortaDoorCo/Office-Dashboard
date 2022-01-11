import React, { Component } from 'react';
import { Row, Col, Input, FormGroup, Label, Button, Table } from 'reactstrap';
import { updateNotes } from '../../../../redux/orders/actions';
import { Field, reduxForm, change, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';




class Notes_Table extends Component {
  render() {

    const { formState, total } = this.props;

    if (formState) {

      return (
        <div>
          <Table striped>
            <thead>
              <tr>
                <th>Date</th>
                <th>Notes</th>

              </tr>
            </thead>
            <tbody>
              {(formState && formState.Conversation_Notes) ? formState.Conversation_Notes.reverse().map((i, index) => (
                <tr key={index}>
                  <td width={300}>{moment(i.date).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{i.note}</td>
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

  formState: getFormValues('Order')(state),


});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      change,
      updateNotes
    },
    dispatch
  );




export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes_Table);