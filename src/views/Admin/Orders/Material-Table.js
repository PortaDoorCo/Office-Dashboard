import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Input,
  Button,
  Row,
  Col
} from 'reactstrap';
import OrderPage from './OrderPage';
import DataTable from 'react-data-table-component';
import { Checkbox, Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox'
import differenceBy from 'lodash/differenceBy';
import { DateTimePicker } from 'react-widgets'
import moment from 'moment'
import momentLocaliser from 'react-widgets-moment'

momentLocaliser(moment)



const OrderTable = (props) => {
  const { orders } = props;
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(props.orders);
  const [modal, setModal] = useState(false)
  const [edit, setEdit] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState([])
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);


  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  const editable = () => {
    setEdit(!edit)
  }

  const toggle = (row) => {
    setModal(!modal);
    setEdit(false)

    if (!modal) {
      setSelectedOrder(
        [
          {
            id: row.id,
            jobInfo: row.jobInfo,
            jobName: row.jobInfo.jobName,
            status: row.status,
            poNum: row.jobInfo.poNum,
            part_list: row.part_list,
            dimensions: row.dimensions,
            shippingAddress: row.jobInfo,
            linePrice: row.linePrice,
            total: row.total,
            orderNum: row.orderNum,
            orderType: row.orderType,
            itemPrice: row.itemPrice,
            subTotals: row.subTotals
          }
        ]
      )
    } else {
      return
    }


  }

  const columns = useMemo(clickHandler => [

    {
      selector: 'orderNum',
      name: 'Order Number',
      sortable: true

    },
    {
      selector: 'jobInfo.customer.Company',
      name: 'Company Name',
      sortable: true

    },
    {
      selector: 'orderType',
      name: 'Order Type',
      sortable: true
    },
    {
      selector: 'total',
      name: 'Order Total',

    },
    {
      selector: 'status',
      name: 'Status',
      sortable: true
    },
    {
      selector: 'createdAt',
      name: 'Date Ordered',
      cell: row => <span>{moment(row.createdAt).format('ddd MM/D/YYYY')}</span>,
      sortable: true

    },
    {
      selector: 'DueDate',
      name: 'Due Date',
      cell: row => <span>{moment(row.DueDate).format('ddd MM/D/YYYY')}</span>,
      sortable: true
    },
    {
      name: '',
      button: true,
      cell: row => <Tooltip title="View Order" placement="top">
        <IconButton onClick={function (event) {
          event.preventDefault()
          toggle(row)
        }} id={row.id}>
          <Inbox>Open</Inbox>
        </IconButton>
      </Tooltip>
    },
  ]);

  const contextActions = useMemo(() => {
    const handleDelete = () => {

      if (window.confirm(`Are you sure you want to print Order Number:\r ${selectedRows.map(r => r.orderNum)}?`)) {
        return
      }
    };

    return <Button key="delete" color="primary" onClick={handleDelete} icon>Print</Button>;
  }, [data, selectedRows, toggleCleared]);

  return (
    <div>

      <DataTable
        title="Orders"
        columns={columns}
        data={orders}
        // selectableRows
        highlightOnHover
        pagination
        contextActions={contextActions}
        // selectableRowsComponent={Checkbox}
        // onRowSelected={handleRowSelected}
        // clearSelectedRows={toggleCleared}
        paginationResetDefaultPage={resetPaginationToggle}
      // subHeader
      // subHeaderComponent={subHeaderComponentMemo}
      />

      <OrderPage
        toggle={toggle}
        modal={modal}
        selectedOrder={selectedOrder}
        editable={editable}
        edit={edit}
      />
    </div>
  );
};

export default OrderTable;