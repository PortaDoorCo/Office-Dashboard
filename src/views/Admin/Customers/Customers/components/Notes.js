import React, { Component } from 'react';
import { Row, Col, FormGroup, Label, Button } from 'reactstrap';
import { updateNotes } from '../../../../../redux/customers/actions';
import { Field, reduxForm, change, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NotesTable from './Notes_Table';
import { renderField } from '../../../../../components/RenderInputs/renderInputs';
import Cookies from 'js-cookie';

const cookie = Cookies.get('jwt');



class Customer_Notes extends Component {


  submit = async (values) => {

    const { updateNotes, user } = this.props;

    const id = values.id;

    let order;

    let noteId = Math.floor(Math.random() * 10000000);

    if(values.Customer_Notes){
      order = {
        id: noteId,
        Customer_Notes: values.Customer_Notes,
        note: values.note,
        Name: user && user.FirstName
      };
    } else {
      order = {
        id: noteId,
        Customer_Notes: [],
        note: values.note,
        Name: user && user.FirstName
      };
    }

    if(values.note){
      await updateNotes(id, order, cookie);

      if(values.Customer_Notes){
        await this.props.dispatch(
          change(
            'CustomerEdit',
            'Customer_Notes',
            [
              ...values.Customer_Notes,
              {
                'id': noteId,
                'note': values.note,
                'date': new Date(),
                'Name': user && user.FirstName
              }
            ]
  
          )
        );
        await this.props.dispatch(
          change(
            'CustomerEdit',
            'note',
            ''
          )
        );
      } else {
        await this.props.dispatch(
          change(
            'CustomerEdit',
            'Customer_Notes',
            [
              {
                'id': noteId,
                'note': values.note,
                'date': new Date(),
                'Name': user && user.FirstName
              }
            ]
  
          )
        );
        await this.props.dispatch(
          change(
            'CustomerEdit',
            'note',
            ''
          )
        );
      }

    } else {
      alert('Please enter a value');
      return null;
    }
  }



  render() {

    const { handleSubmit, user } = this.props;

    console.log({user});

    return (
      <div>
        <form onSubmit={handleSubmit(this.submit)}>
          <Row>
            <Col>
              <NotesTable />
            </Col>
          </Row>
          <Row>
            <Col xs='6'>
              <FormGroup>
                <Label for="exampleText">Customer Notes</Label>
                <Field
                  name='note'
                  type="textarea"
                  component={renderField}
                  label="Notes" />
              </FormGroup>

              <div className="mt-3">
                <Button color='primary'>Submit</Button>
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
  user: state.users.user


});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      change,
      updateNotes
    },
    dispatch
  );

Customer_Notes = reduxForm({
  form: 'CustomerEdit',
})(Customer_Notes);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Customer_Notes);