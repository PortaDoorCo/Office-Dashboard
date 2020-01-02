import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem, Button } from 'reactstrap';
// import { Button } from 'antd';
import PropTypes from 'prop-types';
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
// import DefaultHeaderDropdown  from './DefaultHeaderDropdown'
import logo from '../../assets/img/brand/portadoor.png'
import sygnet from '../../assets/img/brand/sygnet.svg'
import { unsetToken } from "../../utils/auth";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  logOut = () => {
    unsetToken().then(() => window.location.reload());
  };


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
            <NavLink to="#" className="nav-link">Settings</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          {/* <DefaultHeaderDropdown notif/>
          <DefaultHeaderDropdown tasks/>
          <DefaultHeaderDropdown mssgs/>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-location-pin"></i></NavLink>
          </NavItem>
          <DefaultHeaderDropdown onLogout={this.props.onLogout} accnt/> */}
          {/* 
          <NavItem className="px-3">
            <NavLink to="#" className="nav-link">Justin P. Romanos</NavLink>
          </NavItem> */}
          <Button color="primary" className="mr-5" onClick={this.logOut}>Log Out</Button>
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

});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {

    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultHeader);

