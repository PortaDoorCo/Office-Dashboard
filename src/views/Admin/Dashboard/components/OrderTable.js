<<<<<<< HEAD
import React, { useState } from 'react';
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

=======
import React from 'react';
import DataGrid, {
  Column,
  Editing,
  Paging,
  Lookup,
  RequiredRule,
  Pager,
  HeaderFilter,
  SearchPanel,
  ColumnFixing,
  Selection,
} from 'devextreme-react/data-grid';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.css';
import CustomStore from 'devextreme/data/custom_store';
import OrderPage from '../../Orders/OrderPage';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import DoorPDF from '../../Orders/PrintOuts/Pages/Door/DoorPDF';
import DrawerPDF from '../../Orders/PrintOuts/Pages/Drawer/DrawerPDF';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadOrders, updateStatus } from '../../../../redux/orders/actions';
import { loadCustomers } from '../../../../redux/customers/actions';
import Cookies from 'js-cookie';

const cookie = Cookies.get('jwt');
>>>>>>> staging

const cookie = Cookies.get('jwt');
const { Option } = Select;


const status = [
  {
<<<<<<< HEAD
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
=======
    name: 'Quote',
    value: 'Quote',
  },
  {
    name: 'Invoiced',
    value: 'Invoiced',
  },
  {
    name: 'Ordered',
    value: 'Ordered',
  },
  {
    name: 'In Production',
    value: 'In Production',
  },
  {
    name: 'Station 1',
    value: 'Station 1',
  },
  {
    name: 'Station 2',
    value: 'Station 2',
  },
  {
    name: 'Station 3',
    value: 'Station 3',
  },
  {
    name: 'Station 4',
    value: 'Station 4',
  },
  {
    name: 'Station 4',
    value: 'Station 4',
  },
  {
    name: 'Complete',
    value: 'Complete',
  },
  {
    name: 'Shipped',
    value: 'Shipped',
  },
  {
    name: 'LATE',
>>>>>>> staging
    value: 'LATE',
  },
];

<<<<<<< HEAD
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

  const handleRowSelected = state => {
    setSelectedRows(state.selectedRows);
  };

  const toggle = (row) => {
=======
const statusFilter = ['All', 'Quote', 'Invoiced', 'Ordered', 'In Production'];


class OrderTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilterRow: true,
      showHeaderFilter: true,
      currentFilter: 'auto',
      selectedRowKeys: [],
      selectedRowsData: [],
      prefix: '',
      modal: false,
      edit: false,
      selectedOrder: null,
      filteredDate: new Date(),
      filterStatus: statusFilter[0],
      allowUpdating: false,
      startDate: new Date(),
      endDate: new Date(),
      productData: new CustomStore({
        load: () => this.props.loadOrders(cookie),
        update: (key, values) => (this.props.updateStatus(key.id, key, values, cookie))
      }),
    };
    this.onShowFilterRowChanged = this.onShowFilterRowChanged.bind(this);
    this.onShowHeaderFilterChanged = this.onShowHeaderFilterChanged.bind(this);
    this.onCurrentFilterChanged = this.onCurrentFilterChanged.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.onToolbarPreparing = this.onToolbarPreparing.bind(this);
    this.calculateCellValue = this.calculateCellValue.bind(this);
    this.onToolbarPreparing = this.onToolbarPreparing.bind(this);
    // this.onExportBreakdows = this.onExportBreakdows.bind(this)
    this.onFilterStatus = this.onFilterStatus.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onRowPrepared = this.onRowPrepared.bind(this);

  }


  onSelectionChanged(e) {
    const { selectedRowKeys, selectedRowsData } = e;

    this.selectionChangedBySelectBox = false;

    this.setState({
      selectedRowKeys,
      selectedRowsData,
    });
  }

  onRowPrepared(e) {
    if (e.rowType === 'data' && e.data.late === true) {
      e.rowElement.style.backgroundColor = '#FEEBEB';
    }
  }

    editable = () => {
      const { edit } = this.state;
      this.setState({
        edit: !edit,
      });
    }

    toggle = row => {
      const { modal } = this.state;

      this.setState({
        modal: !modal,
        edit: false,
      });

      if (!modal) {
        const x = row.row.data;


        this.setState({
          selectedOrder: x,
        });
      } else {
        return;
      }
    }

    renderButton = row => (
      <Tooltip title="View Order" placement="top">
        <IconButton
          onClick={event => {

            event.preventDefault();
            this.toggle(row);
          }}
          id={row.id}
        >
          <Inbox>Open</Inbox>
        </IconButton>
      </Tooltip>
    )

    renderDate = row => {
      return <span>{moment(row.displayValue).format('ddd MM/D/YYYY')}</span>;
    }

    onShowFilterRowChanged(e) {
      this.setState({
        showFilterRow: e.value,
      });
      this.clearFilter();
    }
    onShowHeaderFilterChanged(e) {
      this.setState({
        showHeaderFilter: e.value,
      });
      this.clearFilter();
    }
    onCurrentFilterChanged(e) {
      this.setState({
        currentFilter: e.value,
      });
    }

    calculateCellValue = data => {

      return new Date(data.createdAt).getTime();
    }

    onExportBreakdowns = e => {
      return alert('feature still in development');
      if (this.state.selectedRowKeys.length > 0) {
        this.state.selectedRowsData.map(i => {
          if (i.orderType === 'Door Order') {
            return DoorPDF(i);
          } else {
            return DrawerPDF(i);
          }
        });
        this.setState({
          selectedRowKeys: [],
          selectedRowsData: []
        });
      } else {
        NotificationManager.error('Please Select an Order', 'Order Not Selected', 2000);
      }

    }

    onFilterStatus({ value }) {
      const dataGrid = this.dataGrid.instance;


      if (value === 'All') {
        dataGrid.clearFilter();
        dataGrid.filter(
          [
            ['createdAt', '>=', moment(this.state.startDate).startOf('day').valueOf()],
            'and',
            ['createdAt', '<=', moment(this.state.endDate).endOf('day').valueOf()]
          ]
        );
      }
      else {
        dataGrid.filter(
          [
            ['createdAt', '>=', moment(this.state.startDate).startOf('day').valueOf()],
            'and',
            ['createdAt', '<=', moment(this.state.endDate).endOf('day').valueOf()],
            'and',
            ['status', '=', value],
          ]
        );
      }

      this.setState({
        filterStatus: value,
        selectedRowKeys: [],
        selectedRowsData: []
      });
    }

    onToolbarPreparing(e) {
      let onExportBreakdowns = this.onExportBreakdowns.bind(this);
      e.toolbarOptions.items.unshift(
        {
          location: 'after',
          locateInMenu: 'auto',
          sortIndex: 30,
          widget: 'dxButton',
          options: {
            text: 'Breakdowns',
            icon: 'print',
            hint: 'Print breakdowns',
            elementAttr: {
              'class': 'dx-datagrid-export-button breakdown'
            },
            onClick: function () {

              onExportBreakdowns();
            }
          }
        },

      );
    }
>>>>>>> staging

    const { setSelectedOrder } = props;

    setEdit(false);
    setModal(!modal);

<<<<<<< HEAD
    if (!modal) {
      setSelectedOrder(row);
    } else {
      setSelectedOrder(null);
=======
      return `Total: $${data.value.toFixed(2)}`;
>>>>>>> staging
    }
  };

  const editable = () => {
    setEdit(!edit);
  };

<<<<<<< HEAD
=======
      return `Orders: ${data.value}`;
    }
>>>>>>> staging

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


<<<<<<< HEAD
};
=======
    render() {
      const {
        productData,
        selectedRowKeys,
      } = this.state;



      return (
        <React.Fragment>
          <DataGrid
            id="Orders"
            dataSource={productData}
            keyExpr="id"
            allowColumnReordering={true}
            showBorders={true}
            allowColumnResizing={true}
            columnAutoWidth={true}
            onSelectionChanged={this.onSelectionChanged}
            onToolbarPreparing={this.onToolbarPreparing}
            onRowPrepared={this.onRowPrepared}
            // onExporting={this.onExporting}
            ref={ref => (this.dataGrid = ref)}
            selectedRowKeys={selectedRowKeys}
          >
            <ColumnFixing enabled={true} />
            <SearchPanel
              visible={true}
              width={240}
              placeholder="Search..."
            />
            <Paging defaultPageSize={10} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[10, 20, 50, 100]}
              showInfo={true}
            />

            <Editing mode="cell" allowUpdating={true} />
            <Selection mode="multiple" showCheckBoxesMode="always" />
            {/* <Export enabled={true} /> */}
            <Column
              dataField="orderNum"
              caption="Order #"
              sortOrder="desc"
              width={100}
              allowEditing={false}
            >
              <RequiredRule />
            </Column>
            <Column
              dataField="job_info.customer.Company"
              caption="Company Name"
              allowEditing={false}
            >
              <RequiredRule />
            </Column>
            <Column
              dataField="orderType"
              caption="OrderType"
              allowEditing={false}
            >
              <RequiredRule />
            </Column>

            <Column
              dataField="createdAt"
              caption="Date Ordered"
              dataType="datetime"
              format="M/d/yyyy"
              allowEditing={false}
              calculateFilterExpression={this.calculateFilterExpression}
              calculateCellValue={this.calculateCellValue}
              cellRender={this.renderDate}
            >
              <RequiredRule />
            </Column>
            <Column
              dataField="dueDate"
              caption="Due Date"
              dataType="datetime"
              format="M/d/yyyy"
            >
              <HeaderFilter dataSource={this.orderHeaderFilter} />
            </Column>
            <Column
              dataField="status"
              caption="Status"
              allowEditing={true}
            >
              <RequiredRule />
              <Lookup
                dataSource={status}
                valueExpr="value"
                displayExpr="name"
              />
            </Column>
            <Column
              dataField="user.FirstName"
              caption="Submitted By"
              allowEditing={false}
            >
            </Column>

            <Column
              dataField="total"
              caption="Total"
              format={this.saleAmountFormat}
              allowEditing={false}
            >
              <RequiredRule />
            </Column>

            <Column
              type="buttons"
              buttons={[
                {
                  hint: 'View Order',
                  icon: 'activefolder',
                  onClick: this.toggle,
                },
              ]}
            />

          </DataGrid>
          {
            this.state.modal ?
              <OrderPage
                toggle={this.toggle}
                modal={this.state.modal}
                selectedOrder={this.state.selectedOrder}
                editable={this.editable}
                edit={this.state.edit}
              /> : null
          }

        </React.Fragment>
      );
    }
}
>>>>>>> staging

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  orderNum: state.Orders.orderNum,
  ordersDBLoaded: state.Orders.ordersDBLoaded
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
<<<<<<< HEAD
      updateStatus,
      loadOrders,
      setSelectedOrder
    },
    dispatch
  );



=======
      loadOrders,
      loadCustomers,
      updateStatus
    },
    dispatch
  );
>>>>>>> staging

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderTable);