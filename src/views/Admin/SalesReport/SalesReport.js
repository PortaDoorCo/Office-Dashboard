import React, { useState, useEffect, Suspense } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
<<<<<<< HEAD
import StatusTable from './components/StatusTable';
=======
// import StatusTable from './components/StatusTable'
>>>>>>> staging
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadOrders } from '../../../redux/orders/actions';
import Charts from './components/Chart';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import { DateBox } from 'devextreme-react';

<<<<<<< HEAD
momentLocaliser(moment);
=======
const StatusTable = React.lazy(() => import('./components/StatusTable'));

momentLocaliser(moment);

// moment(this.state.startDate).startOf('day').valueOf()
>>>>>>> staging

const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

const SalesReport = (props) => {
  const { orders, role } = props;
  const [activeTab, setActiveTab] = useState('1');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState(orders);

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    const filteredOrders = orders.filter(item => {
      let date = new Date(item.createdAt);
      return moment(date) >= moment(startDate).startOf('day').valueOf() && moment(date) <= moment(endDate).endOf('day').valueOf();
    });
    setData(filteredOrders);

  }, [startDate, endDate, orders]);
<<<<<<< HEAD
=======

  // useEffect(() => {
  //   socket.on('order_submitted', res => props.loadOrders(cookie))
  //   socket.on('status_updated', res => props.loadOrders(cookie))
  //   socket.on('order_updated', res => props.loadOrders(cookie))
  // })
>>>>>>> staging

  const minDate = new Date(orders[orders.length - 1].createdAt);

  
  return (
    role.type === 'management' || role.type === 'authenticated' || role.type === 'owner' ? 
      <div>
        <Row className="mb-3">
          <Col lg='7' />
          <Col>
            <Row>
              <Col>
                <p>From</p>
                <DateBox value={startDate} max={endDate}
                  min={minDate} onValueChanged={startDate => setStartDate(new Date(startDate.value))} type="date" />
              </Col>
              <Col>
                <p>To</p>
                <DateBox value={endDate} max={new Date()}
                  min={startDate} onValueChanged={endDate => setEndDate(new Date(endDate.value))} type="date" />
              </Col>
            </Row>
          </Col>
        </Row>

        <Charts
          data={data}
        />


        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => { toggle('1'); }}
            >
              <strong>House</strong>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => { toggle('2'); }}
            >
              <strong>Harold</strong>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '3' })}
              onClick={() => { toggle('3'); }}
            >
              <strong>Ned</strong>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '4' })}
              onClick={() => { toggle('4'); }}
            >
              <strong>Joseph</strong>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '5' })}
              onClick={() => { toggle('5'); }}
            >
              <strong>Peter</strong>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '6' })}
              onClick={() => { toggle('6'); }}
            >
              <strong>Meg</strong>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '7' })}
              onClick={() => { toggle('7'); }}
            >
              <strong>Krista</strong>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
<<<<<<< HEAD
            <StatusTable
              orders={data}
              status="House Account"
              startDate={startDate}
              endDate={endDate}
            />
          </TabPane>
          <TabPane tabId="2">
            <StatusTable
              orders={data}
              status="Harold"
              startDate={startDate}
              endDate={endDate}
            />
          </TabPane>
          <TabPane tabId="3">
            <StatusTable
              orders={data}
              status="Ned"
              startDate={startDate}
              endDate={endDate}
            />
          </TabPane>
          <TabPane tabId="4">
            <StatusTable
              orders={data}
              status="Joseph"
              startDate={startDate}
              endDate={endDate}
            />
          </TabPane>
          <TabPane tabId="5">
            <StatusTable
              orders={data}
              status="Peter"
              startDate={startDate}
              endDate={endDate}
            />
          </TabPane>
          <TabPane tabId="6">
            <StatusTable
              orders={data}
              status="Meg"
              startDate={startDate}
              endDate={endDate}
            />
          </TabPane>
          <TabPane tabId="7">
            <StatusTable
              orders={data}
              status="Krista"
              startDate={startDate}
              endDate={endDate}
            />
=======
            <Suspense fallback={loading()}>
              <StatusTable
                orders={data}
                status="House Account"
                startDate={startDate}
                endDate={endDate}
              />
            </Suspense>
          </TabPane>
          <TabPane tabId="2">
            <Suspense fallback={loading()}>
              <StatusTable
                orders={data}
                status="Harold"
                startDate={startDate}
                endDate={endDate}
              />
            </Suspense>
          </TabPane>
          <TabPane tabId="3">
            <Suspense fallback={loading()}>
              <StatusTable
                orders={data}
                status="Ned"
                startDate={startDate}
                endDate={endDate}
              />
            </Suspense>
          </TabPane>
          <TabPane tabId="4">
            <Suspense fallback={loading()}>
              <StatusTable
                orders={data}
                status="Joseph"
                startDate={startDate}
                endDate={endDate}
              />
            </Suspense>
          </TabPane>
          <TabPane tabId="5">
            <Suspense fallback={loading()}>
              <StatusTable
                orders={data}
                status="Peter"
                startDate={startDate}
                endDate={endDate}
              />
            </Suspense>
          </TabPane>
          <TabPane tabId="6">
            <Suspense fallback={loading()}>
              <StatusTable
                orders={data}
                status="Meg"
                startDate={startDate}
                endDate={endDate}
              />
            </Suspense>
          </TabPane>
          <TabPane tabId="7">
            <Suspense fallback={loading()}>
              <StatusTable
                orders={data}
                status="Krista"
                startDate={startDate}
                endDate={endDate}
              />
            </Suspense>
>>>>>>> staging
          </TabPane>
        </TabContent>
      </div> : 
      <div>
      Restricted Access
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