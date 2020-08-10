


import React from 'react';
import DataGrid, {
  Column,
  Paging,
  Lookup,
  RequiredRule,
  Pager,
  HeaderFilter,
  ColumnFixing,
  Summary,
  TotalItem
} from 'devextreme-react/data-grid';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.css';
import OrderPage from '../../Orders/OrderPage';
import SalesmenReport from '../../Orders/PrintOuts/Reports/SalesmenReport';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';



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
];

const statusFilter = ['All', 'Quote', 'Invoiced', 'Ordered', 'In Production'];


class StatusTable extends React.Component {
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
      filteredItems: []
    };
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.calculateCellValue = this.calculateCellValue.bind(this);
  }


  onSelectionChanged(e) {
    const { selectedRowKeys, selectedRowsData } = e;
       
    this.selectionChangedBySelectBox = false;

    this.setState({
      selectedRowKeys,
      selectedRowsData,
    });
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
          selectedOrder: [
            {
              id: x.id,
              jobInfo: x.jobInfo,
              jobName: x.jobInfo.jobName,
              status: x.status,
              poNum: x.jobInfo.poNum,
              part_list: x.part_list,
              dimensions: x.dimensions,
              shippingAddress: x.jobInfo,
              linePrice: x.linePrice,
              total: x.total,
              orderNum: x.orderNum,
              orderType: x.orderType,
              itemPrice: x.itemPrice,
              subTotals: x.subTotals,
              tax: x.tax,
              files: x.files,
              tracking: x.tracking
            },
          ],
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

    calculateCellValue = data => {

      return new Date(data.createdAt).getTime();
    }

    onExportReports = e => {
      const data = this.state.filteredItems;
      const startDate = this.props.startDate;
      const endDate = this.props.endDate;
      const status = this.props.status;

      if (data.length > 0) {
        SalesmenReport(data, startDate, endDate, status);
      }


    }

    saleAmountFormat = { style: 'currency', currency: 'USD', useGrouping: true, minimumSignificantDigits: 3 };

    customTotal(data) {
      return `Total: $${data.value.toFixed(2)}`;
    }

    customCount(data) {
      return `Orders: ${data.value}`;
    }


    render() {
      const { selectedRowKeys } = this.state;
      return (
        <React.Fragment>
          <DataGrid
            id="Orders"
            dataSource={this.props.orders}
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
          >
            <ColumnFixing enabled={true} />
            <Paging defaultPageSize={20} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[20, 50, 100]}
              showInfo={true}
            />
            {/* <Selection mode="multiple" showCheckBoxesMode="always" /> */}
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
              dataField="jobInfo.customer.Company"
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

export default StatusTable;




