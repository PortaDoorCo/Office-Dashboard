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
import {
  loadOrders,
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

import { loadCustomers } from '../../redux/customers/actions';

import {
  getAllProducts,
  getBreakdowns,
  getBoxBreakdowns,
  getPricing
} from '../../redux/part_list/actions';
import { NotificationManager } from 'react-notifications';

import Cookies from 'js-cookie';

const propTypes = {
  children: PropTypes.node,
};

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
      loadOrders,
      getDeliveries,
      loadCustomers,
      loadMiscItems,
      getAllProducts,
    } = this.props;

    const cookie = await Cookies.get('jwt');

    if (cookie) {
      await NotificationManager.success('Database Refresh Beginning', 'Refresh Beginning!', 2000);
      await getAllProducts(cookie);
      await loadOrders(cookie);
      await loadCustomers(cookie);
      await loadSales(cookie);
      await loadMiscItems(cookie);
      await getDeliveries(cookie);
      await getPricing(cookie);
      await getBreakdowns(cookie);
      await getBoxBreakdowns(cookie);
      await loadShippingMethod(cookie);
      await loadPaymentTypes(cookie);
      await loadPaymentTerms(cookie);
      await NotificationManager.success('Database Refreshed', 'Database Refreshed!', 2000);
    } else {
      alert('not logged in');
    }
  }


  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

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
          <Tooltip title="Refresh" placement="bottom">
            <IconButton onClick={this.refresh}>
              <RefreshIcon style={{ width: '40', height: '40' }} />
            </IconButton>
          </Tooltip>
          <DefaultHeaderDropdown className="mr-5" onLogout={this.logOut} user={this.props.user} accnt/>
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
  user: state.users.user
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadOrders,
      loadCustomers,
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


      socketReceiveUpdateStatus
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultHeader);

