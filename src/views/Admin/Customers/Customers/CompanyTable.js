import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CustomerPage from './CustomerPage';
import AddCustomer from './AddCustomer';
import DataTable from 'react-data-table-component';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
import differenceBy from 'lodash/differenceBy';
import Geocode from 'react-geocode';
import { setSelectedCompanies } from '../../../../redux/customers/actions';
import styled from 'styled-components';

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextField id="search" type="text" placeholder="Search Company" value={filterText} onChange={onFilter} />
    <ClearButton type="button" onClick={onClear}>X</ClearButton>
  </>
);

const CompanyTable = (props) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(props.orders);
  const [modal, setModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [locations, setLocations] = useState([]);
  const [defaultCenter, setDefaultCenter] = useState([]);
  const [newCustomerModal, setNewCustomerModal] = useState(false);
  
  const filteredCompanies = props.customerDB.filter(item => item.Company && item.Company.toLowerCase().includes(filterText.toLowerCase()));




  useEffect(() => {

    // const filteredItems = props.orders.filter(item => item.orderNum && item.orderNum.toString().includes(filterText));
    // setData(filteredItems);
  }, [filterText]);

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

    const { setSelectedCompanies } = props;

    setModal(!modal);

    if (!modal) {
      await setSelectedCompanies(row);
      await setSelectedOrder(row.id);
      Geocode.setApiKey('AIzaSyB_JC10u6MVdITB1FhLhCJGNu_qQ8kJyFE');

      let address = `${(row.Address1).replace(/\s/g, '')}${row.City}${row.State}`;

      // set response language. Defaults to english.
      Geocode.setLanguage('en');

      // set response region. Its optional.
      // A Geocoding request with region=es (Spain) will return the Spanish city.
      Geocode.setRegion('es');

      // Enable or disable logs. Its optional.
      Geocode.enableDebug();

      // Get address from latidude & longitude.

      // Get latidude & longitude from address.
      Geocode.fromAddress(address).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          setLocations([{ lat: lat, lng: lng, label: '', draggable: false, www: '#', title: row.Company }]);
          // this.setState({ location: [{ lat: lat, lng: lng, label: 'S', draggable: false, www: 'http://portadoor.com', title: "porta door" }] })
          setDefaultCenter([{ lat, lng }]);

        },
        error => {
          console.error(error);
        }
      );

    } else {
      return;
    }


  };

  const addCustomer = () => {
    setNewCustomerModal(!newCustomerModal);
  };



  const columns = [

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
          event.preventDefault();
          toggle(row);
        }} id={row.id}>
          <Inbox>Open</Inbox>
        </IconButton>
      </Tooltip>
    },
  ];

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
    <div className="mt-5">
      <Row>
        <Col lg='11' />
        <Col>
          <Button color="primary" onClick={addCustomer}>Add Customer</Button>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <DataTable
            title="Customers"
            columns={columns}
            data={filteredCompanies}
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
              orders={selectedOrder}
              locations={locations}
              defaultCenter={defaultCenter}
            /> : null
          }


        </Col>
      </Row>

      {newCustomerModal ? 
        <AddCustomer
          toggle={addCustomer}
          modal={newCustomerModal}
        /> : null
      }
    </div>
  );
};

const mapStateToProps = (state, prop) => ({
  selectedCompanies: state.customers.selectedCompanies,
  customerDB: state.customers.customerDB
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setSelectedCompanies
    },
    dispatch
  );




export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyTable);