import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import OrderPage from '../../../Orders/OrderPage';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
// import { Select } from 'antd';
import { updateStatus, loadOrders, setSelectedOrder, setOrderType } from '../../../../../redux/orders/actions';
import Cookies from 'js-cookie';
import { Button, Row, Col, FormGroup, Input } from 'reactstrap';
import styled from 'styled-components';
import status from '../../../../../utils/status';

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
// const { Option } = Select;

const conditionalRowStyles = [
  {
    when: (row: { late: any, Shipping_Scheduled: any, status: String, dueDate: any }) => {
      return (moment(row.dueDate).startOf('day').valueOf() < moment(new Date()).startOf('day').valueOf()) && (row.Shipping_Scheduled || (!row.status.includes('Quote') &&
      !row.status.includes('Invoiced') &&
      !row.status.includes('Ordered') &&
      !row.status.includes('Shipped')));
    },
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
    <TextField id="search" type="text" placeholder="Search Orders" value={filterText} onChange={onFilter} autoComplete='off' />
    <ClearButton type="button" color="danger" onClick={onClear}>X</ClearButton>
  </>
);


type TablePropTypes = {
  setSelectedOrder: (date: any) => null,
  setOrderType: (date: any) => null,
  orders: Array<any>,
  updateStatus: any,
  ordersDBLoaded: boolean
}


const OrderTable = (props: TablePropTypes) => {
  const { orders } = props;
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState(orders);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  useEffect(() => {
    const filteredOrders = orders?.length > 0 ? orders?.filter((item) => {
      if (filterText.length > 0) {
        return (
          (item.orderNum?.toString().includes(filterText) || item.job_info?.customer?.Company.toLowerCase().includes(filterText.toLowerCase()) || item.job_info?.poNum?.toLowerCase().includes(filterText.toLowerCase()))
        );
      } else {
        return item;
      }
    }) : [];
    setData(filteredOrders);
  }, [orders, filterText]);

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />;
  }, [filterText, resetPaginationToggle]);



  const handleStatusChange = async (e: any, row: { id: string }) => {
    const { updateStatus } = props;
    const status = {
      status: e.target.value
    };

    await updateStatus(row.id, row, status, cookie);
  };

  const columns = [
    {
      name: 'Company',
      cell: row => <div>{row.job_info && row.job_info.customer && row.job_info.customer.Company}</div>,
      sortable: true,
      grow: 2

    },
    {
      name: 'Order #',
      selector: 'orderNum',
      sortable: true,
    },
    {
      name: 'PO #',
      cell: row => <div>{row.job_info && row.job_info.poNum}</div>,
      sortable: true,
    },
    {
      name: 'Order Type',
      selector: 'orderType',
      sortable: true,

    },
    {
      name: 'Date Entered',
      cell: row => <div>{moment(row.created_at).format('MMM Do YYYY')}</div>,
    },
    {
      name: 'Date Ordered',
      cell: row => {

        const dateOrdered = row?.tracking?.filter((x) => {
          console.log({x});
          return x.status === 'Ordered';
        }
        );

        if(dateOrdered.length > 0){
          return (
            <div>{moment(dateOrdered[0].date).format('MMM Do YYYY')}</div>
          );
        } else {
          return (
            <div>TBD</div>
          );
        }
      },
    },
    {
      name: 'Est. Shipping',
      cell: row => <div>{row.Shipping_Scheduled || (!row.status.includes('Quote') &&
      !row.status.includes('Invoiced') &&
      !row.status.includes('Ordered') &&
      !row.status.includes('Shipped'))
        ? moment(row.dueDate).format('MMM Do YYYY')
        : 'TBD'}</div>,
    },
    {
      name: 'Status',
      cell: row => <div>
        <Row>
          <Col>
            <FormGroup style={{ height: '100%'}}>
              <Input type="select" name="select" id="status_dropdown" defaultValue={row.status} style={{ height: '100%', boxShadow: 'none', border: '0px', outline: '0px', background: 'none'}} onChange={(e) => handleStatusChange(e,row)}>
                {status.map((i, index) => (
                  <option key={index} value={i.value}>{i.value}</option>
                ))}
              </Input>
            </FormGroup> 
          </Col>
        </Row>

        {row.job_info?.Rush && row.job_info?.Sample ? 
          <Row>
            <Col style={{ textAlign: 'center', color: 'red' }}>
              {row.job_info?.Rush && row.job_info?.Sample ? 'Sample / Rush' : row.job_info?.Rush ? 'Rush' : row.job_info?.Sample ? 'Sample' : ''}
            </Col>
          </Row> : null
        } 
      </div>
    },
    {
      name: 'Submitted By',
      cell: row => <div>{row.user && row.user.FirstName ? row.user.FirstName : ''}</div>,
      sortable: true,
    },

    {
      name: 'Total',
      selector: 'total',
      sortable: true,
      cell: row => <div>${row.total && row.total.toFixed(2)}</div>,
    },
    {
      name: 'Balance Paid',
      sortable: true,
      cell: row => <div>${(row.balance_history && row.balance_history.reduce((acc, item) => acc + item.balance_paid, 0)?.toFixed(2))}</div>,
    },
    {
      name: 'Terms',
      cell: row => <div>{row.companyprofile && row.companyprofile.PMT_TERMS ? row.companyprofile.PMT_TERMS  : ''}</div>,
      sortable: true,
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

  const toggle = (row: { orderType: any }) => {

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


  return (
    <div>
      <DataTable
        title="Orders"
        className="order-table3"
        columns={columns}
        data={data}
        pagination
        progressPending={!props.ordersDBLoaded}
        highlightOnHover
        conditionalRowStyles={conditionalRowStyles}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
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

const mapStateToProps = (state: any) => ({
  orderNum: state.Orders.orderNum,
  ordersDBLoaded: state.Orders.ordersDBLoaded
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      updateStatus,
      loadOrders,
      setSelectedOrder,
      setOrderType
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderTable);