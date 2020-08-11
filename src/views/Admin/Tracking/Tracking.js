import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import StatusTable from './components/StatusTable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Charts from './components/Chart';
import { loadOrders } from '../../../redux/orders/actions';

const Tracking = (props) => {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div>

      <Charts
        data={props.orders}
      />


      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}
          >
            <strong>Quotes</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}
          >
            <strong>In Production</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '3' })}
            onClick={() => { toggle('3'); }}
          >
            <strong>Invoiced</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '4' })}
            onClick={() => { toggle('4'); }}
          >
            <strong>Ordered</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '5' })}
            onClick={() => { toggle('5'); }}
          >
            <strong>Station 1</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '6' })}
            onClick={() => { toggle('6'); }}
          >
            <strong>Station 2</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '7' })}
            onClick={() => { toggle('7'); }}
          >
            <strong>Shipped</strong>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <StatusTable
            orders={props.orders}
            loadOrders={props.loadOrders}
            status="Quote"
          />
        </TabPane>
        <TabPane tabId="2">
          <StatusTable
            orders={props.orders}
            loadOrders={props.loadOrders}
            status="In Production"
          />
        </TabPane>
        <TabPane tabId="3">
          <StatusTable
            orders={props.orders}
            loadOrders={props.loadOrders}
            status="Invoiced"
          />
        </TabPane>
        <TabPane tabId="4">
          <StatusTable
            orders={props.orders}
            loadOrders={props.loadOrders}
            status="Ordered"
          />
        </TabPane>
        <TabPane tabId="5">
          <StatusTable
            orders={props.orders}
            loadOrders={props.loadOrders}
            status="Station 1"
          />
        </TabPane>
        <TabPane tabId="6">
          <StatusTable
            orders={props.orders}
            loadOrders={props.loadOrders}
            status="Station 2"
          />
        </TabPane>
        <TabPane tabId="7">
          <StatusTable
            orders={props.orders}
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