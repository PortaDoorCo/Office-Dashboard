import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import OrderPage from '../Orders/OrderPage';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
import { Select } from 'antd';
import {
  updateStatus,
  loadOrders,
  setSelectedOrder,
} from '../../../redux/orders/actions';
import Cookies from 'js-cookie';
import momentLocaliser from 'react-widgets-moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';
import { Row, Col } from 'reactstrap';
import status from '../../../utils/status';

momentLocaliser(moment);


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

const StatusTable = (props) => {
  const { orders } = props;
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [startDate, setStartDate] = useState(moment(new Date()));
  const [endDate, setEndDate] = useState(moment(new Date()));
  const [data, setData] = useState(orders);
  const [startDateFocusedInput, setStartDateFocusedInput] = useState(null);
  const [endDateFocusedInput, setEndDateFocusedInput] = useState(null);


  useEffect(() => {
    const filteredOrders = orders.filter(item => {
      let date = new Date(item.dueDate);
      return moment(date) >= moment(startDate).startOf('day').valueOf() && moment(date) <= moment(endDate).endOf('day').valueOf() && item.late === true;
    });
    setData(filteredOrders);

  }, [startDate, endDate, orders]);

  const handleStatusChange = async (e, row) => {
    const { updateStatus } = props;
    const status = {
      status: e,
    };
    await updateStatus(row.id, row, status, cookie);
  };

  const columns = [
    {
      name: 'Order #',
      selector: 'orderNum',
      sortable: true,
    },
    {
      name: 'Company',
      selector: 'job_info.customer.Company',
      sortable: true,
      grow: 2,
    },
    {
      name: 'Order Type',
      selector: 'orderType',
      sortable: true,
    },
    {
      name: 'Date Ordered',
      cell: (row) => <div>{moment(row.createdAt).format('MMM Do YYYY')}</div>,
    },
    {
      name: 'Due Date',
      cell: row => <div>{row.status === 'Quote' ? 'TBA' : moment(row.dueDate).format('MMM Do YYYY')}</div>,
    },
    {
      name: 'Status',
      grow: 1,
      cell: (row) => (
        <Select
          defaultValue={row.status}
          style={{ width: '100%' }}
          onChange={(e) => handleStatusChange(e, row)}
          bordered={false}
        >
          {status.map((i, index) => (
            <Option key={index} value={i.value}>
              {i.value}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      name: 'Submitted By',
      selector: 'user.FirstName',
      sortable: true,
    },

    {
      name: 'Total',
      selector: 'total',
      sortable: true,
      cell: (row) => <div>${row.total.toFixed(2)}</div>,
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
    const { setSelectedOrder } = props;

    setEdit(false);
    setModal(!modal);

    if (!modal) {
      setSelectedOrder(row);
    } else {
      setSelectedOrder(null);
    }
  };

  const editable = () => {
    setEdit(!edit);
  };

  const minDate = orders.length > 0 ?  new Date(orders[orders.length - 1].createdAt) : new Date();


  return (
    <div>
      <Row>
        <Col sm='9' />
        <Col>
          <h3>Filter Due Date</h3>
        </Col>
      </Row>
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
      <DataTable
        title="Orders"
        columns={columns}
        data={data}
        pagination
        progressPending={!props.ordersDBLoaded}
        highlightOnHover
        conditionalRowStyles={conditionalRowStyles}
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
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  breakdowns: state.part_list.breakdowns,
  box_breakdowns: state.part_list.box_breakdowns
});
    
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateStatus,
      loadOrders,
      setSelectedOrder,
    },
    dispatch
  );
    
export default connect(mapStateToProps, mapDispatchToProps)(StatusTable);
