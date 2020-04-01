import React, { useState, useEffect } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadOrders } from '../../../redux/orders/actions'

import moment from 'moment'
import momentLocaliser from 'react-widgets-moment'
import { DateBox } from 'devextreme-react';
import StatusTable from './Components/Table'
import io from 'socket.io-client';
const socket = io('https://server.portadoor.com/');

momentLocaliser(moment)

const SalesReport = (props) => {
  const { orders, role } = props;
  const [data, setData] = useState(orders)

  useEffect(() => {
    const filteredOrders = orders.filter(item => {
      return item.late === true
    })
    setData(filteredOrders);

  }, [orders])

  useEffect(() => {
    socket.on('order_submitted', res => props.loadOrders())
    socket.on('status_updated', res => props.loadOrders())
    socket.on('order_deleted', res => props.loadOrders())
    socket.on('order_updated', res => props.loadOrders())
  })
  
  return (

    <div>
        <StatusTable
            orders={data}
        />
    </div>
  ) 
}

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  role: state.users.user.role
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadOrders
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesReport);