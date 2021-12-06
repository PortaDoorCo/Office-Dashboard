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
import OrderEntry from './OrderEntry';


let Container = (props) => {

  return(
    <OrderEntry isEdit={false} {...props} />
  );



};

  
export default Container;