import React from 'react';
import { connect } from 'react-redux';
import CompanyDashboard from './CompanyDashboard/Dashboard';
import CustomerDashboard from './CustomerDashboard/Dashboard';

const Dashboard = ({ role }) => {
  if(role.type === 'customer'){
    return <CustomerDashboard />;
  } else {
    return <CompanyDashboard />;
  }
};

const mapStateToProps = (state, prop) => ({

  role: state.users.user.role,

});
  

  
export default connect(
  mapStateToProps,
  null
)(Dashboard);