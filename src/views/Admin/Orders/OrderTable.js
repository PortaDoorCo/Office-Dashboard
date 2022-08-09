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
  searchOrders,
  setSelectedOrder,
  setOrderType,
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
import reportStatus from '../../../utils/report_status';
import status from '../../../utils/ordersStatus';
import { itemPriceSelector } from '../../../selectors/pricing';
import Invoice from '../../PrintOuts/Reports/Invoice';
import exportEdges from '../../../utils/exportEdges';
import exportRazorGauge from '../../../utils/exportRazorGauge';
import GetAppIcon from '@material-ui/icons/GetApp';
import Chart1 from './Charts/Chart1';
import Chart2 from './Charts/Designs';
import Chart3 from './Charts/Chart3';
import Profiles from './Charts/Profiles';
import Panels from './Charts/Panels';
import Edges from './Charts/Edges';
import Woodtype from './Charts/Woodtype';
import Customers from './Charts/Customers';
import CustomerTotal from './Charts/CustomersTotal';

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
  // {
  //   when: (row) => row.id + 100 !== row.orderNum,
  //   style: {
  //     backgroundColor: '#D1E3FA',
  //     '&:hover': {
  //       cursor: 'pointer',
  //     },
  //   },
  // },
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
  const { orders, role, searchOrders, loadOrders, user } = props;
  const [toggleCleared, setToggleCleared] = useState(false);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState(orders);
  const [startDate, setStartDate] = useState(moment(new Date()));
  const [endDate, setEndDate] = useState(moment(new Date()));
  const [startDateFocusedInput, setStartDateFocusedInput] = useState(null);
  const [endDateFocusedInput, setEndDateFocusedInput] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Quote');
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const minDate =
    orders?.length > 0
      ? new Date(orders[orders.length - 1].created_at)
      : new Date();

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
    } else {
      const search = `?created_at_gte=${moment(startDate)
        .startOf('day')
        .valueOf()}&created_at_lte=${moment(endDate)
        .endOf('day')
        .valueOf()}&status=Quote&_limit=50000&_sort=id:DESC`;
      searchOrders(cookie, user, search);
    }
  }, [startDate, endDate, filterStatus]);

  useEffect(() => {
    const filteredOrders = orders?.filter((item) => {
      let date = new Date(item.created_at);

      const dateOrdered = item?.tracking?.filter((x) => {
        return x.status === 'Ordered';
      });
      const dateInvoiced = item?.tracking?.filter((x) => {
        return x.status === 'Invoiced';
      });

      const dateCompleted = item?.tracking?.filter((x) => {
        return x.status === 'Complete';
      });

      const dateShipped = item?.tracking?.filter((x) => {
        return x.status === 'Shipped';
      });

      if (filterStatus === 'Ordered') {
        if (filterText?.length > 0) {
          return (
            moment(
              item.DateOrdered ||
                (dateOrdered.length > 0 ? dateOrdered[0]?.date : '1/1/1900')
            ) >= moment(startDate).startOf('day').valueOf() &&
            moment(
              item.DateOrdered ||
                (dateOrdered.length > 0 ? dateOrdered[0]?.date : '1/1/1900')
            ) <= moment(endDate).endOf('day').valueOf() &&
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
            moment(
              item.DateOrdered ||
                (dateOrdered.length > 0 ? dateOrdered[0]?.date : '1/1/1900')
            ) >= moment(startDate).startOf('day').valueOf() &&
            moment(
              item.DateOrdered ||
                (dateOrdered.length > 0 ? dateOrdered[0]?.date : '1/1/1900')
            ) <= moment(endDate).endOf('day').valueOf()
          );
        }
      } else if (filterStatus === 'Flagged') {
        return (
          moment(
            item.DateOrdered ||
              (dateOrdered.length > 0 ? dateOrdered[0]?.date : '1/1/1900')
          ) >= moment(startDate).startOf('day').valueOf() &&
          moment(
            item.DateOrdered ||
              (dateOrdered.length > 0 ? dateOrdered[0]?.date : '1/1/1900')
          ) <= moment(endDate).endOf('day').valueOf() &&
          item.balance_due < 0
        );
      } else if (filterStatus === 'One Piece') {
        console.log(
          'ddd==>>',
          item?.part_list?.filter((j) => {
            return j.orderType?.value === 'One_Piece';
          })
        );
        return item?.part_list?.filter((j) => {
          return (
            j.orderType?.name === 'One Piece' ||
            j.orderType?.name === 'One Piece DF' ||
            j.orderType?.name === 'Two Piece' ||
            j.orderType?.name === 'Two Piece DF'
          );
        }).length;
      } else if (filterStatus === 'Order Numbers') {
        return item.id + 100 !== item.orderNum;
      } else if (filterStatus === 'Invoiced') {
        if (filterText?.length > 0) {
          return (
            moment(
              item.DateInvoiced ||
                (dateInvoiced.length > 0 ? dateInvoiced[0]?.date : '1/1/1900')
            ) >= moment(startDate).startOf('day').valueOf() &&
            moment(
              item.DateInvoiced ||
                (dateInvoiced.length > 0 ? dateInvoiced[0]?.date : '1/1/1900')
            ) <= moment(endDate).endOf('day').valueOf() &&
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
            moment(
              item.DateInvoiced ||
                (dateInvoiced.length > 0 ? dateInvoiced[0]?.date : '1/1/1900')
            ) >= moment(startDate).startOf('day').valueOf() &&
            moment(
              item.DateInvoiced ||
                (dateInvoiced.length > 0 ? dateInvoiced[0]?.date : '1/1/1900')
            ) <= moment(endDate).endOf('day').valueOf()
          );
        }
      } else if (filterStatus === 'Complete') {
        if (filterText?.length > 0) {
          return (
            moment(
              item.DateCompleted ||
                (dateCompleted.length > 0 ? dateCompleted[0]?.date : '1/1/1900')
            ) >= moment(startDate).startOf('day').valueOf() &&
            moment(
              item.DateCompleted ||
                (dateCompleted.length > 0 ? dateCompleted[0]?.date : '1/1/1900')
            ) <= moment(endDate).endOf('day').valueOf() &&
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
            moment(
              item.DateCompleted ||
                (dateCompleted.length > 0 ? dateCompleted[0]?.date : '1/1/1900')
            ) >= moment(startDate).startOf('day').valueOf() &&
            moment(
              item.DateCompleted ||
                (dateCompleted.length > 0 ? dateCompleted[0]?.date : '1/1/1900')
            ) <= moment(endDate).endOf('day').valueOf()
          );
        }
      } else if (filterStatus === 'Shipped') {
        if (filterText?.length > 0) {
          return (
            moment(
              item.DateShipped ||
                (dateShipped.length > 0 ? dateShipped[0]?.date : '1/1/1900')
            ) >= moment(startDate).startOf('day').valueOf() &&
            moment(
              item.DateShipped ||
                (dateShipped.length > 0 ? dateShipped[0]?.date : '1/1/1900')
            ) <= moment(endDate).endOf('day').valueOf() &&
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
            moment(
              item.DateShipped ||
                (dateShipped.length > 0 ? dateShipped[0]?.date : '1/1/1900')
            ) >= moment(startDate).startOf('day').valueOf() &&
            moment(
              item.DateShipped ||
                (dateShipped.length > 0 ? dateShipped[0]?.date : '1/1/1900')
            ) <= moment(endDate).endOf('day').valueOf()
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

  let columns = [
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
      name: 'Date Entered',
      cell: (row) => <div>{moment(row?.created_at).format('MMM Do YYYY')}</div>,
    },
    {
      name: 'Date Ordered',
      cell: (row) => {
        const dateOrdered = row?.tracking?.filter((x) => {
          return x.status === 'Ordered';
        });

        if (row.DateOrdered || dateOrdered.length > 0) {
          return (
            <div>
              {moment(row.DateOrdered || dateOrdered[0]?.date).format(
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
      name: 'Date Invoiced',
      cell: (row) => {
        const dateInvoiced = row?.tracking?.filter((x) => {
          return x.status === 'Invoiced';
        });

        if (row.DateInvoiced || dateInvoiced.length > 0) {
          return (
            <div>
              {moment(row.DateInvoiced || dateInvoiced[0]?.date).format(
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
      name: 'Salesman',
      cell: (row) => <div>{row.sale?.fullName}</div>,
      sortable: true,
    },
    {
      name: 'Terms',
      cell: (row) => (
        <div>
          {row.companyprofile && row.companyprofile?.PMT_TERMS
            ? row?.companyprofile?.PMT_TERMS
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

  let orderColumns = columns;

  if (filterStatus === 'Order Numbers') {
    orderColumns = columns.splice(2, 0, {
      name: 'Old Order #',
      cell: (row) => row.orderNum,
      sortable: true,
    });
  }

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
            : dateOrdered.length
            ? new Date(dateOrdered[0]?.date)
            : new Date(i.created_at),
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
      Invoice(newOrder, startDate, endDate, filterStatus);
    } else {
      Report1(newOrder, startDate, endDate, filterStatus);
    }

    setToggleCleared(!toggleCleared);
  };

  const exportEdgesHelper = () => {
    exportEdges(data);

    setToggleCleared(!toggleCleared);
  };

  const exportRazorHelper = () => {
    const { breakdowns } = props;

    exportRazorGauge(data, breakdowns);

    setToggleCleared(!toggleCleared);
  };

  return (
    <div>
      <Row className="mb-3">
        <Col lg="9" />
        <Col>
          <Row>
            <Col>
              <h3>
                Filter Date{' '}
                {filterStatus === 'Quote' ? 'Entered' : filterStatus}
              </h3>
            </Col>
          </Row>
          {filterStatus !== 'Order Numbers' ? (
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
                  {reportStatus.map((i, index) => (
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
              (role?.type === 'authenticated' ||
                role?.type === 'owner' ||
                role?.type === 'administrator') ? (
                <h3>
                  Order Total: $
                  {data
                    .reduce(
                      (acc, item) => acc + Math.round(100 * item.total) / 100,
                      0
                    )
                    .toFixed(2)}
                </h3>
              ) : null}
              {role &&
              (role?.type === 'authenticated' ||
                role?.type === 'owner' ||
                role?.type === 'administrator') ? (
                <h3>
                  Net Total: $
                  {data
                    .reduce(
                      (acc, item) =>
                        acc + Math.round(100 * (item.total - item.tax)) / 100,
                      0
                    )
                    .toFixed(2)}
                </h3>
              ) : null}
              {role &&
              (role.type === 'authenticated' ||
                role.type === 'owner' ||
                role.type === 'administrator') ? (
                <h3>
                  Tax Total: $
                  {data
                    .reduce(
                      (acc, item) => acc + Math.round(100 * item.tax) / 100,
                      0
                    )
                    .toFixed(2)}
                </h3>
              ) : null}
              {role &&
              (role.type === 'authenticated' ||
                role.type === 'owner' ||
                role.type === 'administrator') &&
              filterStatus === 'Flagged' ? (
                <h3>
                  Balances: $
                  {data
                    .reduce(
                      (acc, item) =>
                        acc + Math.round(100 * item.balance_due) / 100,
                      0
                    )
                    .toFixed(2)}
                </h3>
              ) : null}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <h3># Of Orders: {data?.length}</h3>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        {/* <Col lg='11' /> */}
        <Col>
          {role?.type === 'authenticated' ||
          role?.type === 'owner' ||
          role?.type === 'administrator' ? (
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
          ) : null}
          <Tooltip
            title="Export Edges"
            onClick={exportEdgesHelper}
            placement="top"
            className="mb-3 mt-3"
          >
            <IconButton>
              <GetAppIcon style={{ width: '40', height: '40' }} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Export Razorgauge"
            onClick={exportRazorHelper}
            placement="top"
            className="mb-3 mt-3"
          >
            <IconButton>
              <GetAppIcon style={{ width: '40', height: '40' }} />
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
        // subHeaderComponent={subHeaderComponentMemo}
        paginationRowsPerPageOptions={[10, 30, 50, 100, 200, 500, 1000]}
      />
      {modal ? (
        <OrderPage
          toggle={toggle}
          modal={modal}
          editable={editable}
          edit={edit}
        />
      ) : null}

      {(role?.type === 'authenticated' ||
        role?.type === 'owner' ||
        role?.type === 'administrator') &&
      data?.length ? (
        <div>
          <Row>
            <Col>
              <h3># of items sold</h3>
            </Col>
          </Row>
          <Row>
            <Col lg={2}>
              <Chart3 orders={data} startDate={startDate} endDate={endDate} />
            </Col>

            <Col lg={2}>
              <Woodtype orders={data} startDate={startDate} endDate={endDate} />
            </Col>

            <Col lg={2}>
              <Chart2 orders={data} startDate={startDate} endDate={endDate} />
            </Col>

            <Col lg={2}>
              <Profiles orders={data} startDate={startDate} endDate={endDate} />
            </Col>
            <Col lg={2}>
              <Panels orders={data} startDate={startDate} endDate={endDate} />
            </Col>
            <Col lg={2}>
              <Edges orders={data} startDate={startDate} endDate={endDate} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Customers
                orders={data}
                startDate={startDate}
                endDate={endDate}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CustomerTotal
                orders={data}
                startDate={startDate}
                endDate={endDate}
              />
            </Col>
          </Row>
        </div>
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
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateStatus,
      loadOrders,
      searchOrders,
      setSelectedOrder,
      setOrderType,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrderTable);
