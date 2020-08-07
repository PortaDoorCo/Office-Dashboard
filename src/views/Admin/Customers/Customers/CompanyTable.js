import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Row, Col, Input, Button } from 'reactstrap';

import CustomerPage from './CustomerPage';
import DataTable from 'react-data-table-component';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox'
import differenceBy from 'lodash/differenceBy';
import Geocode from "react-geocode";

const apiKey = 'AIzaSyB_JC10u6MVdITB1FhLhCJGNu_qQ8kJyFE';

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

const CompanyTable = (props) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [data, setData] = useState(props.orders);
    const [modal, setModal] = useState(false)
    const [addModal, setAddModel] = useState(false)
    const [orderEdit, setOrderEdit] = useState(false)
    const [selectedCompanies, setSelectedCompanies] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [locations, setLocations] = useState([])
    const [defaultCenter, setDefaultCenter] = useState([])




    useEffect(() => {

        // const filteredItems = props.orders.filter(item => item.orderNum && item.orderNum.toString().includes(filterText));
        // setData(filteredItems);
    }, [filterText])

    const handleRowSelected = useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);



    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />;
    }, [filterText, resetPaginationToggle]);

    const toggle = async (row) => {
        setModal(!modal);

        if (!modal) {
            await setSelectedCompanies(row)
            await setSelectedOrder(row.id)
            Geocode.setApiKey("AIzaSyB_JC10u6MVdITB1FhLhCJGNu_qQ8kJyFE");

            let address = `${(row.Address1).replace(/\s/g, "")}${row.City}${row.State}`

            // set response language. Defaults to english.
            Geocode.setLanguage("en");

            // set response region. Its optional.
            // A Geocoding request with region=es (Spain) will return the Spanish city.
            Geocode.setRegion("es");

            // Enable or disable logs. Its optional.
            Geocode.enableDebug();

            // Get address from latidude & longitude.

            // Get latidude & longitude from address.
            Geocode.fromAddress(address).then(
                response => {
                    const { lat, lng } = response.results[0].geometry.location;
                    setLocations([{ lat: lat, lng: lng, label: '', draggable: false, www: '#', title: row.Company }])
                    // this.setState({ location: [{ lat: lat, lng: lng, label: 'S', draggable: false, www: 'http://portadoor.com', title: "porta door" }] })
                    setDefaultCenter([{ lat, lng }])

                },
                error => {
                    console.error(error);
                }
            );

        } else {
            return
        }


    }

    const editable = () => {
        setOrderEdit(!orderEdit)
    }



    const columns = useMemo(clickHandler => [

        {
            selector: 'Company',
            name: 'Company',
            sortable: true

        },
        // {
        //     selector: 'sale.fullName',
        //     name: 'Sales Person',


        // },
        {
            selector: 'Contact',
            name: 'Contact',

        },
        {
            selector: 'Address1',
            name: 'Address1',

        },
        {
            selector: 'State',
            name: 'State',

        },
        {
            selector: 'City',
            name: 'City',
        },
        {
            name: '',
            button: true,
            cell: row => <Tooltip title="View Company" placement="top">
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

        return <Button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }} icon="true">Delete</Button>;
    }, [data, selectedRows, toggleCleared]);

    return (
        <div>
            <DataTable
                title="Customers"
                columns={columns}
                data={props.customerDB}
                // selectableRows
                highlightOnHover
                pagination
                contextActions={contextActions}
                // selectableRowsComponent={Checkbox}
                onRowSelected={handleRowSelected}
                clearSelectedRows={toggleCleared}
                paginationResetDefaultPage={resetPaginationToggle}
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
            />
            {modal ?
                <CustomerPage
                    toggle={toggle}
                    modal={modal}
                    selectedCompanies={selectedCompanies}
                    orders={selectedOrder}
                    locations={locations}
                    defaultCenter={defaultCenter}
                /> : null
            }

        </div>
    );
};

export default CompanyTable;