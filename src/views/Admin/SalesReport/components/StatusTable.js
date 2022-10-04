import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import OrderPage from '../../Orders/OrderPage';
import { Row, Col, FormGroup, Input } from 'reactstrap';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
import { Select } from 'antd';
import {
  updateStatus,
  loadOrders,
  setSelectedOrder,
  setOrderType,
} from '../../../../redux/orders/actions';
import Cookies from 'js-cookie';
// import momentLocaliser from 'react-widgets-moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import Receipt from '@material-ui/icons/Receipt';
import SalesmenReport from '../../../PrintOuts/Reports/SalesmenReport';
import status from '../../../../utils/status';
import currency from 'currency.js';

// momentLocaliser(moment);

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

const StatusTable = (props) => {
  const { orders, salesRep, role } = props;
  const [toggleCleared, setToggleCleared] = useState(false);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState(orders);

  useEffect(() => {
    const filteredOrders = orders?.filter((item) => {
      let date = new Date(item.created_at);

      return item?.job_info?.salesRep
        ? item?.job_info?.salesRep?.fullName.includes(props.accountName)
        : item?.sale?.fullName?.includes(props.accountName);
    });
    setData(filteredOrders);
  }, [
    orders,
    props.filterStatus,
    props.accountName,
    props.startDate,
    props.endDate,
    salesRep,
  ]);

  const handleStatusChange = async (e, row) => {
    const { updateStatus, user } = props;
    const status = {
      status: e,
    };
    await updateStatus(row.id, row, status, user, cookie);
  };

  let columns = [
    {
      name: 'Order #',
      cell: (row) => row.id + 100,
      sortable: true,
    },
    {
      name: 'Company',
      cell: (row) => <div>{row.job_info?.customer?.Company}</div>,
      sortable: true,
      grow: 2,
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
      name: 'Status',
      grow: 1,
      cell: (row) => (
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
            >
              {status.map((i, index) => (
                <option key={index} value={i.value}>
                  {i.value}
                </option>
              ))}
            </Input>
          )}
        </FormGroup>
      ),
    },
    {
      name: 'Total',
      selector: 'total',
      sortable: true,
      cell: (row) => <div>${row.total?.toFixed(2)}</div>,
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

  if (role?.type === 'administrator' || role?.owner === 'owner') {
    columns = [
      {
        name: 'Order #',
        cell: (row) => row.id + 100,
        sortable: true,
      },
      {
        name: 'Company',
        cell: (row) => <div>{row.job_info?.customer?.Company}</div>,
        sortable: true,
        grow: 2,
      },
      {
        name: 'Order Type',
        selector: 'orderType',
        sortable: true,
      },
      {
        name: 'Date Entered',
        cell: (row) => (
          <div>{moment(row?.created_at).format('MMM Do YYYY')}</div>
        ),
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
        name: 'Status',
        grow: 1,
        cell: (row) => (
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
              >
                {status.map((i, index) => (
                  <option key={index} value={i.value}>
                    {i.value}
                  </option>
                ))}
              </Input>
            )}
          </FormGroup>
        ),
      },
      {
        name: 'Total',
        selector: 'total',
        sortable: true,
        cell: (row) => <div>${row.total?.toFixed(2)}</div>,
      },
      {
        name: 'Commission',
        cell: (row) => <div>{row.companyprofile?.SC * 100}%</div>,
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

    if (props.filterStatus === 'Ordered') {
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

    SalesmenReport(
      newOrder,
      props.startDate,
      props.endDate,
      props.accountName,
      props.role
    );
    setToggleCleared(!toggleCleared);
  };

  return (
    <div>
      <div>
        <Row className="mb-3">
          <Col lg="9" />
          <Col>
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
                  role.type === 'administrator') ? (
                  <h3>
                    Commission: $
                    {data
                      .reduce(
                        (acc, item) =>
                          acc +
                          currency(
                            (item.total - item.tax) *
                              (item.companyprofile.SC
                                ? item.companyprofile.SC
                                : 0)
                          ).value,
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
      </div>
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
  orderNum: state.Orders.orderNum,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  breakdowns: state.part_list.breakdowns,
  box_breakdowns: state.part_list.box_breakdowns,
  user: state.users.user,
  role: state.users.user.role,
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

export default connect(mapStateToProps, mapDispatchToProps)(StatusTable);
