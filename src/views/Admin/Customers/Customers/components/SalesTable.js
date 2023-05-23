import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import OrderPage from '../../../Orders/OrderPage';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
import { Select } from 'antd';
import {
  updateStatus,
  loadOrders,
  setSelectedOrder,
  setOrderType,
} from '../../../../../redux/orders/actions';
import Cookies from 'js-cookie';
// import momentLocaliser from 'react-widgets-moment';
import { Row, Col, Button, FormGroup, Input } from 'reactstrap';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Receipt from '@material-ui/icons/Receipt';
import CustomerFile from '../../../../PrintOuts/Reports/CustomerFile';
import styled from 'styled-components';
import status from '../../../../../utils/customer_status';
import Invoice from '../../../../PrintOuts/Reports/Invoice';
import Report1 from '../../../../PrintOuts/Reports/CustomerFile';

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
      !row.status?.includes('Quote') &&
      !row.status?.includes('Invoiced') &&
      !row.status.includes('Complete') &&
      !row.status?.includes('Shipped'),
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
  const { orders, role, company } = props;
  const [toggleCleared, setToggleCleared] = useState(false);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState(orders);
  const [startDate, setStartDate] = useState(moment('1/1/2021'));
  const [endDate, setEndDate] = useState(moment(new Date()));
  const [startDateFocusedInput, setStartDateFocusedInput] = useState(null);
  const [endDateFocusedInput, setEndDateFocusedInput] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const minDate =
    orders.length > 0
      ? new Date(orders[orders.length - 1]?.created_at)
      : new Date();

  useEffect(() => {
    const customerOrders = orders
      ?.filter((x) => x.job_info?.customer?.id === props.selectedCompanies?.id)
      .sort((a, b) => b.id - a.id);

    const filteredOrders = customerOrders?.filter((item) => {
      let date = new Date(item?.created_at);

      if (filterStatus === 'All') {
        if (filterText?.length > 0) {
          return (
            moment(item.DateOrdered || date) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateOrdered || date) <=
              moment(endDate).endOf('day').valueOf() &&
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
            moment(item.DateOrdered || date) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateOrdered || date) <=
              moment(endDate).endOf('day').valueOf()
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
      } else if (filterStatus === 'Quote') {
        if (filterText?.length > 0) {
          return (
            moment(date) >= moment(startDate).startOf('day').valueOf() &&
            moment(date) <= moment(endDate).endOf('day').valueOf() &&
            item.status?.includes(filterStatus) &&
            ((item.id + 100).toString().includes(filterText) ||
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
            item.status?.includes(filterStatus)
          );
        }
      } else if (filterStatus === 'Ordered') {
        if (filterText?.length > 0) {
          return (
            moment(item.DateOrdered || '1/1/1900') >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateOrdered || '1/1/1900') <=
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
            moment(item.DateOrdered || '1/1/1900') >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateOrdered || '1/1/1900') <=
              moment(endDate).endOf('day').valueOf()
          );
        }
      } else if (filterStatus === 'Invoiced') {
        if (filterText?.length > 0) {
          return (
            moment(item.DateInvoiced || '1/1/1900') >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateInvoiced || '1/1/1900') <=
              moment(endDate).endOf('day').valueOf() &&
            ((item.id + 100).toString().includes(filterText) ||
              item.companyprofile?.Company.toLowerCase().includes(
                filterText.toLowerCase()
              ) ||
              item.job_info?.poNum
                .toLowerCase()
                .includes(filterText.toLowerCase()))
          );
        } else {
          return (
            moment(item.DateInvoiced || '1/1/1900') >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateInvoiced || '1/1/1900') <=
              moment(endDate).endOf('day').valueOf()
          );
        }
      } else if (filterStatus === 'Complete') {
        if (filterText?.length > 0) {
          return (
            moment(item.DateCompleted || '1/1/1900') >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateCompleted || '1/1/1900') <=
              moment(endDate).endOf('day').valueOf() &&
            ((item.id + 100).toString().includes(filterText) ||
              item.companyprofile?.Company.toLowerCase().includes(
                filterText.toLowerCase()
              ) ||
              item.job_info?.poNum
                .toLowerCase()
                .includes(filterText.toLowerCase()))
          );
        } else {
          return (
            moment(item.DateCompleted || '1/1/1900') >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateCompleted || '1/1/1900') <=
              moment(endDate).endOf('day').valueOf()
          );
        }
      } else if (filterStatus === 'Pending Shipment') {
        if (filterText?.length > 0) {
          return (
            moment(item.DateCompleted || '1/1/1900') >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateCompleted || '1/1/1900') <=
              moment(endDate).endOf('day').valueOf() &&
            !item.DateShipped &&
            ((item.id + 100).toString().includes(filterText) ||
              item.companyprofile?.Company.toLowerCase().includes(
                filterText.toLowerCase()
              ) ||
              item.job_info?.poNum
                .toLowerCase()
                .includes(filterText.toLowerCase()))
          );
        } else {
          return (
            moment(item.DateCompleted || '1/1/1900') >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateCompleted || '1/1/1900') <=
              moment(endDate).endOf('day').valueOf() &&
            !item.DateShipped
          );
        }
      } else if (filterStatus === 'Shipped') {
        if (filterText?.length > 0) {
          return (
            moment(item.DateShipped || '1/1/1900') >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateShipped || '1/1/1900') <=
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
            moment(item.DateShipped || '1/1/1900') >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateShipped || '1/1/1900') <=
              moment(endDate).endOf('day').valueOf()
          );
        }
      } else if (filterStatus === 'In Production') {
        if (filterText.length > 0) {
          return (
            moment(item.DateOrdered) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateOrdered) <=
              moment(endDate).endOf('day').valueOf() &&
            moment(item.DateOrdered) <=
              moment(endDate).endOf('day').valueOf() &&
            !item.status.includes('Quote') &&
            !item.status.includes('Invoiced') &&
            !item.status.includes('Ordered') &&
            !item.status.includes('Shipped') &&
            !item.status.includes('Complete') &&
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
            moment(item.DateOrdered) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateOrdered) <=
              moment(endDate).endOf('day').valueOf() &&
            !item.status.includes('Quote') &&
            !item.status.includes('Invoiced') &&
            !item.status.includes('Ordered') &&
            !item.status.includes('Complete') &&
            !item.status.includes('Shipped')
          );
        }
      } else {
        if (filterText?.length > 0) {
          return (
            moment(item.DateOrdered || date) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateOrdered || date) <=
              moment(endDate).endOf('day').valueOf() &&
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
            moment(item.DateOrdered || date) >=
              moment(startDate).startOf('day').valueOf() &&
            moment(item.DateOrdered || date) <=
              moment(endDate).endOf('day').valueOf()
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

  const handleStatusChange = async (e, row) => {};

  const columns = [
    {
      name: 'Order #',
      cell: (row) => row.id + 100,
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
      name: 'Status',
      grow: 1,
      cell: (row) => (
        <div>
          <Row>
            <Col>
              <FormGroup style={{ height: '100%' }}>
                {row.status === 'Invoiced' || row.status === 'Complete' ? (
                  <div
                    style={{
                      paddingTop: '1rem',
                      paddingLeft: '1rem',
                    }}
                  >
                    Complete
                  </div>
                ) : (
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
                    {status.map((i, index) => (
                      <option key={index} value={i.value}>
                        {i.value}
                      </option>
                    ))}
                  </Input>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col style={{ textAlign: 'center', color: 'red' }}>
              {row?.job_info?.Rush && row?.job_info?.Sample
                ? 'Sample / Rush'
                : row?.job_info?.Rush
                ? 'Rush'
                : row?.job_info?.Sample
                ? 'Sample'
                : ''}
            </Col>
          </Row>
        </div>
      ),
    },
    {
      name: 'Total',
      selector: 'total',
      sortable: true,
      cell: (row) => <div>${row?.total && row.total?.toFixed(2)}</div>,
    },
    {
      name: 'Balance Due',
      sortable: true,
      cell: (row) => {
        let updated_total = row.total;

        const balance_history_paid =
          row &&
          row.balance_history.slice(0).map((i, index) => {
            updated_total =
              updated_total -
              parseFloat(i.balance_paid || 0) -
              parseFloat(i.deposit_paid || 0);
            return updated_total;
          });

        return <div>${updated_total.toFixed(2)}</div>;
      },
    },
    {
      name: 'Due Date',
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
      name: 'Date Shipped',
      cell: (row) => {
        const dateShipped = row?.tracking?.filter((x) => {
          return x.status === 'Shipped';
        });

        if (row.DateShipped || dateShipped.length > 0) {
          return (
            <div>
              {moment(row.DateShipped || dateShipped[0]?.date).format(
                'MMM Do YYYY'
              )}
            </div>
          );
        } else {
          return <div>TBD</div>;
        }
      },
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

    if (filterStatus !== 'Quote') {
      const newData = newOrder.map((i) => {
        const dateOrdered = i?.tracking?.filter((x) => {
          return x.status === 'Ordered';
        });

        return {
          ...i,
          dateOrdered: i.DateOrdered
            ? new Date(i.DateOrdered)
            : new Date(dateOrdered[0]?.date),
        };
      });

      const sortedData = newData.sort((a, b) => a.dateOrdered - b.dateOrdered);
      newOrder = sortedData;
    } else {
      const newData = newOrder.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      newOrder = newData;
    }

    if (filterStatus === 'Invoiced') {
      Invoice(newOrder, startDate, endDate, filterStatus, company);
    } else {
      Report1(newOrder, startDate, endDate, filterStatus, company);
    }

    setToggleCleared(!toggleCleared);
  };

  return (
    <div>
      <Row className="mb-3">
        <Col lg="7" />
        <Col>
          <Row>
            <Col>
              <h3>
                Filter Date{' '}
                {filterStatus === 'Quote'
                  ? 'Entered'
                  : filterStatus === 'Complete' ||
                    filterStatus === 'Pending Shipment'
                  ? 'Complete'
                  : filterStatus === 'Invoiced'
                  ? 'Invoiced'
                  : filterStatus === 'All'
                  ? 'Ordered / Entered'
                  : 'Ordered'}
              </h3>
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
                  <option value={'All'}>All</option>
                  <option value={'Open Orders'}>Open Orders</option>
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
                  {data
                    .reduce(
                      (acc, item) => acc + Math.round(item.total * 100) / 100,
                      0
                    )
                    .toFixed(2)}
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
  orderNum: state.Orders.orderNum,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  breakdowns: state.part_list.breakdowns,
  box_breakdowns: state.part_list.box_breakdowns,
  selectedCompanies: state.customers.selectedCompanies,
  role: state.users.user.role,
  user: state.users.user,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateStatus,
      loadOrders,
      setSelectedOrder,
      setOrderType,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrderTable);
