import React from 'react';
import { NotificationManager } from 'react-notifications';
// import DoorInfo from './components/DoorInfo/DoorInfo';
// import JobInfo from './components/JobInfo/JobInfo';
import 'react-notifications/lib/notifications.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  reduxForm
} from 'redux-form';
import validate from './components/validate';


let Container = (props) => {




};

const mapStateToProps = (state) => ({

});
  
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {

    },
    dispatch
  );
  
// eslint-disable-next-line no-class-assign
Container = reduxForm({
  form: 'Order',
  enableReinitialize: true,
  validate,
  onSubmitFail: (errors, dispatch, submitError, props) => {
    const job_info_message = 'You are missing required info';
    if (errors) {
      NotificationManager.error(job_info_message, 'Error', 2000);
    }
  },
})(Container);
  
export default connect(mapStateToProps, mapDispatchToProps)(Container);