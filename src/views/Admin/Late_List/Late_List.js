import React, { useState, useEffect, Suspense } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadOrders } from '../../../redux/orders/actions';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
// import StatusTable from './Components/Table'
import io from 'socket.io-client';
import db_url from '../../../redux/db_url';
import Cookies from 'js-cookie';

const StatusTable = React.lazy(() => import('./Components/Table'));

const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

const socket = io(db_url);

const cookie = Cookies.get('jwt');

momentLocaliser(moment);

const SalesReport = (props) => {
  const { orders, role } = props;
  const [data, setData] = useState(orders);

  useEffect(() => {
    const filteredOrders = orders.filter(item => {
      return item.late === true;
    });
    setData(filteredOrders);

  }, [orders]);

  // useEffect(() => {
  //   socket.on('order_submitted', res => props.loadOrders(cookie))
  //   socket.on('status_updated', res => props.loadOrders(cookie))
  //   socket.on('order_deleted', res => props.loadOrders(cookie))
  //   socket.on('order_updated', res => props.loadOrders(cookie))
  // })
  
  return (

    <div>
      <Suspense fallback={loading()}>
        <StatusTable
          orders={data}
        />
      </Suspense>

    </div>
  ); 
};

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