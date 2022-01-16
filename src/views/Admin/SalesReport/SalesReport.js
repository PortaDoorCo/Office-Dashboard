import { Select } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react';
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
import { loadOrders } from '../../../redux/orders/actions';
import status from '../../../utils/report_status';
import Charts from './components/Chart';
import Chart1 from './components/SalesCharts/Chart1';

const StatusTable = React.lazy(() => import('./components/StatusTable'));

const { Option } = Select;

// momentLocaliser(moment);

// moment(this.state.startDate).startOf('day').valueOf()

const loading = () => (
  <div className="animated fadeIn pt-1 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const SalesReport = (props) => {
  const { orders, role, user } = props;
  const [activeTab, setActiveTab] = useState('1');
  const [sortedDates, setSortedDate] = useState([]);
  const [startDate, setStartDate] = useState(moment(new Date()));
  const [endDate, setEndDate] = useState(moment(sortedDates[0]?.dueDate));
  const [data, setData] = useState(orders);
  const [startDateFocusedInput, setStartDateFocusedInput] = useState(null);
  const [endDateFocusedInput, setEndDateFocusedInput] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Quote');
  const [filterText, setFilterText] = useState('');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {

    setSortedDate(orders.sort((a, b) => b.dueDate - a.dueDate));
    

  }, [orders]);


  useEffect(() => {
    const filteredOrders = orders.filter((item) => {
      let date = new Date(item.created_at);

      const dateOrdered = item?.tracking?.filter((x) => {
  
        return x.status === 'Ordered';
      });

      if (filterStatus === 'Ordered') {


        if (filterText.length > 0) {
          return (
            moment(item.DateOrdered || dateOrdered[0]?.date) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateOrdered || dateOrdered[0]?.date) <=
              moment(endDate).endOf('day').valueOf() &&
            item.status === dateOrdered[0]?.status &&
            (item.orderNum.toString().includes(filterText) ||
              item.companyprofile.Company.toLowerCase().includes(
                filterText.toLowerCase()
              ) ||
              item.job_info.poNum
                .toLowerCase()
                .includes(filterText.toLowerCase()))
          );
        } else {
          return (
            moment(item.DateOrdered || dateOrdered[0]?.date) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateOrdered || dateOrdered[0]?.date) <=
              moment(endDate).endOf('day').valueOf() &&
            item.status === dateOrdered[0]?.status
          );
        }
      } else {
        if (filterText.length > 0) {
          return (
            moment(date) >= moment(startDate).startOf('day').valueOf() &&
            moment(date) <= moment(endDate).endOf('day').valueOf() &&
            item.status.includes(filterStatus) &&
            (item.orderNum.toString().includes(filterText) ||
              item.companyprofile.Company.toLowerCase().includes(
                filterText.toLowerCase()
              ) ||
              item.job_info.poNum
                .toLowerCase()
                .includes(filterText.toLowerCase()))
          );
        } else {
          return (
            moment(date) >= moment(startDate).startOf('day').valueOf() &&
            moment(date) <= moment(endDate).endOf('day').valueOf() &&
            item.status.includes(filterStatus)
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

  const salesPerson = props.sale
    ? props.salesReps.filter((item) => {
      return item.id === props.sale;
    })
    : [];



  return role &&
    (role.type === 'authenticated' ||
      role.type === 'owner' ||
      role.type === 'administrator') ? (
      <div>
        <Row className="mb-3">
          <Col lg="9" />
          <Col>
            <Row>
              <Col>
                <h3>Filter Date {filterStatus === 'Quote' ? 'Entered' : filterStatus}</h3>
              </Col>
            </Row>
            <Row>
              <Col>
                <SingleDatePicker
                  date={startDate} // momentPropTypes.momentObj or null
                  onDateChange={(date) => setStartDate(date)} // PropTypes.func.isRequired
                  focused={startDateFocusedInput} // PropTypes.bool
                  onFocusChange={({ focused }) =>
                    setStartDateFocusedInput(focused)
                  } // PropTypes.func.isRequired
                  id="startDate" // PropTypes.string.isRequired,
                  isOutsideRange={(date) => {
                    if (date < moment(minDate)) {
                      return true;
                    } else {
                      return false;
                    }
                  }}
                />

                <SingleDatePicker
                  date={endDate} // momentPropTypes.momentObj or null
                  onDateChange={(date) => setEndDate(date)} // PropTypes.func.isRequired
                  focused={endDateFocusedInput} // PropTypes.bool
                  onFocusChange={({ focused }) => setEndDateFocusedInput(focused)} // PropTypes.func.isRequired
                  id="endDate" // PropTypes.string.isRequired,
                  isOutsideRange={(date) => {
                    if (date < moment(startDate)) {
                      return true; // return true if you want the particular date to be disabled
                    }  else {
                      return false;
                    }
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup style={{ height: '100%', width: '60%' }}>
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
                </FormGroup>
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
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '3' })}
              onClick={() => {
                toggle('3');
              }}
            >
              <strong>Ned</strong>
            </NavLink>
          </NavItem>
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
          <TabPane tabId="3">
            <Suspense fallback={loading()}>
              <StatusTable
                orders={data}
                accountName="Ned"
                startDate={startDate}
                endDate={endDate}
                filterStatus={filterStatus}
              />
            </Suspense>
          </TabPane>
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
    ) : role && role.type === 'sales' ? (
      <div>
        <Row className="mb-3">
          <Col lg="9" />
          <Col>
            <Row>
              <Col>
                <SingleDatePicker
                  date={startDate} // momentPropTypes.momentObj or null
                  onDateChange={(date) => setStartDate(date)} // PropTypes.func.isRequired
                  focused={startDateFocusedInput} // PropTypes.bool
                  onFocusChange={({ focused }) =>
                    setStartDateFocusedInput(focused)
                  } // PropTypes.func.isRequired
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
                  onDateChange={(date) => setEndDate(date)} // PropTypes.func.isRequired
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
            <Row>
              <Col>
                <FormGroup style={{ height: '100%', width: '60%' }}>
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
                </FormGroup>
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
            orders={data}
            startDate={startDate}
            endDate={endDate}
            status={salesPerson && salesPerson[0] && salesPerson[0].fullName}
          /> */}



        <Suspense fallback={loading()}>
          <StatusTable
            orders={data}
            accountName={user?.sale?.fullName}
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
  user: state.users.user
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loadOrders,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SalesReport);
