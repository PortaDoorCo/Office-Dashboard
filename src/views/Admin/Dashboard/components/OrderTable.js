import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import OrderPage from '../../Orders/OrderPage';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
import { Select } from 'antd';
import { updateStatus, loadOrders, setSelectedOrder } from '../../../../redux/orders/actions';
import Cookies from 'js-cookie';
import {Button} from 'reactstrap';


const cookie = Cookies.get('jwt');
const { Option } = Select;


const status = [
  {
    label: 'Quote',
    value: 'Quote',
  },
  {
    label: 'Invoiced',
    value: 'Invoiced',
  },
  {
    label: 'Ordered',
    value: 'Ordered',
  },
  {
    label: 'In Production',
    value: 'In Production',
  },
  {
    label: 'Station 1',
    value: 'Station 1',
  },
  {
    label: 'Station 2',
    value: 'Station 2',
  },
  {
    label: 'Station 3',
    value: 'Station 3',
  },
  {
    label: 'Station 4',
    value: 'Station 4',
  },
  {
    label: 'Complete',
    value: 'Complete',
  },
  {
    label: 'Shipped',
    value: 'Shipped',
  },
  {
    label: 'LATE',
    value: 'LATE',
  },
];

const conditionalRowStyles = [
  {
    when: row => row.late === true,
    style: {
      backgroundColor: '#FEEBEB',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
];


const OrderTable = (props) => {
  const [setSelectedRows] = useState([]);
  const [toggleCleared] = useState(false);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);



  const handleStatusChange = async (e, row) => {
    const { updateStatus } = props;
    const status = {
      status: e
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
      name: 'PO #',
      selector: 'job_info.poNum',
      sortable: true,
    },
    {
      name: 'Job Name',
      selector: 'job_info.jobName',
      sortable: true,
    },
    {
      name: 'Company',
      selector: 'job_info.customer.Company',
      sortable: true,
      grow: 2

    },
    {
      name: 'Order Type',
      selector: 'orderType',
      sortable: true,
 
    },
    {
      name: 'Date Ordered',
      cell: row => <div>{moment(row.createdAt).format('MMM Do YYYY')}</div>,
    },
    {
      name: 'Due Date',
      cell: row => <div>{moment(row.dueDate).format('MMM Do YYYY')}</div>,
    },
    {
      name: 'Status',
      grow: 1,
      cell: row => <Select defaultValue={row.status} style={{ width: '100%' }} onChange={(e) => handleStatusChange(e, row)} bordered={false}>
        {status.map((i,index) => (
          <Option key={index} value={i.value}>{i.value}</Option>
        ))}
      </Select>
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
      cell: row => <div>${row.total.toFixed(2)}</div>,
    },
    {
      name: ' ',
      button: true,
      grow: 2,
      cell: (row) => <Tooltip title="View Order" placement="top">
        <IconButton onClick={function (event) {
          event.preventDefault();
          toggle(row);
        }} id={row.id}>
          <Inbox>Open</Inbox>
        </IconButton>
      </Tooltip>,
    },


  ];

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, [setSelectedRows]);

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


  return (
    <div>
      <DataTable
        title="Orders"
        columns={columns}
        data={props.orders}
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        pagination
        progressPending={!props.ordersDBLoaded}
        highlightOnHover
        conditionalRowStyles={conditionalRowStyles}
      />
      {
        modal ?
          <OrderPage
            toggle={toggle}
            modal={modal}
            editable={editable}
            edit={edit}
          /> : null
      }
    </div>

  );


};

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  orderNum: state.Orders.orderNum,
  ordersDBLoaded: state.Orders.ordersDBLoaded
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateStatus,
      loadOrders,
      setSelectedOrder
    },
    dispatch
  );




export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderTable);