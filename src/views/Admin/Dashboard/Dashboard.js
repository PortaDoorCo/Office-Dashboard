import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import CompanyDashboard from './CompanyDashboard/Dashboard';
import CustomerDashboard from './CustomerDashboard/Dashboard';

const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

const Dashboard = ({ role }) => {
  if(role.type === 'customer'){
    return (
      <Suspense fallback={loading()}>
        <CustomerDashboard />
      </Suspense>
    );
  } else {
    return (
      <Suspense fallback={loading()}>
        <CompanyDashboard />
      </Suspense>);
  }
};

const mapStateToProps = (state, prop) => ({

  role: state.users.user.role,

});
  

  
export default connect(
  mapStateToProps,
  null
)(Dashboard);