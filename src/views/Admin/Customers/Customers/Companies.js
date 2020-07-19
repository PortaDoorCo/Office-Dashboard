import React, { Component } from 'react';
import CompanyTable2 from './CompanyTable2'
import {
  loadOrders,
} from '../../../../redux/orders/actions';

import {
  loadCustomers,
} from '../../../../redux/customers/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Companies extends Component {
  render() {
    return (
      <div>
        <CompanyTable2
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
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Companies);