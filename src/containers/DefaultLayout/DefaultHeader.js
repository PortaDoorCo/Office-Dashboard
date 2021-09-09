import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import DefaultHeaderDropdown  from './DefaultHeaderDropdown';
import logo from '../../assets/img/brand/portadoor.png';
import sygnet from '../../assets/img/brand/sygnet.svg';
import { unsetToken } from '../../utils/auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RefreshIcon from '@material-ui/icons/Refresh';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

import {
  loadAllOrders,
  getDeliveries,
  socketReceiveUpdateStatus
} from '../../redux/orders/actions';
import {
  loadMiscItems,
  loadShippingMethod,
  loadPaymentTypes,
  loadPaymentTerms,
} from '../../redux/misc_items/actions';
import {
  loadSales,
} from '../../redux/sales/actions';

import { loadAllCustomers, dbNotLoaded } from '../../redux/customers/actions';

import {
  getAllProducts,
  getBreakdowns,
  getBoxBreakdowns,
  getPricing
} from '../../redux/part_list/actions';

import Cookies from 'js-cookie';
import CloudDone from '@material-ui/icons/CloudDone';
import { withStyles } from '@material-ui/core/styles';


const propTypes = {
  children: PropTypes.node,
};

const useStyles = theme => ({
  customWidth: {
    maxWidth: 500,
  },
});

const updateMessage = 'There is a new version available!   Click here to refresh the page.';


const defaultProps = {};

class DefaultHeader extends Component {

  logOut = () => {
    unsetToken().then(() => window.location.reload());
  };

  refresh = async () => {
    const {
      loadShippingMethod,
      loadPaymentTypes,
      loadPaymentTerms,
      getBreakdowns,
      getBoxBreakdowns,
      getPricing,
      getUsers,
      login,
      loadSales,
      loadAllOrders,
      getDeliveries,
      loadAllCustomers,
      loadMiscItems,
      getAllProducts,
      dbNotLoaded
    } = this.props;

    const cookie = await Cookies.get('jwt');

    if (cookie) {
      await dbNotLoaded(cookie);
      await getAllProducts(cookie);
      await loadAllOrders(cookie);
      await loadAllCustomers(cookie);
      await loadSales(cookie);
      await loadMiscItems(cookie);
      await getDeliveries(cookie);
      await getPricing(cookie);
      await getBreakdowns(cookie);
      await getBoxBreakdowns(cookie);
      await loadShippingMethod(cookie);
      await loadPaymentTypes(cookie);
      await loadPaymentTerms(cookie);
    } else {
      alert('not logged in');
    }
  }

  
  

  render() {

    // eslint-disable-next-line
    const { dbLoadComplete, currentVersion, classes ,children, ...attributes  } = this.props;



    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 50, height: 50, alt: 'Porta Door Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'Porta Door Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/dashboard" className="nav-link" >Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink to="/users" className="nav-link">Users</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink to="/settings" className="nav-link">Settings</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          
          {/* <DefaultHeaderDropdown notif/>
          <DefaultHeaderDropdown tasks/>
          <DefaultHeaderDropdown mssgs/>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-location-pin"></i></NavLink>
          </NavItem>
          
          {/* 
          <NavItem className="px-3">
            <NavLink to="#" className="nav-link">Justin P. Romanos</NavLink>
          </NavItem> */}

          <div className="mr-3">
            {!currentVersion ?
     
              <Tooltip title={updateMessage} placement="bottom" classes={{ tooltip: classes.customWidth }} onClick={() => window.location.reload()}>
                <NewReleasesIcon style={{ width: '40', height: '40', fill: '#ffa361' }} />
              </Tooltip>
              :
              null
            } 



          </div>

          <div className="mr-3">
            {!dbLoadComplete ?
     
              <Tooltip title="Downloading Database..." placement="bottom">
                {/* <CloudDownloadIcon  style={{ width: '40', height: '40', fill: '#ff7961' }} /> */}
                <div className="mt-1">
                  <CircularProgress size={25} />
                </div>
                
                {/* <div class="loader"></div> */}
              </Tooltip> 
              :
              <Tooltip title="Database up to date" placement="bottom">
                <CloudDone style={{ width: '40', height: '40', fill: '#4dbd74' }} />
              </Tooltip>
            }



          </div>


          <Tooltip title="Refresh" placement="bottom">
            <IconButton onClick={this.refresh}>
              <RefreshIcon style={{ width: '40', height: '40' }} />
            </IconButton>
          </Tooltip>
          <DefaultHeaderDropdown className="mr-5" onLogout={this.logOut} {...this.props} accnt/>
          <div className="mr-5" />
          {/* <Button color="primary" className="mr-5" onClick={this.logOut}>Log Out</Button> */}
        </Nav>
        {/* <AppAsideToggler className="d-md-down-none" /> */}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

const mapStateToProps = (state, prop) => ({
  user: state.users.user,
  users: state.users.registeredUsers,
  dbLoadComplete: state.customers.dbLoadComplete
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadAllOrders,
      loadAllCustomers,
      loadSales,
      loadShippingMethod,

      getAllProducts,

      getDeliveries,

      getBreakdowns,
      getBoxBreakdowns,

      getPricing,

      loadPaymentTypes,
      loadPaymentTerms,

      loadMiscItems,


      socketReceiveUpdateStatus,
      dbNotLoaded
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(useStyles)(DefaultHeader));

