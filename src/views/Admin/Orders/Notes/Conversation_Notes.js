import React, { Component } from 'react';
import { Row, Col, FormGroup, Label, Button } from 'reactstrap';
import { updateNotes } from '../../../../redux/orders/actions';
import { Field, reduxForm, change, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NotesTable from './Notes_Table';
import { renderField } from '../../../../components/RenderInputs/renderInputs';
import Cookies from 'js-cookie';

const cookie = Cookies.get('jwt');

class Conversation_Notes extends Component {
  submit = async (values) => {
    const { updateNotes, user } = this.props;

    const id = values.id;

    let order;

    if (values.Conversation_Notes) {
      order = {
        Conversation_Notes: values.Conversation_Notes,
        note: values.note,
        user: user.FirstName,
      };
    } else {
      order = {
        Conversation_Notes: [],
        note: values.note,
      };
    }

    if (values.note) {
      await updateNotes(id, order, user, cookie);

      if (values.Conversation_Notes) {
        await this.props.dispatch(
          change('Order', 'Conversation_Notes', [
            ...values.Conversation_Notes,
            {
              note: values.note,
              date: new Date(),
              user: user.FirstName,
            },
          ])
        );
        await this.props.dispatch(change('Order', 'note', ''));
      } else {
        await this.props.dispatch(
          change('Order', 'Conversation_Notes', [
            {
              note: values.note,
              date: new Date(),
              user: user.FirstName,
            },
          ])
        );
        await this.props.dispatch(change('Order', 'note', ''));
      }
    } else {
      alert('Please enter a value');
      return null;
    }
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit(this.submit)}>
          <Row>
            <Col>
              <NotesTable />
            </Col>
          </Row>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label for="exampleText">Conversation Notes</Label>
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
  formState: getFormValues('Order')(state),
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

Conversation_Notes = reduxForm({
  form: 'Order',
})(Conversation_Notes);

export default connect(mapStateToProps, mapDispatchToProps)(Conversation_Notes);
