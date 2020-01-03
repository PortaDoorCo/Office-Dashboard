import React, { useState, useEffect } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import StatusTable from './components/StatusTable'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadOrders } from '../../../redux/orders/actions'
import Charts from './components/Chart'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import moment from 'moment'
import momentLocaliser from 'react-widgets-moment'
import { SelectBox, DateBox } from 'devextreme-react';
import io from 'socket.io-client';
const socket = io('https://server.portadoor.com/');

momentLocaliser(moment)




const SalesReport = (props) => {
  const { orders } = props;
  const [activeTab, setActiveTab] = useState('1');
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [data, setData] = useState(orders)

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  useEffect(() => {
    const filteredOrders = orders.filter(item => {
      let date = new Date(item.createdAt);
      return date.getDate() >= startDate.getDate() && date.getDate() <= endDate.getDate();
    })
    setData(filteredOrders);
    console.log(filteredOrders)
  }, [startDate, endDate, orders])

  useEffect(() => {
    socket.on('order_submitted', res => props.loadOrders())
}, [])

  const minDate = new Date(orders[orders.length - 1].createdAt)

  return (
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
            <strong>Joseph</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '4' })}
            onClick={() => { toggle('4'); }}
          >
            <strong>Peter</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '5' })}
            onClick={() => { toggle('5'); }}
          >
            <strong>Meg</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '6' })}
            onClick={() => { toggle('6'); }}
          >
            <strong>Krista</strong>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
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
            status="Joseph"
            startDate={startDate}
            endDate={endDate}
          />
        </TabPane>
        <TabPane tabId="4">
          <StatusTable
            orders={data}
            status="Peter"
            startDate={startDate}
            endDate={endDate}
          />
        </TabPane>
        <TabPane tabId="5">
          <StatusTable
            orders={data}
            status="Meg"
            startDate={startDate}
            endDate={endDate}
          />
        </TabPane>
        <TabPane tabId="6">
          <StatusTable
            orders={data}
            status="Krista"
            startDate={startDate}
            endDate={endDate}
          />
        </TabPane>
      </TabContent>
    </div>
  );
}

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
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