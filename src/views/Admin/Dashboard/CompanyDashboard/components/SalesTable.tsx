import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import OrderPage from '../../../Orders/OrderPage';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
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
    when: (row: {
      late: any;
      Shipping_Scheduled: any;
      status: String;
      dueDate: any;
    }) => {
      return (
        moment(row.dueDate).startOf('day').valueOf() <
          moment(new Date()).startOf('day').valueOf() &&
        row.Shipping_Scheduled &&
        !row.status.includes('Quote') &&
        !row.status.includes('Invoiced') &&
        !row.status.includes('Complete') &&
        !row.status.includes('Shipped')
      );
    },
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
      placeholder="Search Order ID"
      value={filterText}
      onChange={onFilter}
      autoComplete="off"
    />
    <ClearButton type="button" color="danger" onClick={onClear}>
      X
    </ClearButton>
  </>
);

type TablePropTypes = {
  setSelectedOrder: (date: any) => null;
  setOrderType: (date: any) => null;
  loadOrders: (date: any, user: any) => null;
  searchOrders: (date: any, user: any, search: any) => null;
  orders: Array<any>;
  updateStatus: any;
  ordersDBLoaded: boolean;
  user: any;
};

const OrderTable = (props: TablePropTypes) => {
  const { orders, user } = props;
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState(orders);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [debounceValue] = useDebounce(encodeURIComponent(filterText), 500);
  const [selectedSearch, setSelectedSearch] = useState('ID');

  useEffect(() => {
    if (debounceValue) {
      let search = `?id=${parseInt(debounceValue) - 100}`;

      if (selectedSearch === 'PO') {
        search = `?poNum_contains=${debounceValue}&_sort=id:DESC`;
      } else if (selectedSearch === 'Customer') {
        search = `?companyprofile.Company_contains=${debounceValue}&_sort=id:DESC&_limit=500`;
      } else {
        search = `?id=${parseInt(debounceValue) - 100}`;
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
      name: 'Date Entered',
      cell: (row) => <div>{moment(row.created_at).format('MMM Do YYYY')}</div>,
    },
    {
      name: 'Date Ordered',
      cell: (row) => {
        if (row.DateOrdered) {
          return <div>{moment(row.DateOrdered).format('MMM Do YYYY')}</div>;
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
      name: 'Submitted By',
      cell: (row) => (
        <div>{row.user && row.user.FirstName ? row.user.FirstName : ''}</div>
      ),
      sortable: true,
    },

    {
      name: 'Total',
      selector: 'total',
      sortable: true,
      cell: (row) => <div>${row.total && row.total.toFixed(2)}</div>,
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
      name: 'Terms',
      cell: (row) => (
        <div>
          {row.companyprofile && row.companyprofile.PMT_TERMS
            ? row.companyprofile.PMT_TERMS
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

const mapStateToProps = (state: any) => ({
  orderNum: state.Orders.orderNum,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  user: state.users.user,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      updateStatus,
      loadOrders,
      setSelectedOrder,
      setOrderType,
      searchOrders,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrderTable);
