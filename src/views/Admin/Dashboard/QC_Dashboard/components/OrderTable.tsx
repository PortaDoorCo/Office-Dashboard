import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import OrderPage from '../../../Orders/OrderPage';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
import { Select } from 'antd';
import { updateStatus, loadOrders, setSelectedOrder } from '../../../../../redux/orders/actions';
import Cookies from 'js-cookie';
import { Button, Row, Col, FormGroup, Input } from 'reactstrap';
import styled from 'styled-components';
import status from '../../../../../utils/QC_Status';
import 'antd/dist/antd.css';

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

const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;


const cookie = Cookies.get('jwt');
const { Option } = Select;

const conditionalRowStyles = [
  {
    when: (row: { late: any }) => row.late === true,
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
    <TextField id="search" type="text" placeholder="Search Orders" value={filterText} onChange={onFilter} />
    <ClearButton type="button" color="danger" onClick={onClear}>X</ClearButton>
  </>
);


type TablePropTypes = {
  setSelectedOrder: (date: any) => null,
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
        if(item.status === 'Quote'){
          return null;
        } else {
          return item;
        }

        
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
      status: e
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
      name: 'Date Ordered',
      cell: row => <div>{moment(row.created_at).format('MMM Do YYYY')}</div>,
    },
    {
      name: 'Due Date',
      cell: row => <div>{row.status === 'Quote' ? 'TBD' : moment(row.dueDate).format('MMM Do YYYY')}</div>,
    },
    {
      name: 'Status',
      grow: 1,
      cell: row => <div>


        <Row>
          <Col>
            <Row>
              <Col>
                <FormGroup style={{ height: '100%'}}>
                  <Input type="select" name="select" id="status_dropdown" defaultValue={row.status} style={{ height: '100%', boxShadow: 'none', border: '0px', outline: '0px', background: 'none'}} onChange={(e) => handleStatusChange(e,row)}>
                    <option value={row.status}>{row.status}</option>
                    {status.map((i, index) => (
                      <option key={index} value={i.value}>{i.value}</option>
                    ))}
                  </Input>
                </FormGroup> 
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    },
  ];

  const toggle = (row: {}) => {

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
      {data.length > 0 ?
        <DataTable
          title="Quality Control"
          className="order-table3"
          columns={columns}
          data={data}
          pagination
          progressPending={!props.ordersDBLoaded}
          highlightOnHover
          conditionalRowStyles={conditionalRowStyles}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
        /> :loading()
      }

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
      setSelectedOrder
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderTable);