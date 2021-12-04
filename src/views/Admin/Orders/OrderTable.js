import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import OrderPage from './OrderPage';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
import { Select } from 'antd';
import {
  updateStatus,
  loadOrders,
  setSelectedOrder,
  setOrderType
} from '../../../redux/orders/actions';
import Cookies from 'js-cookie';
// import momentLocaliser from 'react-widgets-moment';
import { Row, Col, Button, FormGroup, Input } from 'reactstrap';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Receipt from '@material-ui/icons/Receipt';
import Report1 from '../../PrintOuts/Reports/Report1';
import styled from 'styled-components';
import status from '../../../utils/status';


// momentLocaliser(moment);

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const cookie = Cookies.get('jwt');
const { Option } = Select;

const conditionalRowStyles = [
  {
    when: (row) => row.late === true,
    style: {
      backgroundColor: '#FEEBEB',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
];

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder="Search Orders"
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton type="button" color="danger" onClick={onClear}>
      X
    </ClearButton>
  </>
);

const OrderTable = (props) => {
  const { orders, role } = props;
  const [toggleCleared, setToggleCleared] = useState(false);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState(orders);
  const [startDate, setStartDate] = useState(moment(new Date()));
  const [endDate, setEndDate] = useState(moment(new Date()));
  const [startDateFocusedInput, setStartDateFocusedInput] = useState(null);
  const [endDateFocusedInput, setEndDateFocusedInput] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const minDate =
    orders.length > 0
      ? new Date(orders[orders.length - 1].created_at)
      : new Date();

  useEffect(() => {
    const filteredOrders = orders.filter((item) => {
      let date = new Date(item.created_at);

      if (filterStatus === 'All') {
        if (filterText.length > 0) {
          return (
            moment(date) >= moment(startDate).startOf('day').valueOf() &&
            moment(date) <= moment(endDate).endOf('day').valueOf() &&
            (item.orderNum.toString().includes(filterText) ||
              item.job_info.customer.Company.toLowerCase().includes(
                filterText.toLowerCase()
              ) ||
              item.job_info.poNum
                .toLowerCase()
                .includes(filterText.toLowerCase()))
          );
        } else {
          return (
            moment(date) >= moment(startDate).startOf('day').valueOf() &&
            moment(date) <= moment(endDate).endOf('day').valueOf()
          );
        }
      } else if (filterStatus === 'In Production') {
        if (filterText.length > 0) {
          return (
            moment(date) >= moment(startDate).startOf('day').valueOf() &&
            moment(date) <= moment(endDate).endOf('day').valueOf() &&
            moment(date) <= moment(endDate).endOf('day').valueOf() &&
            (!item.status.includes('Quote') &&  !item.status.includes('Invoiced') && !item.status.includes('Ordered') && !item.status.includes('Shipped'))  &&
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
            (!item.status.includes('Quote') &&  !item.status.includes('Invoiced') && !item.status.includes('Ordered') && !item.status.includes('Shipped')) 
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

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const handleStatusChange = async (e, row) => {
    const { updateStatus } = props;
    const status = {
      status: e.target.value,
    };
    await updateStatus(row.id, row, status, cookie);
  };

  const columns = [
    {
      name: 'Company',
      cell: (row) => (
        <div>
          {row.job_info &&
            row.job_info.customer &&
            row.job_info.customer.Company}
        </div>
      ),
      sortable: true,
      grow: 2,
    },
    {
      name: 'Order #',
      selector: 'orderNum',
      sortable: true,
    },
    {
      name: 'PO #',
      selector: 'job_info.poNum',
      sortable: true,
    },
    {
      name: 'Order Type',
      selector: 'orderType',
      sortable: true,
    },
    {
      name: 'Date Ordered',
      cell: (row) => <div>{moment(row.created_at).format('MMM Do YYYY')}</div>,
    },
    {
      name: 'Due Date',
      cell: (row) => (
        <div>
          {row.status === 'Quote'
            ? 'TBD'
            : moment(row.dueDate).format('MMM Do YYYY')}
        </div>
      ),
    },
    {
      name: 'Status',
      grow: 1,
      cell: (row) => (
        <div>
          <Row>
            <Col>
              <FormGroup style={{ height: '100%' }}>
                <Input
                  type="select"
                  name="select"
                  id="status_dropdown"
                  defaultValue={row.status}
                  style={{
                    height: '100%',
                    boxShadow: 'none',
                    border: '0px',
                    outline: '0px',
                    background: 'none',
                  }}
                  onChange={(e) => handleStatusChange(e, row)}
                >
                  <option value={row.status}>{row.status}</option>
                  {status.map((i, index) => (
                    <option key={index} value={i.value}>
                      {i.value}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col style={{ textAlign: 'center', color: 'red' }}>
              {row.job_info.Rush && row.job_info.Sample
                ? 'Sample / Rush'
                : row.job_info.Rush
                  ? 'Rush'
                  : row.job_info.Sample
                    ? 'Sample'
                    : ''}
            </Col>
          </Row>
        </div>
      ),
    },
    {
      name: 'Submitted By',
      cell: (row) => (
        <div>{row.user && row.user.FirstName ? row.user.FirstName : ''}</div>
      ),
      sortable: true,
    },
    {
      name: 'Total',
      selector: 'total',
      sortable: true,
      cell: (row) => <div>${row.total && row.total.toFixed(2)}</div>,
    },
    {
      name: 'Balance Paid',
      sortable: true,
      cell: (row) => (
        <div>
          $
          {row.balance_history &&
            row.balance_history.reduce(
              (acc, item) => acc + item.balance_paid,
              0
            )}
        </div>
      ),
    },
    {
      name: 'Terms',
      cell: (row) => (
        <div>
          {row.companyprofile && row.companyprofile.PMT_TERMS
            ? row.companyprofile.PMT_TERMS
            : ''}
        </div>
      ),
      sortable: true,
    },
    {
      name: ' ',
      button: true,
      grow: 2,
      cell: (row) => (
        <Tooltip title="View Order" placement="top">
          <IconButton
            onClick={function (event) {
              event.preventDefault();
              toggle(row);
            }}
            id={row.id}
          >
            <Inbox>Open</Inbox>
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const toggle = (row) => {
    const { setSelectedOrder, setOrderType } = props;


    console.log({row});

    setEdit(false);
    setModal(!modal);

    if (!modal) {
      setSelectedOrder(row);
      setOrderType(row.orderType);
    } else {
      setSelectedOrder(null);
      setOrderType(null);
    }
  };

  const editable = () => {
    setEdit(!edit);
  };

  const exportReports = () => {
    Report1(data, startDate, endDate, filterStatus);
    setToggleCleared(!toggleCleared);
  };

  return (
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
                  defaultValue="All"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All</option>
                  {status.map((i, index) => (
                    <option key={index} value={i.value}>
                      {i.value}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              {role &&
              (role.type === 'authenticated' ||
                role.type === 'owner' ||
                role.type === 'administrator') ? (
                  <h3>
                  Order Totals: $
                    {data.reduce((acc, item) => acc + item.total, 0).toFixed(2)}
                  </h3>
                ) : null}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <h3># Of Orders: {data.length}</h3>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        {/* <Col lg='11' /> */}
        <Col>
          <Tooltip
            title="View Reports"
            onClick={exportReports}
            placement="top"
            className="mb-3 mt-3"
          >
            <IconButton>
              <Receipt style={{ width: '40', height: '40' }} />
            </IconButton>
          </Tooltip>
        </Col>
      </Row>

      <DataTable
        title="Orders"
        columns={columns}
        data={data}
        pagination
        progressPending={!props.ordersDBLoaded}
        highlightOnHover
        conditionalRowStyles={conditionalRowStyles}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
      />
      {modal ? (
        <OrderPage
          toggle={toggle}
          modal={modal}
          editable={editable}
          edit={edit}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  orderNum: state.Orders.orderNum,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  breakdowns: state.part_list.breakdowns,
  box_breakdowns: state.part_list.box_breakdowns,
  role: state.users.user.role,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateStatus,
      loadOrders,
      setSelectedOrder,
      setOrderType
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrderTable);
