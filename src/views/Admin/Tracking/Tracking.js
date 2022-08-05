import React, { useState, useEffect, useMemo } from 'react';
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
  setOrderType,
  searchOrders,
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
import status from '../../../utils/tracking_status';
import orderTypes from '../../../utils/orderTypes';
import Tracking from '../../PrintOuts/Reports/Tracking';
import OpenOrders from '../../PrintOuts/Reports/OpenOrders';
import DropdownList from 'react-widgets/DropdownList';
import { useDebounce } from 'use-debounce';

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
    when: (row) =>
      moment(row.dueDate).startOf('day').valueOf() <
        moment(new Date()).startOf('day').valueOf() &&
      row.Shipping_Scheduled &&
      !row.status.includes('Quote') &&
      !row.status.includes('Invoiced') &&
      !row.status.includes('Complete') &&
      !row.status.includes('Shipped'),
    style: {
      backgroundColor: '#FEEBEB',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  {
    when: (row) =>
      !row.Shipping_Scheduled &&
      !row.status.includes('Quote') &&
      !row.status.includes('Invoiced') &&
      !row.status.includes('Complete') &&
      !row.status.includes('Ordered') &&
      !row.status.includes('Shipped'),
    style: {
      backgroundColor: '#FFEACA',
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
      autoComplete="off"
    />
    <ClearButton type="button" color="danger" onClick={onClear}>
      X
    </ClearButton>
  </>
);

const OrderTable = (props) => {
  const { orders, role, customers, searchOrders, loadOrders } = props;
  const [toggleCleared, setToggleCleared] = useState(false);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState(orders);
  const [startDate, setStartDate] = useState(moment(new Date()));
  const [endDate, setEndDate] = useState(moment(new Date()));
  const [startDateFocusedInput, setStartDateFocusedInput] = useState(null);
  const [endDateFocusedInput, setEndDateFocusedInput] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Open Orders');
  const [orderType, setOrderType] = useState('All');
  const [customer, setCustomer] = useState({ Company: 'All' });
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [customerDebounce] = useDebounce(customer, 500);
  const [statusDebounce] = useDebounce(filterStatus, 500);
  const [orderTypeDebounce] = useDebounce(orderType, 500);

  const minDate =
    orders?.length > 0
      ? new Date(orders[orders?.length - 1].created_at)
      : new Date();

  useEffect(() => {
    const filteredOrders = orders?.filter((item) => {
      let date = new Date(item.dueDate);

      const dateOrdered = item?.tracking?.filter((x) => {
        return x.status === 'Ordered';
      });

      if (customer.Company === 'All') {
        if (orderType === 'All') {
          if (filterStatus === 'In Production') {
            if (filterText?.length > 0) {
              return (
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                ((item.id + 100)?.toString().includes(filterText) ||
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
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped')
              );
            }
          } else if (filterStatus === 'Open Orders') {
            if (filterText?.length > 0) {
              return (
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                ((item.id + 100)?.toString().includes(filterText) ||
                  item.companyprofile.Company.toLowerCase().includes(
                    filterText.toLowerCase()
                  ) ||
                  item.job_info.poNum
                    .toLowerCase()
                    .includes(filterText.toLowerCase()))
              );
            } else {
              return (
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped')
              );
            }
          } else if (filterStatus === 'Late') {
            if (filterText?.length > 0) {
              return (
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                item.Shipping_Scheduled &&
                ((item.id + 100)?.toString().includes(filterText) ||
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
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                item.Shipping_Scheduled
              );
            }
          } else {
            if (filterText?.length > 0) {
              return (
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                item.status.includes(filterStatus) &&
                ((item.id + 100)?.toString().includes(filterText) ||
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
        } else {
          if (filterStatus === 'In Production') {
            if (filterText?.length > 0) {
              return (
                item.orderType.includes(orderType) &&
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                ((item.id + 100)?.toString().includes(filterText) ||
                  item.companyprofile.Company.toLowerCase().includes(
                    filterText.toLowerCase()
                  ) ||
                  item.job_info.poNum
                    .toLowerCase()
                    .includes(filterText.toLowerCase()))
              );
            } else {
              return (
                item.orderType.includes(orderType) &&
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped')
              );
            }
          } else if (filterStatus === 'Open Orders') {
            if (filterText?.length > 0) {
              return (
                item.orderType.includes(orderType) &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                ((item.id + 100)?.toString().includes(filterText) ||
                  item.companyprofile.Company.toLowerCase().includes(
                    filterText.toLowerCase()
                  ) ||
                  item.job_info.poNum
                    .toLowerCase()
                    .includes(filterText.toLowerCase()))
              );
            } else {
              return (
                item.orderType.includes(orderType) &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped')
              );
            }
          } else if (filterStatus === 'Late') {
            if (filterText?.length > 0) {
              return (
                item.orderType.includes(orderType) &&
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                item.Shipping_Scheduled &&
                ((item.id + 100)?.toString().includes(filterText) ||
                  item.companyprofile.Company.toLowerCase().includes(
                    filterText.toLowerCase()
                  ) ||
                  item.job_info.poNum
                    .toLowerCase()
                    .includes(filterText.toLowerCase()))
              );
            } else {
              return (
                item.orderType.includes(orderType) &&
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                item.Shipping_Scheduled
              );
            }
          } else {
            if (filterText?.length > 0) {
              return (
                item.orderType.includes(orderType) &&
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                item.status.includes(filterStatus) &&
                ((item.id + 100)?.toString().includes(filterText) ||
                  item.companyprofile.Company.toLowerCase().includes(
                    filterText.toLowerCase()
                  ) ||
                  item.job_info.poNum
                    .toLowerCase()
                    .includes(filterText.toLowerCase()))
              );
            } else {
              return (
                item.orderType.includes(orderType) &&
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                item.status.includes(filterStatus)
              );
            }
          }
        }
      } else {
        if (orderType === 'All') {
          if (filterStatus === 'In Production') {
            if (filterText?.length > 0) {
              return (
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                item.job_info?.customer?.Company ===
                  customer?.Company(
                    (item.id + 100)?.toString().includes(filterText) ||
                      item.companyprofile.Company.toLowerCase().includes(
                        filterText.toLowerCase()
                      ) ||
                      item.job_info.poNum
                        .toLowerCase()
                        .includes(filterText.toLowerCase())
                  )
              );
            } else {
              return (
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                item.job_info?.customer?.Company === customer?.Company
              );
            }
          } else if (filterStatus === 'Open Orders') {
            if (filterText?.length > 0) {
              return (
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                item.job_info?.customer?.Company ===
                  customer?.Company(
                    (item.id + 100)?.toString().includes(filterText) ||
                      item.companyprofile.Company.toLowerCase().includes(
                        filterText.toLowerCase()
                      ) ||
                      item.job_info.poNum
                        .toLowerCase()
                        .includes(filterText.toLowerCase())
                  )
              );
            } else {
              return (
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                item.job_info?.customer?.Company === customer?.Company
              );
            }
          } else if (filterStatus === 'Late') {
            if (filterText?.length > 0) {
              return (
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                item.job_info?.customer?.Company === customer?.Company &&
                item.Shipping_Scheduled &&
                ((item.id + 100)?.toString().includes(filterText) ||
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
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                item.job_info?.customer?.Company === customer?.Company &&
                item.Shipping_Scheduled
              );
            }
          } else {
            if (filterText?.length > 0) {
              return (
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                item.job_info?.customer?.Company === customer?.Company &&
                item.status.includes(filterStatus) &&
                ((item.id + 100)?.toString().includes(filterText) ||
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
                item.job_info?.customer?.Company === customer?.Company &&
                item.status.includes(filterStatus)
              );
            }
          }
        } else {
          if (filterStatus === 'In Production') {
            if (filterText?.length > 0) {
              return (
                item.orderType.includes(orderType) &&
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                item.job_info?.customer?.Company === customer?.Company &&
                ((item.id + 100)?.toString().includes(filterText) ||
                  item.companyprofile.Company.toLowerCase().includes(
                    filterText.toLowerCase()
                  ) ||
                  item.job_info.poNum
                    .toLowerCase()
                    .includes(filterText.toLowerCase()))
              );
            } else {
              return (
                item.orderType.includes(orderType) &&
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                item.job_info?.customer?.Company === customer?.Company &&
                !item.status.includes('Shipped')
              );
            }
          } else if (filterStatus === 'Open Orders') {
            if (filterText?.length > 0) {
              return (
                item.orderType.includes(orderType) &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                item.job_info?.customer?.Company === customer?.Company &&
                ((item.id + 100)?.toString().includes(filterText) ||
                  item.companyprofile.Company.toLowerCase().includes(
                    filterText.toLowerCase()
                  ) ||
                  item.job_info.poNum
                    .toLowerCase()
                    .includes(filterText.toLowerCase()))
              );
            } else {
              return (
                item.orderType.includes(orderType) &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Complete') &&
                item.job_info?.customer?.Company === customer?.Company &&
                !item.status.includes('Shipped')
              );
            }
          } else if (filterStatus === 'Late') {
            if (filterText?.length > 0) {
              return (
                item.orderType.includes(orderType) &&
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                item.job_info?.customer?.Company === customer?.Company &&
                item.Shipping_Scheduled &&
                ((item.id + 100)?.toString().includes(filterText) ||
                  item.companyprofile.Company.toLowerCase().includes(
                    filterText.toLowerCase()
                  ) ||
                  item.job_info.poNum
                    .toLowerCase()
                    .includes(filterText.toLowerCase()))
              );
            } else {
              return (
                item.orderType.includes(orderType) &&
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                !item.status.includes('Quote') &&
                !item.status.includes('Invoiced') &&
                !item.status.includes('Ordered') &&
                !item.status.includes('Complete') &&
                !item.status.includes('Shipped') &&
                item.job_info?.customer?.Company === customer?.Company &&
                item.Shipping_Scheduled
              );
            }
          } else {
            if (filterText?.length > 0) {
              return (
                item.orderType.includes(orderType) &&
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                item.job_info?.customer?.Company === customer?.Company &&
                item.status.includes(filterStatus) &&
                ((item.id + 100)?.toString().includes(filterText) ||
                  item.companyprofile.Company.toLowerCase().includes(
                    filterText.toLowerCase()
                  ) ||
                  item.job_info.poNum
                    .toLowerCase()
                    .includes(filterText.toLowerCase()))
              );
            } else {
              return (
                item.orderType.includes(orderType) &&
                moment(date) >= moment(startDate).startOf('day').valueOf() &&
                moment(date) <= moment(endDate).endOf('day').valueOf() &&
                item.job_info?.customer?.Company === customer?.Company &&
                item.status.includes(filterStatus)
              );
            }
          }
        }
      }
    });
    setData(filteredOrders);
  }, [
    startDate,
    endDate,
    orders,
    filterStatus,
    filterText,
    orderType,
    customer,
  ]);

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
    const { updateStatus, user } = props;
    const status = {
      status: e.target.value,
    };
    await updateStatus(row.id, row, status, user, cookie);
  };

  const columns = [
    {
      name: 'Order #',
      cell: (row) => row.id + 100,
      sortable: true,
    },
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
      name: 'Due Date',
      sortable: true,
      cell: (row) => {
        if (row.Shipping_Scheduled) {
          return <div> {moment(row.dueDate).format('MMM Do YYYY')}</div>;
        } else if (
          !row.Shipping_Scheduled &&
          !row.status.includes('Quote') &&
          !row.status.includes('Invoiced') &&
          !row.status.includes('Ordered') &&
          !row.status.includes('Shipped')
        ) {
          return <div>Not Scheduled</div>;
        } else {
          return <div>TBD</div>;
        }
      },
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
    let newOrder = [...data];

    const sortedData = newOrder.sort(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    );

    if (filterStatus === 'Open Orders') {
      OpenOrders(sortedData, startDate, endDate, filterStatus);
    } else {
      Tracking(sortedData, startDate, endDate, filterStatus);
    }

    setToggleCleared(!toggleCleared);
  };

  return (
    <div>
      <Row>
        <Col lg="4">
          <Row>
            <Col>
              <h3>Customers</h3>
              <FormGroup style={{ height: '100%', width: '60%' }}>
                <DropdownList
                  defaultValue="All"
                  textField={(item) => item.Company}
                  data={customers}
                  onChange={(value) => setCustomer(value)}
                  value={customer}
                />
                <Button onClick={() => setCustomer({ Company: 'All' })}>
                  Clear
                </Button>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>Status</h3>
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
          <Row>
            <Col>
              <h3>Order Type</h3>
              <FormGroup style={{ height: '100%', width: '60%' }}>
                <Input
                  type="select"
                  name="select"
                  id="status_dropdown"
                  defaultValue="Door"
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  {orderTypes?.map((i, index) => (
                    <option key={index} value={i.value}>
                      {i.value}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </Col>

        <Col lg="5" />

        <Col lg="3">
          {filterStatus !== 'Open Orders' ? (
            <Row>
              <Col>
                <h3>Filter Due Date</h3>
              </Col>
            </Row>
          ) : null}

          {filterStatus !== 'Open Orders' ? (
            <Row>
              <Col lg="12">
                <SingleDatePicker
                  date={startDate} // momentPropTypes.momentObj or null
                  onDateChange={(date) => setStartDate(date)} // PropTypes.func.isRequired
                  focused={startDateFocusedInput} // PropTypes.bool
                  onFocusChange={({ focused }) =>
                    setStartDateFocusedInput(focused)
                  } // PropTypes.func.isRequired
                  id="startDate" // PropTypes.string.isRequired,
                  isOutsideRange={(date) => {
                    if (date < moment('1/1/1990')) {
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
                  onFocusChange={({ focused }) =>
                    setEndDateFocusedInput(focused)
                  } // PropTypes.func.isRequired
                  id="endDate" // PropTypes.string.isRequired,
                  isOutsideRange={(date) => {
                    if (date < moment(startDate)) {
                      return true; // return true if you want the particular date to be disabled
                    } else {
                      return false;
                    }
                  }}
                />
              </Col>
            </Row>
          ) : null}
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
  user: state.users.user,
  customers: state.customers.customerDB,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateStatus,
      loadOrders,
      setSelectedOrder,
      setOrderType,
      searchOrders,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrderTable);
