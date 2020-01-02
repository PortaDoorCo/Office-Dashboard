import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadOrders, loadCustomers, updateStatus } from '../../../../redux/orders/actions';
import OrderTable from './OrderTable';

class ViewAllOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { orders, loadOrders, updateStatus } = this.props;
    return (
      <div>
        {orders.length &&
          <div>
            <Row>
              <Col>
                <OrderTable
                  orders={orders}
                  loadOrders={loadOrders}
                  updateStatus={updateStatus}
                />
              </Col>
            </Row>
          </div>
        }
      </div>
    );
  }
}


const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  orderNum: state.Orders.orderNum,
  ordersDBLoaded: state.Orders.ordersDBLoaded
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadOrders,
      loadCustomers,
      updateStatus
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewAllOrders);
