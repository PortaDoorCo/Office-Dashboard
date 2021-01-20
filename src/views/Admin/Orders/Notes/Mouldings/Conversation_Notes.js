import React, { Component } from 'react';
import { Row, Col, Input, FormGroup, Label, Button } from 'reactstrap';
import { updateNotes } from '../../../../../redux/orders/actions';
import { Field, reduxForm, change, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Notes_Table from './Notes_Table';
import { renderField } from '../../../../../components/RenderInputs/renderInputs';
import Cookies from 'js-cookie';

const cookie = Cookies.get('jwt');



class Conversation_Notes extends Component {


  submit = async (values) => {

    const { updateNotes } = this.props;

    const id = values.id;

    let order;

    if(values.Conversation_Notes){
      order = {
        Conversation_Notes: values.Conversation_Notes,
        note: values.note,
      };
    } else {
      order = {
        Conversation_Notes: [],
        note: values.note,
      };
    }


    if(values.note){
      await updateNotes(id, order, cookie);

      if(values.Conversation_Notes){
        await this.props.dispatch(
          change(
            'Mouldings',
            'Conversation_Notes',
            [
              ...values.Conversation_Notes,
              {
                'note': values.note,
                'date': new Date()
              }
            ]
  
          )
        );
      } else {
        await this.props.dispatch(
          change(
            'Mouldings',
            'Conversation_Notes',
            [
              {
                'note': values.note,
                'date': new Date()
              }
            ]
  
          )
        );
      }
    } else {
      alert('Please enter a value');
      return null;
    }
  }



  render() {

    const { handleSubmit } = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit(this.submit)}>
          <Row>
            <Col>
              <Notes_Table />
            </Col>
          </Row>
          <Row>
            <Col xs='6'>
              <FormGroup>
                <Label for="exampleText">Conversation Notes</Label>
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

  formState: getFormValues('Mouldings')(state),


});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      change,
      updateNotes
    },
    dispatch
  );

Conversation_Notes = reduxForm({
  form: 'Mouldings',
})(Conversation_Notes);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Conversation_Notes);