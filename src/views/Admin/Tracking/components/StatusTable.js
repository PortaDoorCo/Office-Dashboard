import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Input,
    Button,
    Row,
    Col
} from 'reactstrap';
import moment from 'moment';
import DataTable from 'react-data-table-component';
import { Checkbox, Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox'
import differenceBy from 'lodash/differenceBy';
import io from 'socket.io-client';
const socket = io('https://server.portadoor.com/');


const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
        <div>
            <Row>
                <Col>
                    <Input id="search" type="text" placeholder="Filter Orders" value={filterText} onChange={onFilter} />
                </Col>
            </Row>

        </div>
    </>
);

const PaginationComponent = () => {
    return (
        <div></div>
    )
}

const StatusTable = (props) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [data, setData] = useState(props.orders);
    const [modal, setModal] = useState(false)
    const [orderEdit, setOrderEdit] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState([])
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);




    useEffect(() => {
        
        let filteredItems = props.orders.filter(item => item.status && item.status.includes(props.status));
        setData(filteredItems);

    }, [filterText, props.orders])

    const handleRowSelected = useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    useEffect(() => {
      
    }, [props.orders])

    useEffect(() => {
        socket.on('order_submitted', res => props.loadOrders())
        socket.on('status_updated', res => props.loadOrders())
    }, [])



    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />;
    }, [filterText, resetPaginationToggle]);

    const toggle = (row) => {
        setModal(!modal);

        if (!modal) {
            setSelectedOrder(
                [
                    {
                        id: row.id,
                        customer: row.jobInfo.customer,
                        jobName: row.jobInfo.jobName,
                        status: row.status,
                        poNum: row.jobInfo.poNum,
                        part_list: row.part_list,
                        dimensions: row.dimensions,
                        shippingAddress: row.jobInfo,
                        linePrice: row.linePrice,
                        total: row.total,
                        orderNum: row.orderNum,
                        orderType: row.orderType,
                        itemPrice: row.itemPrice,
                        subTotals: row.subTotals
                    }
                ]
            )
        } else {
            return
        }


    }

    const columns = useMemo(clickHandler => [

        {
            selector: 'orderNum',
            name: 'Order Number',
            sortable: true

        },
        {
            selector: 'jobInfo.customer.Company',
            name: 'Company Name',


        },
        {
            selector: 'DueDate',
            name: 'Due Date',
            cell: row => <span>{moment(row.DueDate).format('dddd, MMMM Do YYYY')}</span>,
            sortable: true

        },
    ]);

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
        <div>
            <DataTable
                title={props.status}
                columns={columns}
                data={data}
                highlightOnHover
                // pagination
                contextActions={contextActions}
                selectableRowsComponent={Checkbox}
                onRowSelected={handleRowSelected}
                clearSelectedRows={toggleCleared}
                responsive
                dense
            />
            {/* <OrderPage
                toggle={toggle}
                modal={modal}
                selectedOrder={selectedOrder}
            /> */}
        </div>
    );
};

export default StatusTable;