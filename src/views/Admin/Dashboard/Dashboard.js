<<<<<<< HEAD
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
=======
import React, { Component, Suspense } from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login } from '../../../redux/users/actions';

const Chart1 = React.lazy(() => import('./components/Chart1'));
const Chart2 = React.lazy(() => import('./components/Chart2'));
const Chart3 = React.lazy(() => import('./components/Chart3'));
const Chart4 = React.lazy(() => import('./components/Chart4'));
const OrderTable2 = React.lazy(() => import('./components/OrderTable2'));
const CompanyTable = React.lazy(() => import('../Customers/Customers/CompanyTable'));
const Maps = React.lazy(() => import('./components/Maps'));


const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;
>>>>>>> staging

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
<<<<<<< HEAD
        {role &&
        (role.type === 'management' ||
          role.type === 'authenticated' ||
          role.type === 'owner') ? (
            <div>
              <Row>
                <Col lg="4">
=======
        {role && (role.type === 'management' || role.type === 'authenticated' || role.type === 'owner') ?
          <div>
            <Row>
              <Col lg="4">
                <Suspense>
>>>>>>> staging
                  <Chart2 />
                </Suspense>
              </Col>
              <Col lg="4">
                <Suspense>
                  <Chart3 />
                </Suspense>
              </Col>
              <Col lg="4">
                <Suspense>
                  <Chart4 />
                </Suspense>
              </Col>
            </Row>
            <Row>
              <Col>
                <Suspense>
                  <Chart1 />
                </Suspense>
              </Col>
            </Row>
            <Row>
              <Col style={{ height: 600 }}>
                <Suspense>
                  <Maps />
<<<<<<< HEAD
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
=======
                </Suspense>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Suspense>
                  <OrderTable2  />
                </Suspense>
              </Col>
            </Row>
            <Row>
              <Col>
                <Suspense>
                  <CompanyTable
                    customerDB={this.props.customerDB}
                  />
                </Suspense>
              </Col>
            </Row>
          </div>
          :
          <div>
            {loading()}
          </div>
        }


>>>>>>> staging
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
