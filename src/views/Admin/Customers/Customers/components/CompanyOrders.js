import React, { useState, useMemo, useEffect } from 'react';
import {
    Input,
    Button,
    Row,
    Col
} from 'reactstrap';
import OrderPage from '../../../Orders/OrderPage';
import moment from 'moment';

import DataTable from 'react-data-table-component';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox'
import differenceBy from 'lodash/differenceBy';


const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
        <div>
            <Row>
                <Col>
                    <Input id="search" type="text" placeholder="Order Number" value={filterText} onChange={onFilter} />
                </Col>
            </Row>
        </div>
    </>
);

const CustomerOrders = (props) => {
    const [selectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [data, setData] = useState(props.orders);
    const [modal, setModal] = useState(false)
    const [orderEdit, setOrderEdit] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState([])
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);




    useEffect(() => {
   
        const filteredItems = props.orders.filter(item => item.orderNum && item.orderNum.toString().includes(filterText));
        setData(filteredItems);
    }, [filterText, props.orders])

    const subHeaderComponentMemo = useMemo(clickHandler => {
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
                [row]
            )
        } else {
            return
        }
    }

    const editable = () => {
        setOrderEdit(!orderEdit)
    }



    const columns = useMemo(clickHandler => [

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
            selector: 'orderType',
            name: 'Order Type',

        },
        {
            selector: 'total',
            name: 'Order Total',

        },
        {
            selector: 'status',
            name: 'Status',

        },
        {
            selector: 'createdAt',
            name: 'Date Ordered',
            cell: row => <span>{moment(row.createdAt).format('MM/DD/YYYY')}</span>

        },
        {
            name: '',
            button: true,
            cell: row => <Tooltip title="View Order" placement="top">
                <IconButton onClick={function (event) {
                    event.preventDefault()
                    toggle(row)
                }} id={row.id}>
                    <Inbox>Open</Inbox>
                </IconButton>
            </Tooltip>
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
                columns={columns}
                data={data}
                // selectableRows
                highlightOnHover
                pagination
                contextActions={contextActions}
                // selectableRowsComponent={Checkbox}
                // onRowSelected={handleRowSelected}
                // clearSelectedRows={toggleCleared}
                paginationResetDefaultPage={resetPaginationToggle}
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
            />
            <OrderPage
                toggle={toggle}
                modal={modal}
                selectedOrder={selectedOrder}
                editable={editable}
                edit={orderEdit}
            />
        </div>
    );
};

export default CustomerOrders;


