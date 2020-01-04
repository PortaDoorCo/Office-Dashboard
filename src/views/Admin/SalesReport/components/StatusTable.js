


import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import DataGrid, {
    Column,
    Editing,
    Popup,
    Paging,
    Lookup,
    RequiredRule,
    Position,
    Form,
    Pager,
    FilterRow,
    HeaderFilter,
    SearchPanel,
    ColumnFixing,
    Selection,
    Export,
    Summary,
    TotalItem
} from 'devextreme-react/data-grid';
import { Checkbox, Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
import { SelectBox, DateBox } from 'devextreme-react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.css';
import CustomStore from 'devextreme/data/custom_store';
import OrderPage from '../../Orders/ViewAllOrders/OrderPage';
import SalesmenReport from '../../Orders/ViewAllOrders/PrintOuts/Reports/SalesmenReport';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import DoorPDF from '../../Orders/ViewAllOrders/PrintOuts/DoorPDF';
import DrawerPDF from '../../Orders/ViewAllOrders/PrintOuts/DrawerPDF'



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
            selectedOrder: [],
            filteredDate: new Date(),
            filterStatus: statusFilter[0],
            allowUpdating: false,
            startDate: new Date(),
            endDate: new Date(),
            filteredItems: []
        };
        this.onShowFilterRowChanged = this.onShowFilterRowChanged.bind(this);
        this.onShowHeaderFilterChanged = this.onShowHeaderFilterChanged.bind(this);
        this.onCurrentFilterChanged = this.onCurrentFilterChanged.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.onToolbarPreparing = this.onToolbarPreparing.bind(this);
        this.calculateCellValue = this.calculateCellValue.bind(this);
        this.onToolbarPreparing = this.onToolbarPreparing.bind(this)
        // this.onFilterValueChanged = this.onFilterValueChanged.bind(this)

    }



    componentDidUpdate(prevProps, prevState) {
        if (prevProps.orders !== this.props.orders) {
            const filteredItems = this.props.orders.filter(item => (item.jobInfo.customer.sale.fullName && item.jobInfo.customer.sale.fullName.includes(this.props.status)));
            console.log(filteredItems)
            this.setState({
                filteredItems: filteredItems
            })
        }
        if (prevState.filterStatus !== this.state.filterStatus) {
            const saleFilter = this.props.orders.filter(item => (item.jobInfo.customer.sale.fullName && item.jobInfo.customer.sale.fullName.includes(this.props.status)));
            const filterStatus = saleFilter.filter(sale => {
                if (this.state.filterStatus === "All") {
                    return sale
                } else {
                    return sale.status === this.state.filterStatus
                }
            }
            )

            if (this.state.filterStatus === "All") {
                this.setState({
                    filteredItems: saleFilter
                })
            } else {
                this.setState({
                    filteredItems: filterStatus
                })
            }
        }
    }

    onSelectionChanged(e) {
        const { selectedRowKeys, selectedRowsData } = e;
        console.log(e);
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
        const { modal, edit } = this.state;

        this.setState({
            modal: !modal,
            edit: false,
        });

        if (!modal) {
            const x = row.row.data;
            console.log(x);
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
                    console.log('clicked');
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

    onFilterValueChanged = e => {
        console.log(e)
        this.setState({
            filterStatus: e.value
        })
    }

    calculateCellValue = data => {
        console.log(new Date(data.createdAt).getTime());
        return new Date(data.createdAt).getTime();
    }

    onExportReports = e => {
        const data = this.state.filteredItems
        const startDate = this.props.startDate
        const endDate = this.props.endDate
        const status = this.props.status

        if (data.length > 0) {
            SalesmenReport(data, startDate, endDate, status)
        }


    }

    onToolbarPreparing(e) {
        let onExportReports = this.onExportReports.bind(this)
        e.toolbarOptions.items.unshift(
            {
                location: 'after',
                widget: 'dxSelectBox',
                options: {
                    width: 200,
                    items: statusFilter,
                    value: this.state.filterStatus,
                    onValueChanged: this.onFilterValueChanged.bind(this)
                },
            },
            {
                location: 'after',
                locateInMenu: 'auto',
                sortIndex: 30,
                widget: 'dxButton',
                options: {
                    text: 'Reports',
                    icon: 'export',
                    hint: 'Export selected data',
                    elementAttr: {
                        'class': 'dx-datagrid-export-button'
                    },
                    onClick: function () {
                        onExportReports()
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

        return (
            <React.Fragment>
                <DataGrid
                    id="Orders"
                    dataSource={this.state.filteredItems}
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
                        <TotalItem
                            column="total"
                            summaryType="sum"
                            valueFormat={this.saleAmountFormat}
                            customizeText={this.customTotal}
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




