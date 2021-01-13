import React, { useState, useEffect, Suspense } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
// import StatusTable from './components/StatusTable'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadOrders } from '../../../redux/orders/actions';
import Charts from './components/Chart';
import Chart1 from './components/SalesCharts/Chart1';
import Maps from './components/SalesCharts/Maps';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

const StatusTable = React.lazy(() => import('./components/StatusTable'));

momentLocaliser(moment);

// moment(this.state.startDate).startOf('day').valueOf()

const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

const SalesReport = (props) => {
  const { orders, role } = props;
  const [activeTab, setActiveTab] = useState('1');
  const [startDate, setStartDate] = useState(moment(new Date()));
  const [endDate, setEndDate] = useState(moment(new Date()));
  const [data, setData] = useState(orders);
  const [focusedInput, setFocusedInput] = useState(null);

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


  const minDate = orders.length > 0 ?  new Date(orders[orders.length - 1].createdAt) : new Date();

  const salesPerson = props.sale ? props.salesReps.filter(item => {
    return item.id.includes(props.sale);
  }) : [];

  console.log({salesPerson});
  
  return (
    role && (role.type === 'authenticated' || role.type === 'owner') ? 
      <div>
        <Row className="mb-3">
          <Col lg='9' />
          <Col>
            <Row>
              <Col>
                <DateRangePicker
                  startDate={startDate} // momentPropTypes.momentObj or null,
                  startDateId="startDate" // PropTypes.string.isRequired,
                  endDate={endDate} // momentPropTypes.momentObj or null,
                  endDateId="endDate" // PropTypes.string.isRequired,
                  onDatesChange={({ startDate, endDate }) => (setStartDate(startDate), setEndDate(endDate))} // PropTypes.func.isRequired,
                  focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                  onFocusChange={focusedInput => setFocusedInput(focusedInput)}
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
          </TabPane>
        </TabContent>
      </div> : 
      role && (role.type === 'sales') ? 
        <div>
          <Row className="mb-3">
            <Col lg='9' />
            <Col>
              <Row>
                <Col>
                  <DateRangePicker
                    startDate={startDate} // momentPropTypes.momentObj or null,
                    startDateId="startDate" // PropTypes.string.isRequired,
                    endDate={endDate} // momentPropTypes.momentObj or null,
                    endDateId="endDate" // PropTypes.string.isRequired,
                    onDatesChange={({ startDate, endDate }) => (setStartDate(startDate), setEndDate(endDate))} // PropTypes.func.isRequired,
                    focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                    onFocusChange={focusedInput => setFocusedInput(focusedInput)}
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
            </Col>
          </Row>

          <Chart1
            orders={data}
            startDate={startDate}
            endDate={endDate}
            status={salesPerson && salesPerson[0] && salesPerson[0].fullName}
          />

          {/* <Maps 
            orders={data}
            startDate={startDate}
            endDate={endDate}
            status={salesPerson && salesPerson[0] && salesPerson[0].fullName}
          /> */}

          <Suspense fallback={loading()}>
            <StatusTable
              orders={data}
              status={salesPerson && salesPerson[0] && salesPerson[0].fullName}
              startDate={startDate}
              endDate={endDate}
            />
          </Suspense>
           
        </div> :
        <div>
      Restricted Access
        </div>
  ); 
};

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  role: state.users.user.role,
  sale: state.users.user.sale,
  salesReps: state.sales.salesReps
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