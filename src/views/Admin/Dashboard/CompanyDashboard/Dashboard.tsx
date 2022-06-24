import React, { Component, Suspense } from 'react';
import { Row, Col, Button, Collapse, ButtonGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login } from '../../../../redux/users/actions';
import { loadOrders } from '../../../../redux/orders/actions';
import MessageModal from '../MessageModal';
import SalesTable from '../../SalesReport/SalesReport';

const Chart1 = React.lazy(() => import('../../../../components/Charts/Chart1'));
const Chart2 = React.lazy(() => import('../../../../components/Charts/Chart2'));
const Chart3 = React.lazy(() => import('../../../../components/Charts/Chart3'));
const Chart4 = React.lazy(() => import('../../../../components/Charts/Chart4'));
const OrderTable = React.lazy(() => import('./components/OrderTable'));
const Maps = React.lazy(() => import('../../../../components/Maps/Maps'));

const loading = () => (
  <div className="animated fadeIn pt-1 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

type PropTypes = {
  role: {
    type: string;
  };
  orders: any;
  user: any;
};

type StateTypes = {
  maps: any;
  dropdownOpen: boolean;
  radioSelected: number;
  orders: Array<any>;
  modal: boolean;
  selectedOrder: {};
  orderEdit: boolean;
  charts: boolean;
  viewPopup: boolean;
};

class Dashboard extends Component<PropTypes, StateTypes> {
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
      charts: false,
      viewPopup: false,
    };
  }

  // componentDidMount(){
  //   let visited = localStorage['alreadyVisited'];
  //   if(visited) {
  //     this.setState({ viewPopup: false });
  //     //do not view Popup
  //   } else {
  //     //this is the first time
  //     localStorage['alreadyVisited'] = true;
  //     this.setState({ viewPopup: true});
  //   }
  // }

  toggleMessageModal = () => {
    this.setState({
      viewPopup: !this.state.viewPopup,
    });
  };

  toggleMap = () => {
    this.setState({
      maps: !this.state.maps,
    });
  };

  toggleCharts = () => {
    this.setState({
      charts: !this.state.charts,
    });
  };

  render() {
    const { role, orders, user } = this.props;

    return (
      <div className="animated fadeIn">
        <MessageModal
          toggle={this.toggleMessageModal}
          modal={this.state.viewPopup}
        />

        {role &&
        (role.type === 'management' ||
          role.type === 'authenticated' ||
          role.type === 'owner' ||
          role.type === 'administrator') ? (
          <div>
            {/* <Row className="mb-3">
              <Col>
                <ButtonGroup>
                  <Button color="success" onClick={this.toggleCharts}>
                    Charts
                  </Button>
                  <Button color="success" onClick={this.toggleMap}>
                    Delivery Map
                  </Button>
                </ButtonGroup>
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
                    <Maps />
                  </Suspense>
                </Col>
              </Row>
            </Collapse> */}

            {/* <Maps /> */}

            <Row className="mt-5">
              <Col>
                <Suspense fallback={loading()}>
                  <OrderTable {...this.props} />
                </Suspense>
              </Col>
            </Row>
          </div>
        ) : role && role.type === 'office' ? (
          <div>
            <Collapse isOpen={this.state.maps}>
              <Row>
                <Col>
                  <Suspense fallback={loading()}>
                    <Maps />
                  </Suspense>
                </Col>
              </Row>
            </Collapse>
            <Row className="mt-3">
              <Col>
                <Suspense fallback={loading()}>
                  <OrderTable {...this.props} />
                </Suspense>
              </Col>
            </Row>
          </div>
        ) : role && role.type === 'sales' ? (
          <div>
            <Collapse isOpen={this.state.maps}>
              <Row>
                <Col>
                  <Suspense fallback={loading()}>
                    <Maps />
                  </Suspense>
                </Col>
              </Row>
            </Collapse>
            <Row className="mt-3">
              <Col>
                <Suspense fallback={loading()}>
                  <SalesTable {...this.props} />
                </Suspense>
              </Col>
            </Row>
          </div>
        ) : (
          loading()
        )}
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
  user: state.users.user,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      login,
      loadOrders,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
