import React from 'react';
import { Row, Col } from 'reactstrap';
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
  Summary,
  TotalItem
} from 'devextreme-react/data-grid';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
import { SelectBox, DateBox } from 'devextreme-react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.css';
import CustomStore from 'devextreme/data/custom_store';
import OrderPage from './OrderPage';
import Report1 from './PrintOuts/Reports/Report1';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import DoorPDF from './PrintOuts/Pages/Door/DoorPDF';
import DrawerPDF from './PrintOuts/Pages/Drawer/DrawerPDF'
import { NotificationManager } from 'react-notifications';
import io from 'socket.io-client';
import Cookies from "js-cookie";
const socket = io('https://server.portadoor.com/');

const cookie = Cookies.get("jwt");

momentLocaliser(moment);

const status = [
  {
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
      value: 'LATE',
  },
];

const statusFilter = ['All', 'Quote', 'Invoiced', 'Ordered', 'In Production']


class RestrictedOrderTable extends React.Component {
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
      selectedOrder: [],
      filteredDate: new Date(),
      filterStatus: statusFilter[0],
      allowUpdating: false,
      startDate: new Date(),
      endDate: new Date(),
      productData: new CustomStore({
        load: () => this.props.loadOrders(cookie),
        update: (key, values) =>
          this.props.updateStatus(key.id, key, values, cookie),
      }),
    };
    this.onShowFilterRowChanged = this.onShowFilterRowChanged.bind(this);
    this.onShowHeaderFilterChanged = this.onShowHeaderFilterChanged.bind(this);
    this.onCurrentFilterChanged = this.onCurrentFilterChanged.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.onStartDate = this.onStartDate.bind(this);
    this.onEndDate = this.onEndDate.bind(this);
    this.onToolbarPreparing = this.onToolbarPreparing.bind(this);
    this.calculateCellValue = this.calculateCellValue.bind(this);
    this.onToolbarPreparing = this.onToolbarPreparing.bind(this)
    // this.onExportBreakdows = this.onExportBreakdows.bind(this)
    this.onFilterStatus = this.onFilterStatus.bind(this);
    this.onRowPrepared = this.onRowPrepared.bind(this);
  }

  componentDidMount() {
    const dataGrid = this.dataGrid.instance;
    socket.on('order_submitted', res => (dataGrid.refresh()))
    socket.on('order_deleted', res => (dataGrid.refresh()))
    socket.on('order_updated', res => (dataGrid.refresh()))
    socket.on('status_updated', res => dataGrid.refresh())
    let filter = [
      ['createdAt', '>=', moment().startOf('day').valueOf()],
      'and',
      ['createdAt', '<=', moment().endOf('day').valueOf()]
    ];
    dataGrid.filter(filter);

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
    if (e.rowType == 'data' && e.data.late == true) {
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
        selectedOrder: [x],
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

  onStartDate(e) {
    const dataGrid = this.dataGrid.instance;
    let filter;
    if (this.state.filterStatus === 'All') {
      filter = [
        ['createdAt', '>=', moment(e.value).startOf('day').valueOf()],
        'and',
        ['createdAt', '<=', moment(this.state.endDate).endOf('day').valueOf()]
      ];
    } else {
      filter = [
        ['createdAt', '>=', moment(e.value).startOf('day').valueOf()],
        'and',
        ['createdAt', '<=', moment(this.state.endDate).endOf('day').valueOf()],
        'and',
        ['status', '=', this.state.filterStatus],
      ];
    }


    dataGrid.filter(filter);
    this.setState({
      startDate: new Date(e.value),
      selectedRowKeys: [],
      selectedRowsData: []
    });
  }
  onEndDate(e) {
    const dataGrid = this.dataGrid.instance;
    let filter;
    if (this.state.filterStatus === 'All') {
      filter = [
        ['createdAt', '<=', moment(e.value).endOf('day').valueOf()],
        'and',
        ['createdAt', '>=', moment(this.state.startDate).startOf('day').valueOf()]
      ];
    } else {
      filter = [
        ['createdAt', '<=', moment(e.value).endOf('day').valueOf()],
        'and',
        ['createdAt', '>=', moment(this.state.startDate).startOf('day').valueOf()],
        'and',
        ['status', '=', this.state.filterStatus],
      ];
    }

    dataGrid.filter(filter);
    this.setState({
      endDate: new Date(e.value),
      selectedRowKeys: [],
      selectedRowsData: []
    });
  }

  calculateCellValue = data => {
    return new Date(data.createdAt).getTime();
  }

  onExportBreakdowns = e => {

    if (this.state.selectedRowKeys.length > 0) {
      this.state.selectedRowsData.map(i => {
        if (i.orderType === "Door Order") {
          return DoorPDF(i);
        } else {
          return DrawerPDF(i)
        }
      })
      this.setState({
        selectedRowKeys: [],
        selectedRowsData: []
      })
    } else {
      NotificationManager.error('Please Select an Order', 'Order Not Selected', 2000);
    }

  }

  onExportReports = e => {
    const data = this.state.selectedRowsData
    const startDate = this.state.startDate
    const endDate = this.state.endDate
    const status = this.state.filterStatus
    const filteredOrders = this.props.orders.filter(order => {
      if (status === 'All') {
        return (
          (new Date(order.createdAt).getTime() >= moment(startDate).startOf('day').valueOf())
          &&
          (new Date(order.createdAt).getTime() <= moment(endDate).endOf('day').valueOf())
        )
      } else {
        return (
          (new Date(order.createdAt).getTime() >= moment(startDate).startOf('day').valueOf())
          &&
          (new Date(order.createdAt).getTime() <= moment(endDate).endOf('day').valueOf())
          &&
          (order.status.includes(status))
        )
      }

    })
    if (data.length > 0) {
      Report1(data, startDate, endDate, status)
    } else {
      Report1(filteredOrders, startDate, endDate, status)
    }

    this.setState({
      selectedRowKeys: [],
      selectedRowsData: []
    })
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
    let onExportBreakdowns = this.onExportBreakdowns.bind(this)
    let onExportReports = this.onExportReports.bind(this)
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

            onExportBreakdowns()
          }
        }
      }
    );
  }

  saleAmountFormat = { style: 'currency', currency: 'USD', useGrouping: true, minimumSignificantDigits: 3 };

  customTotal(data) {

    return `Total: $${data.value.toFixed(2)}`;
  }

  customCount(data) {

    return `Orders: ${data.value}`;
  }


  render() {
    const {
      productData,
      selectedRowKeys,
    } = this.state;
    const { startDate, endDate } = this.state;
    const { orders } = this.props;
    const minDate = new Date(orders[orders.length - 1].createdAt);

    return (
      <React.Fragment>
        <Row>
          <Col lg="8" />

          <Col>
            <Row>
              <Col>
                <p>From</p>
                <DateBox value={this.state.startDate} max={endDate}
                  min={minDate} onValueChanged={this.onStartDate} type="date" />
              </Col>
              <Col>
                <p>To</p>
                <DateBox value={this.state.endDate} max={new Date()}
                  min={startDate} onValueChanged={this.onEndDate} type="date" />
              </Col>
              <Col>
                <p>Status</p>
                <SelectBox items={statusFilter} value={this.state.filterStatus}
                  onValueChanged={this.onFilterStatus} />
              </Col>
            </Row>
          </Col>
        </Row>
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
          // onExporting={this.onExporting}
          ref={ref => (this.dataGrid = ref)}
          selectedRowKeys={selectedRowKeys}
          onRowPrepared={this.onRowPrepared}
        >
          <ColumnFixing enabled={true} />
          <SearchPanel
            visible={true}
            width={240}
            placeholder="Search..."
          />
          <Paging defaultPageSize={20} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[20, 50, 100]}
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
            <HeaderFilter dataSource={this.orderHeaderFilter} />{' '}
            allowEditing={false}><RequiredRule />
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
            type="buttons"
            buttons={[
              {
                hint: 'View Order',
                icon: 'activefolder',
                onClick: this.toggle,
              },
            ]}
          />
          <Summary>
            <TotalItem
              column="total"
              summaryType="count"
              customizeText={this.customCount}
            />
          </Summary>
        </DataGrid>
        <OrderPage
          toggle={this.toggle}
          modal={this.state.modal}
          selectedOrder={this.state.selectedOrder}
          editable={this.editable}
          edit={this.state.edit}
        />
      </React.Fragment>
    );
  }
}

export default RestrictedOrderTable;
