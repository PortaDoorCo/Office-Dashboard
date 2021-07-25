import React, { useState, useEffect } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import StatusTable from './components/StatusTable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Charts from './components/Chart';
import { loadOrders } from '../../../redux/orders/actions';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import moment from 'moment';

const Tracking = (props) => {
  const { orders } = props;
  const [activeTab, setActiveTab] = useState('1');
  const [startDate, setStartDate] = useState(moment(new Date()));
  const [endDate, setEndDate] = useState(moment(new Date()));
  const [data, setData] = useState(orders);
  const [startDateFocusedInput, setStartDateFocusedInput] = useState(null);
  const [endDateFocusedInput, setEndDateFocusedInput] = useState(null);

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    const filteredOrders = orders.filter(item => {
      let date = new Date(item.created_at);
      return moment(date) >= moment(startDate).startOf('day').valueOf() && moment(date) <= moment(endDate).endOf('day').valueOf();
    });
    setData(filteredOrders);

  }, [startDate, endDate, orders]);

  const minDate = orders.length > 0 ?  new Date(orders[orders.length - 1].created_at) : new Date();

  return (
    <div>

      <Row>
        <Col sm='9' />
        <Col>
          <SingleDatePicker
            date={startDate} // momentPropTypes.momentObj or null
            onDateChange={date => setStartDate(date)} // PropTypes.func.isRequired
            focused={startDateFocusedInput} // PropTypes.bool
            onFocusChange={({ focused }) => setStartDateFocusedInput(focused)} // PropTypes.func.isRequired
            id="startDate" // PropTypes.string.isRequired,
            isOutsideRange={(date) => {
              if (date > moment(new Date())) {
                return true; // return true if you want the particular date to be disabled
              } else if (date < moment(minDate)) {
                return true;
              } else {
                return false;
              }
            }}
          />

          <SingleDatePicker
            date={endDate} // momentPropTypes.momentObj or null
            onDateChange={date => setEndDate(date)} // PropTypes.func.isRequired
            focused={endDateFocusedInput} // PropTypes.bool
            onFocusChange={({ focused }) => setEndDateFocusedInput(focused)} // PropTypes.func.isRequired
            id="endDate" // PropTypes.string.isRequired,
            isOutsideRange={(date) => {
              if (date > moment(new Date())) {
                return true; // return true if you want the particular date to be disabled
              } else if (date < moment(minDate)) {
                return true;
              } else {
                return false;
              }
            }}
          />
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
            <strong>In Production</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}
          >
            <strong>Cutting</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '3' })}
            onClick={() => { toggle('3'); }}
          >
            <strong>Framing</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '4' })}
            onClick={() => { toggle('4'); }}
          >
            <strong>Assembly</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '5' })}
            onClick={() => { toggle('5'); }}
          >
            <strong>Tenon</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '6' })}
            onClick={() => { toggle('6'); }}
          >
            <strong>Panels</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '7' })}
            onClick={() => { toggle('7'); }}
          >
            <strong>Sanding</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '8' })}
            onClick={() => { toggle('8'); }}
          >
            <strong>Lipping</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '9' })}
            onClick={() => { toggle('9'); }}
          >
            <strong>Inspecting</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '10' })}
            onClick={() => { toggle('10'); }}
          >
            <strong>Paint Shop</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '11' })}
            onClick={() => { toggle('11'); }}
          >
            <strong>Complete</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '12' })}
            onClick={() => { toggle('12'); }}
          >
            <strong>Shipped</strong>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <StatusTable
            orders={data}
            loadOrders={props.loadOrders}
            status="In Production"
          />
        </TabPane>
        <TabPane tabId="2">
          <StatusTable
            orders={data}
            loadOrders={props.loadOrders}
            status="Cut"
          />
        </TabPane>
        <TabPane tabId="3">
          <StatusTable
            orders={data}
            loadOrders={props.loadOrders}
            status="Framing"
          />
        </TabPane>
        <TabPane tabId="4">
          <StatusTable
            orders={data}
            loadOrders={props.loadOrders}
            status="Assembly"
          />
        </TabPane>
        <TabPane tabId="5">
          <StatusTable
            orders={data}
            loadOrders={props.loadOrders}
            status="Tenon"
          />
        </TabPane>
        <TabPane tabId="6">
          <StatusTable
            orders={data}
            loadOrders={props.loadOrders}
            status="Panels"
          />
        </TabPane>
        <TabPane tabId="7">
          <StatusTable
            orders={data}
            loadOrders={props.loadOrders}
            status="Sanding"
          />
        </TabPane>
        <TabPane tabId="8">
          <StatusTable
            orders={data}
            loadOrders={props.loadOrders}
            status="Lipping"
          />
        </TabPane>
        <TabPane tabId="9">
          <StatusTable
            orders={data}
            loadOrders={props.loadOrders}
            status="Inspecting"
          />
        </TabPane>
        <TabPane tabId="10">
          <StatusTable
            orders={data}
            loadOrders={props.loadOrders}
            status="Paint Shop"
          />
        </TabPane>
        <TabPane tabId="11">
          <StatusTable
            orders={data}
            loadOrders={props.loadOrders}
            status="Complete"
          />
        </TabPane>
        <TabPane tabId="12">
          <StatusTable
            orders={data}
            loadOrders={props.loadOrders}
            status="Shipped"
          />
        </TabPane>
      </TabContent>
    </div>
  );
};

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
)(Tracking);