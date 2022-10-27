import { Select } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import React, { Suspense, useEffect, useState, forwardRef } from 'react';
import { SingleDatePicker } from 'react-dates';
// import momentLocaliser from 'react-widgets-moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
// import StatusTable from './components/StatusTable'
import { connect } from 'react-redux';
import {
  Col,
  FormGroup,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';
import { bindActionCreators } from 'redux';
import { loadOrders, searchOrders } from '../../../redux/orders/actions';
import status from '../../../utils/report_status';
import Charts from './components/Chart';
import Chart1 from './components/SalesCharts/Chart1';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StatusTable = React.lazy(() => import('./components/StatusTable'));

const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
  <input className="example-custom-input" ref={ref}>
    {value}
  </input>
));

const { Option } = Select;

// momentLocaliser(moment);

const cookie = Cookies.get('jwt');
// moment(this.state.startDate).startOf('day').valueOf()

const loading = () => (
  <div className="animated fadeIn pt-1 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const SalesReport = (props) => {
  const { orders, role, user, searchOrders } = props;
  const [activeTab, setActiveTab] = useState('1');
  const [sortedDates, setSortedDate] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState(orders);
  const [startDateFocusedInput, setStartDateFocusedInput] = useState(null);
  const [endDateFocusedInput, setEndDateFocusedInput] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Quote');
  const [filterText, setFilterText] = useState('');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  console.log({ startDate });

  useEffect(() => {
    setSortedDate(orders.sort((a, b) => b.dueDate - a.dueDate));
  }, [orders]);

  useEffect(() => {
    if (filterStatus === 'Ordered') {
      const search = `?DateOrdered_gte=${moment(startDate)
        .startOf('day')
        .valueOf()}&DateOrdered_lte=${moment(endDate)
        .endOf('day')
        .valueOf()}&_limit=50000&_sort=id:DESC`;
      searchOrders(cookie, user, search);
    } else if (filterStatus === 'Invoiced') {
      const search = `?DateInvoiced_gte=${moment(startDate)
        .startOf('day')
        .valueOf()}&DateInvoiced_lte=${moment(endDate)
        .endOf('day')
        .valueOf()}&_limit=50000&_sort=id:DESC`;
      searchOrders(cookie, user, search);
    } else if (filterStatus === 'Complete') {
      const search = `?DateCompleted_gte=${moment(startDate)
        .startOf('day')
        .valueOf()}&DateCompleted_lte=${moment(endDate)
        .endOf('day')
        .valueOf()}&_limit=50000&_sort=id:DESC`;
      searchOrders(cookie, user, search);
    } else if (filterStatus === 'Shipped') {
      const search = `?DateShipped_gte=${moment(startDate)
        .startOf('day')
        .valueOf()}&DateShipped_lte=${moment(endDate)
        .endOf('day')
        .valueOf()}&_limit=50000&_sort=id:DESC`;
      searchOrders(cookie, user, search);
    } else if (filterStatus === 'Quote') {
      const search = `?created_at_gte=${moment(startDate)
        .startOf('day')
        .valueOf()}&created_at_lte=${moment(endDate)
        .endOf('day')
        .valueOf()}&status=Quote&_limit=50000&_sort=id:DESC`;
      searchOrders(cookie, user, search);
    } else {
      const search = `?created_at_gte=${moment(startDate)
        .startOf('day')
        .valueOf()}&created_at_lte=${moment(endDate)
        .endOf('day')
        .valueOf()}&_limit=50000&_sort=id:DESC`;
      searchOrders(cookie, user, search);
    }
  }, [startDate, endDate, filterStatus]);

  useEffect(() => {
    const filteredOrders = orders?.filter((item) => {
      let date = new Date(item.created_at);

      if (filterStatus === 'All') {
        if (filterText?.length > 0) {
          return (
            moment(item.DateOrdered || item.created_at) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateOrdered || item.created_at) <=
              moment(endDate).endOf('day').valueOf() &&
            ((item.id + 100)?.toString().includes(filterText) ||
              item.companyprofile?.Company.toLowerCase().includes(
                filterText.toLowerCase()
              ) ||
              item.job_info?.poNum
                .toLowerCase()
                .includes(filterText.toLowerCase()))
          );
        } else {
          return (
            moment(item.DateOrdered || item.created_at) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateOrdered || item.created_at) <=
              moment(endDate).endOf('day').valueOf()
          );
        }
      }
      if (filterStatus === 'Ordered') {
        if (filterText?.length > 0) {
          return (
            moment(item.DateOrdered) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateOrdered) <=
              moment(endDate).endOf('day').valueOf() &&
            ((item.id + 100)?.toString().includes(filterText) ||
              item.companyprofile?.Company.toLowerCase().includes(
                filterText.toLowerCase()
              ) ||
              item.job_info?.poNum
                .toLowerCase()
                .includes(filterText.toLowerCase()))
          );
        } else {
          return (
            moment(item.DateOrdered) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateOrdered) <= moment(endDate).endOf('day').valueOf()
          );
        }
      } else if (filterStatus === 'Invoiced') {
        if (filterText?.length > 0) {
          return (
            moment(item.DateInvoiced) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateInvoiced) <=
              moment(endDate).endOf('day').valueOf() &&
            ((item.id + 100)?.toString().includes(filterText) ||
              item.companyprofile?.Company.toLowerCase().includes(
                filterText.toLowerCase()
              ) ||
              item.job_info?.poNum
                .toLowerCase()
                .includes(filterText.toLowerCase()))
          );
        } else {
          return (
            moment(item.DateInvoiced) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateInvoiced) <= moment(endDate).endOf('day').valueOf()
          );
        }
      } else if (filterStatus === 'Complete') {
        if (filterText?.length > 0) {
          return (
            moment(item.DateCompleted) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateCompleted) <=
              moment(endDate).endOf('day').valueOf()(
                (item.id + 100)?.toString().includes(filterText) ||
                  item.companyprofile?.Company.toLowerCase().includes(
                    filterText.toLowerCase()
                  ) ||
                  item.job_info?.poNum
                    .toLowerCase()
                    .includes(filterText.toLowerCase())
              )
          );
        } else {
          return (
            moment(item.DateCompleted) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateCompleted) <= moment(endDate).endOf('day').valueOf()
          );
        }
      } else if (filterStatus === 'Shipped') {
        if (filterText?.length > 0) {
          return (
            moment(item.DateShipped) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateShipped) <=
              moment(endDate).endOf('day').valueOf() &&
            ((item.id + 100)?.toString().includes(filterText) ||
              item.companyprofile?.Company.toLowerCase().includes(
                filterText.toLowerCase()
              ) ||
              item.job_info?.poNum
                .toLowerCase()
                .includes(filterText.toLowerCase()))
          );
        } else {
          return (
            moment(item.DateShipped) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateShipped) <= moment(endDate).endOf('day').valueOf()
          );
        }
      } else {
        if (filterText?.length > 0) {
          return (
            moment(date) >= moment(startDate).startOf('day').valueOf() &&
            moment(date) <= moment(endDate).endOf('day').valueOf() &&
            item.status?.includes(filterStatus) &&
            ((item.id + 100)?.toString().includes(filterText) ||
              item.companyprofile?.Company.toLowerCase().includes(
                filterText?.toLowerCase()
              ) ||
              item?.job_info?.poNum
                .toLowerCase()
                .includes(filterText?.toLowerCase()))
          );
        } else {
          return (
            moment(date) >= moment(startDate).startOf('day').valueOf() &&
            moment(date) <= moment(endDate).endOf('day').valueOf() &&
            item?.status?.includes(filterStatus)
          );
        }
      }
    });
    setData(filteredOrders);
  }, [startDate, endDate, orders, filterStatus, filterText]);

  const minDate =
    orders.length > 0
      ? new Date(orders[orders.length - 1].created_at)
      : new Date();

  return role && role.type === 'owner' ? (
    <div>
      <Row className="mb-3">
        <Col lg="10" />
        <Col>
          <Row>
            <Col>
              <h3>
                Filter Date{' '}
                {filterStatus === 'Quote' ? 'Entered' : filterStatus}
              </h3>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <h4>Start Date</h4>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                style={{ width: '100%' }}
                customInput={<Input />}
              />
            </Col>
          </Row>
          <Row className="mt-1">
            <Col>
              <h4>End Date</h4>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                customInput={<Input />}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Input
                type="select"
                name="select"
                id="status_dropdown"
                defaultValue="Quote"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {status.map((i, index) => (
                  <option key={index} value={i.value}>
                    {i.value}
                  </option>
                ))}
              </Input>
            </Col>
          </Row>
        </Col>
      </Row>

      <Charts data={data} />

      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => {
              toggle('1');
            }}
          >
            <strong>House</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => {
              toggle('2');
            }}
          >
            <strong>Harold</strong>
          </NavLink>
        </NavItem>
        {/* <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '3' })}
            onClick={() => {
              toggle('3');
            }}
          >
            <strong>Ned</strong>
          </NavLink>
        </NavItem> */}
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '4' })}
            onClick={() => {
              toggle('4');
            }}
          >
            <strong>Peter</strong>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '5' })}
            onClick={() => {
              toggle('5');
            }}
          >
            <strong>Meg</strong>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Suspense fallback={loading()}>
            <StatusTable
              orders={data}
              accountName="House Account"
              startDate={startDate}
              endDate={endDate}
              filterStatus={filterStatus}
            />
          </Suspense>
        </TabPane>
        <TabPane tabId="2">
          <Suspense fallback={loading()}>
            <StatusTable
              orders={data}
              accountName="Harold"
              startDate={startDate}
              endDate={endDate}
              filterStatus={filterStatus}
            />
          </Suspense>
        </TabPane>
        {/* <TabPane tabId="3">
          <Suspense fallback={loading()}>
            <StatusTable
              orders={data}
              accountName="Ned"
              startDate={startDate}
              endDate={endDate}
              filterStatus={filterStatus}
            />
          </Suspense>
        </TabPane> */}
        <TabPane tabId="4">
          <Suspense fallback={loading()}>
            <StatusTable
              orders={data}
              accountName="Peter"
              startDate={startDate}
              endDate={endDate}
              filterStatus={filterStatus}
            />
          </Suspense>
        </TabPane>
        <TabPane tabId="5">
          <Suspense fallback={loading()}>
            <StatusTable
              orders={data}
              accountName="Meg"
              startDate={startDate}
              endDate={endDate}
              filterStatus={filterStatus}
            />
          </Suspense>
        </TabPane>
      </TabContent>
    </div>
  ) : (role && role.type === 'sales') || role.type === 'administrator' ? (
    <div>
      <Row className="mb-3">
        <Col lg="10" />
        <Col>
          <Row>
            <Col>
              <h3>
                Filter Date{' '}
                {filterStatus === 'Quote' ? 'Entered' : filterStatus}
              </h3>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <h4>Start Date</h4>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                style={{ width: '100%' }}
                customInput={<Input />}
              />
            </Col>
          </Row>
          <Row className="mt-1">
            <Col>
              <h4>End Date</h4>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                customInput={<Input />}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Input
                type="select"
                name="select"
                id="status_dropdown"
                defaultValue="Quote"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {status.map((i, index) => (
                  <option key={index} value={i.value}>
                    {i.value}
                  </option>
                ))}
              </Input>
            </Col>
          </Row>
        </Col>
      </Row>

      <Chart1
        orders={data}
        startDate={startDate}
        endDate={endDate}
        status={user?.sale?.fullName}
      />

      {/* <Maps 
            orders={orders}
            startDate={startDate}
            endDate={endDate}
            status={salesPerson && salesPerson[0] && salesPerson[0].fullName}
          /> */}

      <Suspense fallback={loading()}>
        <StatusTable
          orders={data}
          accountName={user?.sale?.fullName}
          salesRep={user?.sale}
          startDate={startDate}
          endDate={endDate}
          filterStatus={filterStatus}
        />
      </Suspense>
    </div>
  ) : (
    <div>Restricted Access</div>
  );
};

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  role: state.users.user.role,
  sale: state.users.user.sale,
  salesReps: state.sales.salesReps,
  user: state.users.user,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loadOrders,
      searchOrders,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SalesReport);
