import React from 'react';
// import DoorInfo from './components/DoorInfo/DoorInfo';
// import JobInfo from './components/JobInfo/JobInfo';
import 'react-notifications/lib/notifications.css';
import OrderEntry from './OrderEntry';

let Container = (props) => {
  return <OrderEntry isEdit={false} {...props} />;
};

export default Container;
