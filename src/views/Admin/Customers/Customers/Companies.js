import React, { Component } from 'react';
import CompanyTable from './CompanyTable'
import AddCustomer from '../AddCustomer/AddCustomer';
import {
  loadCustomers,
  loadOrders,
  loadCustomerOrder
} from '../../../../redux/orders/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Companies extends Component {
  render() {
    return (
      <div>
        <CompanyTable
          customerDB={this.props.customerDB}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  customerDB: state.Orders.customerDB,
  customerDBLoaded: state.Orders.customerDBLoaded,
  customerOrder: state.Orders.customerOrder
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadCustomers,
      loadOrders,
      loadCustomerOrder
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Companies);