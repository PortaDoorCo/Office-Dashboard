import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import CompanyTable from '../Customers/Customers/CompanyTable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login } from '../../../redux/users/actions';
import Chart1 from './components/Chart1';
import Chart2 from './components/Chart2';
import Chart3 from './components/Chart3';
import Chart4 from './components/Chart4';
import Maps from './components/Maps';
import OrderTable from './components/OrderTable';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      orders: [],
      modal: false,
      selectedOrder: null,
      orderEdit: false,
    };
  }

  render() {
    const { role } = this.props;
    return (
      <div className="animated fadeIn">
        {role &&
        (role.type === 'management' ||
          role.type === 'authenticated' ||
          role.type === 'owner') ? (
            <div>
              <Row>
                <Col lg="4">
                  <Chart2 />
                </Col>
                <Col lg="4">
                  <Chart3 />
                </Col>
                <Col lg="4">
                  <Chart4 />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Chart1 />
                </Col>
              </Row>
              <Row>
                <Col style={{ height: 600 }}>
                  <Maps />
                </Col>
              </Row>
            </div>
          ) : (
            <div>
              <Row>
                <Col style={{ height: 600 }}>
                  <Maps />
                </Col>
              </Row>
            </div>
          )}

        <Row className="mt-3">
          <Col>
            <OrderTable />
          </Col>
        </Row>
        <Row>
          <Col>
            <CompanyTable customerDB={this.props.customerDB} />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  customerDB: state.customers.customerDB,
  customerDBLoaded: state.customers.customerDBLoaded,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  role: state.users.user.role,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      login,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
