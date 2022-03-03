import React from 'react';
import Maps from '../../../components/Maps/Maps';
import Table from './Table';
import Scheduler from './Scheduler';
import Dates from './Dates';

const Deliveries = (props) => {
  return (
    <div>
      <Dates />
      <Maps />
      <Scheduler />
      {/* <Table /> */}
    </div>
  );
};

export default Deliveries;
