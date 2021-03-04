import React, { Component, Suspense } from 'react';
import {
  Row,
  Col,
  Button,
  Collapse
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login } from '../../../redux/users/actions';
import { loadOrders } from '../../../redux/orders/actions';

const Chart1 = React.lazy(() => import('./components/Chart1'));
const Chart2 = React.lazy(() => import('./components/Chart2'));
const Chart3 = React.lazy(() => import('./components/Chart3'));
const Chart4 = React.lazy(() => import('./components/Chart4'));
const OrderTable = React.lazy(() => import('./components/OrderTable'));
const CompanyTable = React.lazy(() => import('../Customers/Customers/CompanyTable'));
const Maps = React.lazy(() => import('./components/Maps'));

const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

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
      maps: false,
      charts: false
    };
  }

  toggleMap = () => {
    this.setState({
      maps: !this.state.maps
    });
  }

  toggleCharts = () => {
    this.setState({
      charts: !this.state.charts
    });
  }

  render() {
    const { role } = this.props;
    return (
      <div className="animated fadeIn">
        {role && (role.type === 'management' || role.type === 'authenticated' || role.type === 'owner') ?
          <div>

            <Row>
              <Col>
                <Button color="primary" onClick={this.toggleMap}>Delivery Map</Button>
                <Button color="primary" onClick={this.toggleCharts}>Charts</Button>
              </Col>
            </Row>

            <Collapse isOpen={this.state.charts}>
              <Row>
                <Col lg="4">
                  <Suspense fallback={loading()}>
                    <Chart2 />
                  </Suspense>
                </Col>
                <Col lg="4">
                  <Suspense fallback={loading()}>
                    <Chart3 />
                  </Suspense>
                </Col>
                <Col lg="4">
                  <Suspense fallback={loading()}>
                    <Chart4 />
                  </Suspense>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Suspense fallback={loading()}>
                    <Chart1 />
                  </Suspense>
                </Col>
              </Row>

            </Collapse>



            <Collapse isOpen={this.state.maps}>
              <Row className="mb-5">
                <Col style={{ height: 600 }}>
                  <Suspense fallback={loading()}>
                    <Maps  />
                  </Suspense>
                </Col>
              </Row>
            </Collapse>
            <Row className="mt-5">
              <Col>
                <Suspense fallback={loading()}>
                  <OrderTable />
                </Suspense>
              </Col>
            </Row>
            {/* <Row>
              <Col>
                <Suspense fallback={loading()}>
                  <CompanyTable
                    customerDB={this.props.customerDB}
                  />
                </Suspense>
              </Col>
            </Row> */}
          </div>
          : role && (role.type === 'office' || role.type === 'sales') ?
            <div>
              <Row>
                <Col>
                  <Suspense fallback={loading()}>
                    <Maps className="mb-5" />
                  </Suspense>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Suspense fallback={loading()}>
                    <OrderTable  />
                  </Suspense>
                </Col>
              </Row>
              {/* <Row>
                <Col>
                  <Suspense fallback={loading()}>
                    <CompanyTable
                      customerDB={this.props.customerDB}
                    />
                  </Suspense>
                </Col>
              </Row> */}
            </div>
            : loading()
        }


      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  customerDB: state.customers.customerDB,
  customerDBLoaded: state.customers.customerDBLoaded,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  role: state.users.user.role
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      login,
      loadOrders
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
