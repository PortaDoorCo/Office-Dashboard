import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import CompanyDashboard from './CompanyDashboard/Dashboard';
import CustomerDashboard from './CustomerDashboard/Dashboard';
import QCDashboard from './QC_Dashboard/Dashboard';


const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

const Dashboard = ({ role }) => {

  switch(role.type) {
    case 'customer':
      return(
        <Suspense fallback={loading()}>
          <CustomerDashboard />
        </Suspense>
      );
    case 'quality_control':
      return (<Suspense fallback={loading()}>
        <QCDashboard />
      </Suspense>);

    default:
      return(<Suspense fallback={loading()}>
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