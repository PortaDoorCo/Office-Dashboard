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

// momentLocaliser(moment);

const cookie = Cookies.get('jwt');
const { Option } = Select;

const conditionalRowStyles = [
  {
    when: (row) =>
      moment(row.dueDate).startOf('day').valueOf() <
        moment(new Date()).startOf('day').valueOf() &&
      (row.Shipping_Scheduled ||
        (!row.status.includes('Quote') &&
          !row.status.includes('Invoiced') &&
          !row.status.includes('Ordered') &&
          !row.status.includes('Shipped'))),
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
  const [toggleCleared, setToggleCleared] = useState(false);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState(orders);



  useEffect(() => {
    const filteredOrders = orders?.filter((item) => {
      let date = new Date(item.created_at);

      return (
        item.sale &&
        item.sale.fullName &&
        item.sale.fullName.includes(props.accountName)
      );
    });
    setData(filteredOrders);
  }, [
    orders,
    props.filterStatus,
    props.accountName,
    props.startDate,
    props.endDate,
  ]);

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

        if (dateOrdered.length > 0) {
          return <div>{moment(dateOrdered[0].date).format('MMM Do YYYY')}</div>;
        } else {
          return <div>TBD</div>;
        }
      },
    },
    {
      name: 'Est. Shipping',
      cell: (row) => (
        <div>
          {row.Shipping_Scheduled ||
          (!row.status.includes('Quote') &&
            !row.status.includes('Invoiced') &&
            !row.status.includes('Ordered') &&
            !row.status.includes('Shipped'))
            ? moment(row.dueDate).format('MMM Do YYYY')
            : 'TBD'}
        </div>
      ),
    },
    {
      name: 'Status',
      grow: 1,
      cell: (row) => (
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
    SalesmenReport(data, props.startDate, props.endDate, props.accountName);
    setToggleCleared(!toggleCleared);
  };

  return (
    <div>
      <div>
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
