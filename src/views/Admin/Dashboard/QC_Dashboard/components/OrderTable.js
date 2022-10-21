import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import OrderPage from '../../../Orders/OrderPage';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Print';
// import { Select } from 'antd';
import {
  updateStatus,
  loadOrders,
  searchOrders,
  setSelectedOrder,
  setOrderType,
} from '../../../../../redux/orders/actions';
import Cookies from 'js-cookie';
import { Button, Row, Col, FormGroup, Input, InputGroup } from 'reactstrap';
import styled from 'styled-components';
import status from '../../../../../utils/status';
import { useDebounce } from 'use-debounce';
import PrintModal from '../../../../PrintOuts/Modal/Modal';
import LoadingModal from '../../../../../utils/LoadingModal';

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
    when: (row) => row.late === true,
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
  const { orders, user, searchOrders } = props;
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState(orders);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [debounceValue] = useDebounce(encodeURIComponent(filterText), 500);
  const [selectedSearch, setSelectedSearch] = useState('ID');
  const [loadingModal, setLoadingModal] = useState(false);

  // useEffect(() => {
  //   if (debounceValue) {
  //     const search = `?status_ne=Quote&_id=${parseInt(debounceValue) - 100}`;

  //     props.searchOrders(cookie, user, search);
  //   } else {
  //     if (debounceValue === '') {
  //       props.loadOrders(cookie, user);
  //     }
  //   }
  // }, [debounceValue]);

  useEffect(() => {
    if (debounceValue) {
      let search = `?status_ne=Quote&_id=${parseInt(debounceValue) - 100}`;

      if (selectedSearch === 'PO') {
        search = `?poNum_contains=${debounceValue}&status_ne=Quote&_sort=id:DESC`;
      } else if (selectedSearch === 'Customer') {
        search = `?companyprofile.Company_contains=${debounceValue}&status_ne=Quote&_sort=id:DESC&_limit=500`;
      } else {
        search = `?status_ne=Quote&_id=${parseInt(debounceValue) - 100}`;
      }

      props.searchOrders(cookie, user, search);
    } else {
      if (debounceValue === '') {
        props.loadOrders(cookie, user);
      }
    }
  }, [debounceValue, selectedSearch]);

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
      cell: (row) => <div>{row.job_info && row.job_info.poNum}</div>,
      sortable: true,
    },
    {
      name: 'Order Type',
      selector: 'orderType',
      sortable: true,
    },
    {
      name: 'Date Ordered',
      cell: (row) => <div>{moment(row.created_at).format('MMM Do YYYY')}</div>,
    },
    {
      name: 'Due Date',
      cell: (row) => (
        <div>
          {row.status === 'Quote'
            ? 'TBD'
            : moment(row.dueDate).format('MMM Do YYYY')}
        </div>
      ),
    },
    {
      name: 'Status',
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
                  {status.map((i, index) => (
                    <option key={index} value={i.value}>
                      {i.value}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          {row.job_info?.Rush && row.job_info?.Sample ? (
            <Row>
              <Col style={{ textAlign: 'center', color: 'red' }}>
                {row.job_info?.Rush && row.job_info?.Sample
                  ? 'Sample / Rush'
                  : row.job_info?.Rush
                  ? 'Rush'
                  : row.job_info?.Sample
                  ? 'Sample'
                  : ''}
              </Col>
            </Row>
          ) : null}
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
    const { setSelectedOrder, setOrderType, selectedOrder } = props;

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

  const toggleLoadingModal = () => {
    setLoadingModal(!loadingModal);
  };

  return (
    <div>
      <PrintModal {...props} toggle={toggle} modal={modal} />
      <LoadingModal
        modal={loadingModal}
        toggle={toggleLoadingModal}
        message={
          <div>
            <center>
              <h3>Loading...</h3>
            </center>
          </div>
        }
        title={'Loading'}
      />
      <Row className="mb-3">
        <Col lg="8" />
        <Col>
          <Row className="mb-3">
            <Col style={{ float: 'right' }}>
              <InputGroup>
                <Input
                  type="select"
                  name="select"
                  id="searchID"
                  value={selectedSearch}
                  onChange={(e) => setSelectedSearch(e.target.value)}
                >
                  <option value={'ID'}>Search ID</option>
                  <option value={'PO'}>Search PO Num</option>
                  <option value={'Customer'}>Search Customer</option>
                </Input>
                <Input
                  style={{ width: '300px' }}
                  onChange={(e) => setFilterText(e.target.value)}
                  value={filterText}
                />

                <Button color="danger" onClick={() => setFilterText('')}>
                  X
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Col>
      </Row>
      <DataTable
        title="Orders"
        className="order-table3"
        columns={columns}
        data={orders}
        pagination
        progressPending={!props.ordersDBLoaded}
        highlightOnHover
        conditionalRowStyles={conditionalRowStyles}
        subHeader
        // subHeaderComponent={subHeaderComponentMemo}
      />
      {/* {modal ? (
        <OrderPage
          toggle={toggle}
          modal={modal}
          editable={editable}
          edit={edit}
        />
      ) : null} */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  orderNum: state.Orders.orderNum,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  user: state.users.user,
  printer_options: state.misc_items.printer_options,
  selectedOrder: state.Orders.selectedOrder,
  breakdowns: state.part_list.breakdowns,
  box_breakdowns: state.part_list.box_breakdowns,
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
