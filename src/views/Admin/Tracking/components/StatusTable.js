import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from 'reactstrap';
import moment from 'moment';
import DataTable from 'react-data-table-component';
import { Checkbox } from '@material-ui/core';
import differenceBy from 'lodash/differenceBy';
import io from 'socket.io-client';
import db_url from '../../../../redux/db_url'
import Cookies from "js-cookie";
const socket = io(db_url);
const cookie = Cookies.get("jwt");



const StatusTable = (props) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [data, setData] = useState(props.orders);
    const [filterText] = useState('');


    useEffect(() => {

        let filteredItems = props.orders.filter(item => item.status && item.status.includes(props.status));
        setData(filteredItems);

    }, [filterText, props.orders, props.status])

    const handleRowSelected = useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    // useEffect(() => {
    //     socket.on('order_submitted', res => props.loadOrders(cookie))
    //     socket.on('status_updated', res => props.loadOrders(cookie))
    // })

    const columns = useMemo(() => [

        {
            selector: 'orderNum',
            name: 'Order Number',
            sortable: true

        },
        {
            selector: 'job_info.customer.Company',
            name: 'Company Name',


        },
        {
            selector: 'DueDate',
            name: 'Due Date',
            cell: row => <span>{moment(row.DueDate).format('dddd, MMMM Do YYYY')}</span>,
            sortable: true

        },
    ], []);

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
                contextActions={contextActions}
                selectableRowsComponent={Checkbox}
                onRowSelected={handleRowSelected}
                clearSelectedRows={toggleCleared}
                responsive
                pagination={true}
                paginationRowsPerPageOptions={[10, 15, 20, 25, 30]}
                dense
            />
        </div>
    );
};

export default StatusTable;