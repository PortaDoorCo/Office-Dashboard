import React, { useState, useCallback, useMemo, } from 'react';
import differenceBy from 'lodash/differenceBy';
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component';
import { Button } from 'reactstrap'
import moment from 'moment';
import OrderPage from '../../Orders/OrderPage'
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox'

const actions = <Button key="add">Add</Button>;

const conditionalRowStyles = [
    {
        when: row => row.late == true,
        style: {
            backgroundColor: '#FEEBEB',
            '&:hover': {
                cursor: 'pointer',
            },
        },
    },
];


const OrderTable = (props) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [data, setData] = useState(props.orders);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modal, setModal] = useState(false);
    const [edit, setEdit] = useState(false);


    const columns = [
        {
            name: 'Order #',
            selector: 'orderNum',
            sortable: true,
            grow: 2,
        },
        {
            name: 'Company',
            selector: 'job_info.customer.Company',
            sortable: true,
            grow: 2,
        },
        {
            name: 'Order Type',
            selector: 'orderType',
            sortable: true,
            grow: 2,
        },
        {
            name: 'Date Ordered',
            cell: row => <div>{moment(row.createdAt).format("MMM Do YYYY")}</div>,
        },
        {
            name: 'Due Date',
            cell: row => <div>{moment(row.dueDate).format("MMM Do YYYY")}</div>,
        },
        {
            name: 'Status',
            selector: 'status',
            sortable: true,
            grow: 2,
        },
        {
            name: 'Submitted By',
            selector: 'user.FirstName',
            sortable: true,
            grow: 2,
        },
        {
            name: 'Total',
            selector: 'total',
            sortable: true,
            grow: 2,
        },
        {
            name: ' ',
            button: true,
            cell: (row) => <Tooltip title="View Order" placement="top">
                <IconButton onClick={function (event) {
                    event.preventDefault()
                    toggle(row)
                }} id={row.id}>
                    <Inbox>Open</Inbox>
                </IconButton>
            </Tooltip>,
        },


    ];

    const handleRowSelected = useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    const toggle = (row) => {
        setEdit(false)
        setModal(!modal)
        console.log(row)

        if (!modal) {
            setSelectedOrder([row])
        } else {
            setSelectedOrder(null)
        }
    }

    const editable = () => {
        setEdit(!edit)
    }

    const contextActions = useMemo(() => {
        const handleDelete = () => {

            if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.name)}?`)) {
                setToggleCleared(!toggleCleared);
                setData(differenceBy(data, selectedRows, 'name'));
            }
        };

        return <Button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }} icon>Delete</Button>;
    }, [data, selectedRows, toggleCleared]);


    return (
        <div>
            <DataTable
                title="Orders"
                columns={columns}
                data={props.orders}
                // selectableRows
                // actions={actions}
                contextActions={contextActions}
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
                        selectedOrder={selectedOrder}
                        editable={editable}
                        edit={edit}
                    /> : null
            }
        </div>

    );


};

const mapStateToProps = (state, prop) => ({
    orders: state.Orders.orders,
    orderNum: state.Orders.orderNum,
    ordersDBLoaded: state.Orders.ordersDBLoaded
});



export default connect(
    mapStateToProps,
    null
)(OrderTable);