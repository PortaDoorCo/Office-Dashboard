import React, { useState, useMemo, useEffect } from 'react';
import {
  Input,
  Button,
  Row,
  Col
} from 'reactstrap';
import OrderPage from '../../../Orders/OrderPage';
import moment from 'moment';

import DataTable from 'react-data-table-component';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
import differenceBy from 'lodash/differenceBy';
import { setSelectedOrder } from '../../../../../redux/orders/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import Cookies from 'js-cookie';
import status from '../../../../../utils/status';

const cookie = Cookies.get('jwt');

const { Option } = Select;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <div>
      <Row>
        <Col>
          <Input id="search" type="text" placeholder="Order Number" value={filterText} onChange={onFilter} />
        </Col>
      </Row>
    </div>
  </>
);

const CustomerOrders = (props) => {
  const [selectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(props.orders);
  const [modal, setModal] = useState(false);
  const [orderEdit, setOrderEdit] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);




  useEffect(() => {

    const filteredItems = props.orders.filter(item => item.orderNum && item.orderNum.toString().includes(filterText));
    setData(filteredItems);
  }, [filterText, props.orders]);

  const subHeaderComponentMemo = useMemo(clickHandler => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />;
  }, [filterText, resetPaginationToggle]);

  const toggle = (row) => {
    const { setSelectedOrder } = props;
    setModal(!modal);
    if (!modal) {
      setSelectedOrder(row);
    } else {
      setSelectedOrder(null);
    }
  };

  const editable = () => {
    setOrderEdit(!orderEdit);
  };

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
      name: 'Order Type',
      selector: 'orderType',
      sortable: true,
    },
    // {
    //   name: 'Date Ordered',
    //   cell: row => <div>{moment(row.created_at).format('MMM Do YYYY')}</div>,
    // },
    // {
    //   name: 'Due Date',
    //   cell: row => <div>{row.status === 'Quote' ? 'TBD' : moment(row.dueDate).format('MMM Do YYYY')}</div>,
    // },
    {
      name: 'Status',
      grow: 1,
      cell: row => <div>


        <Row>
          <Col>
            <Select defaultValue={row.status} style={{ width: '100%' }} onChange={(e) => handleStatusChange(e, row)} bordered={false}>
              {status.map((i, index) => (
                <Option key={index} value={i.value}>{i.value}</Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Row>
          <Col style={{ textAlign: 'center', color: 'red' }}>
            {row.job_info.Rush && row.job_info.Sample ? 'Sample / Rush' : row.job_info.Rush ? 'Rush' : row.job_info.Sample ? 'Sample' : ''}
          </Col>
        </Row>

      </div>
    },
    {
      name: 'Total',
      selector: 'total',
      sortable: true,
      cell: row => <div>${row.total && row.total.toFixed(2)}</div>,
    },
    // {
    //   name: 'Balance Paid',
    //   sortable: true,
    //   cell: row => <div>${row.balance_history && row.balance_history.reduce((acc, item) => acc + item.balance_paid, 0)}</div>,
    // },
    // {
    //   name: 'Terms',
    //   selector: 'companyprofile.PMT_TERMS',
    //   sortable: true,
    // },
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

  const contextActions = useMemo(() => {
    const handleDelete = () => {

      if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.orderNum)}?`)) {
        setToggleCleared(!toggleCleared);
        setData(differenceBy(data, selectedRows, 'orderNum'));
      }
    };

    return <Button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }} icon>Delete</Button>;
  }, [data, selectedRows, toggleCleared]);

  return (
    <div className='resize'>
      <DataTable
        columns={columns}
        data={data}
        // selectableRows
        highlightOnHover
        pagination
        contextActions={contextActions}
        // selectableRowsComponent={Checkbox}
        // onRowSelected={handleRowSelected}
        // clearSelectedRows={toggleCleared}
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
      />
      {
        modal ?
          <OrderPage
            toggle={toggle}
            modal={modal}
            selectedOrder={props.selectedOrder}
            editable={editable}
            edit={orderEdit}
          /> : null
      }

    </div>
  );
};

const mapStateToProps = (state, prop) => ({

});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setSelectedOrder
    },
    dispatch
  );




export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerOrders);

