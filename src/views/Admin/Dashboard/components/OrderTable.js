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
import OrderPage from '../../Orders/ViewAllOrders/OrderPage';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import DoorPDF from '../../Orders/ViewAllOrders/PrintOuts/Pages/DoorPDF';
import DrawerPDF from '../../Orders/ViewAllOrders/PrintOuts/Pages/DrawerPDF'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadOrders, loadCustomers, updateStatus } from '../../../../redux/orders/actions';
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
];

const statusFilter = ['All', 'Quote', 'Invoiced', 'Ordered', 'In Production']


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
            selectedOrder: [],
            filteredDate: new Date(),
            filterStatus: statusFilter[0],
            allowUpdating: false,
            startDate: new Date(),
            endDate: new Date(),
            productData: new CustomStore({
                load: () => this.props.loadOrders(cookie),
                update: (key, values) => (this.props.updateStatus(key.id, values, cookie)),
            }),
        };
        this.onShowFilterRowChanged = this.onShowFilterRowChanged.bind(this);
        this.onShowHeaderFilterChanged = this.onShowHeaderFilterChanged.bind(this);
        this.onCurrentFilterChanged = this.onCurrentFilterChanged.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.onToolbarPreparing = this.onToolbarPreparing.bind(this);
        this.calculateCellValue = this.calculateCellValue.bind(this);
        this.onToolbarPreparing = this.onToolbarPreparing.bind(this)
        // this.onExportBreakdows = this.onExportBreakdows.bind(this)
        this.onFilterStatus = this.onFilterStatus.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);

    }

    componentDidMount() {
        const dataGrid = this.dataGrid.instance;
        socket.on('order_submitted', res => (dataGrid.refresh()))
        socket.on('status_updated', (res,updatedStatus) => (dataGrid.refresh()) )
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
                        files: x.files
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

                    <Editing mode="cell" allowUpdating={true} allowAdding={true} />
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
                        dataField="DueDate"
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

const mapStateToProps = (state, prop) => ({
    orders: state.Orders.orders,
    orderNum: state.Orders.orderNum,
    ordersDBLoaded: state.Orders.ordersDBLoaded
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            loadOrders,
            loadCustomers,
            updateStatus
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderTable);