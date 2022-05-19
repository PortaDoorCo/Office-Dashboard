import Cookies from 'js-cookie';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Col, FormGroup, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { change, Field, getFormValues, reduxForm } from 'redux-form';
import { renderField } from '../../../../../components/RenderInputs/renderInputs';
import { updateNotes } from '../../../../../redux/customers/actions';
import NotesTable from './Notes_Table';

const cookie = Cookies.get('jwt');

class Customer_Notes extends Component {
  submit = async (values) => {
    const { updateNotes, user } = this.props;

    const id = values.id;

    let order;

    let noteId = Math.floor(Math.random() * 10000000);

    if (values.Customer_Notes) {
      order = {
        id: noteId,
        Customer_Notes: values.Customer_Notes,
        note: values.note,
        Name: user && user.FirstName,
      };
    } else {
      order = {
        id: noteId,
        Customer_Notes: [],
        note: values.note,
        Name: user && user.FirstName,
      };
    }

    if (values.note) {
      await updateNotes(id, order, cookie);

      if (values.Customer_Notes) {
        await this.props.dispatch(
          change('CustomerEdit', 'Customer_Notes', [
            ...values.Customer_Notes,
            {
              id: noteId,
              note: values.note,
              date: new Date(),
              Name: user && user.FirstName,
            },
          ])
        );
        await this.props.dispatch(change('CustomerEdit', 'note', ''));
      } else {
        await this.props.dispatch(
          change('CustomerEdit', 'Customer_Notes', [
            {
              id: noteId,
              note: values.note,
              date: new Date(),
              Name: user && user.FirstName,
            },
          ])
        );
        await this.props.dispatch(change('CustomerEdit', 'note', ''));
      }
    } else {
      alert('Please enter a value');
      return null;
    }
  };

  render() {
    const { handleSubmit, user } = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit(this.submit)}>
          <Row>
            <Col>
              <h3>Customer Notes</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              <NotesTable />
            </Col>
          </Row>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Field
                  name="note"
                  type="textarea"
                  component={renderField}
                  label="Notes"
                  edit={true}
                />
              </FormGroup>

              <div className="mt-3">
                <Button color="primary">Submit</Button>
              </div>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  formState: getFormValues('CustomerEdit')(state),
  user: state.users.user,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      change,
      updateNotes,
    },
    dispatch
  );

Customer_Notes = reduxForm({
  form: 'CustomerEdit',
})(Customer_Notes);

export default connect(mapStateToProps, mapDispatchToProps)(Customer_Notes);
