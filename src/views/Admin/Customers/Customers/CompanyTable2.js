import React from 'react';
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
  SearchPanel,
  ColumnFixing,
} from 'devextreme-react/data-grid';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.css';
import CustomStore from 'devextreme/data/custom_store';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadCustomers, updateCustomer, submitCustomer } from '../../../../redux/customers/actions';

import Geocode from 'react-geocode';
import CustomerPage from './CustomerPage';
import { Item } from 'devextreme-react/form';
import states from '../AddCustomer/states';
import Cookies from 'js-cookie';

const cookie = Cookies.get('jwt');


momentLocaliser(moment);

const statusFilter = ['All', 'Quote', 'Invoiced', 'Ordered', 'In Production'];

const taxable = [
  {
    'name': 'Yes',
    'value': true
  },
  {
    'name': 'No',
    'value': false
  },
];


class CustomerTable extends React.Component {
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
      filteredDate: new Date(),
      filterStatus: statusFilter[0],
      allowUpdating: false,
      startDate: new Date(),
      endDate: new Date(),
      selectedCompanies: [],
      salesRep: [],
      selectedOrder: null,
      locations: [],
      defaultCenter: [],
      productData: new CustomStore({
        load: () => this.props.loadCustomers(cookie),
        update: (key, values) => this.props.updateCustomer(key.id, values, cookie),
        insert: (values) => this.props.submitCustomer(values, cookie),
      }),
    };
    this.onShowFilterRowChanged = this.onShowFilterRowChanged.bind(this);
    this.onShowHeaderFilterChanged = this.onShowHeaderFilterChanged.bind(this);
    this.onCurrentFilterChanged = this.onCurrentFilterChanged.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
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

    toggle = async row => {
      const { modal } = this.state;


      this.setState({
        modal: !modal,
      });

      if (!modal) {
        const x = row.row.data;

        await this.setState({
          selectedCompanies: x,
          selectedOrder: x.id,
          salesRep: x.sale
        });
        Geocode.setApiKey('AIzaSyB_JC10u6MVdITB1FhLhCJGNu_qQ8kJyFE');

        let address = `${(x.Address1).replace(/\s/g, '')}${x.City}${x.State}`;

        Geocode.setLanguage('en');
        Geocode.setRegion('es');
        Geocode.enableDebug();
        Geocode.fromAddress(address).then(
          response => {
            const { lat, lng } = response.results[0].geometry.location;
            this.setState({
              locations: [{ lat: lat, lng: lng, label: '', draggable: false, www: '#', title: row.Company }],
              defaultCenter: [{ lat, lng }]
            });
          },
          error => {
            console.error(error);
          }
        );
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


    saleAmountFormat = { style: 'currency', currency: 'USD', useGrouping: true, minimumSignificantDigits: 3 };

    customTotal(data) {

      return `Total: $${data.value.toFixed(2)}`;
    }

    customCount(data) {

      return `Orders: ${data.value}`;
    }

    onInitNewRow = (e) => {
      const { customerDB } = this.props;
      const item = customerDB.length + 1;
      e.data.CUSTNO = item;
    }


    render() {
      const {
        productData,
        selectedRowKeys,
      } = this.state;
      const { salesReps, shippingMethods, paymentTerms, paymentTypes } = this.props;



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
            onInitNewRow={this.onInitNewRow}
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

            <Editing
              mode="popup"
              allowUpdating={true}
              allowAdding={true}
              allowDeleting={true}
              refreshMode="full"
            >
              <Popup title="Add Customer" showTitle={true} width={700} height={525}>
                <Position my="top" at="top" of={window} />
              </Popup>
              <Form>
                <Item itemType="group" caption="Customer Info" colCount={3} colSpan={2}>
                  <Item dataField="Company" />
                  <Item dataField="Contact" />
                  <Item dataField="EMAIL" />
                </Item>

                <Item itemType="group" caption="Address" colCount={2} colSpan={2}>

                  <Item dataField="Address1" />
                  <Item dataField="Address2" />

                </Item>

                <Item itemType="group" colCount={3} colSpan={2}>
                  <Item dataField="City" />
                  <Item dataField="State" />
                  <Item dataField="Zip" />
                </Item>

                <Item itemType="group" caption="Phone/Fax" colCount={3} colSpan={2}>
                  <Item dataField="Phone1" />
                  <Item dataField="Phone2" />
                  <Item dataField="Fax" />
                </Item>


                <Item itemType="group" caption="Shipping Address" colCount={2} colSpan={2}>
                  <Item dataField="Shipping_Address1" />
                  <Item dataField="Shipping_Address2" />

                </Item>

                <Item itemType="group" colCount={3} colSpan={2}>
                  <Item dataField="Shipping_City" />
                  <Item dataField="Shipping_State" />
                  <Item dataField="Shipping_Zip" />
                </Item>


                <Item itemType="group" caption="Misc" colCount={2} colSpan={2}>
                  <Item dataField="Ship_Via" />
                  <Item dataField="PaymentType" />
                  <Item dataField="PMT_TERMS" />
                  <Item dataField="sale" />
                  <Item dataField="TaxRate" />
                  <Item dataField="Taxable" />
                  <Item dataField="Discount" />
                </Item>
                <Item itemType="group" caption="Notes" colCount={1} colSpan={1}>
                  <Item dataField="Notes" />
                </Item>


              </Form>
            </Editing>
            <Column dataField="CUSTNO" caption="ID" width={65} fixed={true} sortOrder='asc' ><RequiredRule /></Column>
            <Column
              dataField="Company"
              caption="Customer"

            >
              <RequiredRule />
            </Column>
            <Column
              dataField="sale.fullName"
              caption="Sales Rep"
            >
              <RequiredRule />
            </Column>
            <Column
              dataField="Contact"
              caption="Contact Name"
            >
              <RequiredRule />
            </Column>
            <Column
              dataField="Address1"
              caption="Address "
            >
              <RequiredRule />
            </Column>
            <Column
              dataField="State"
              caption="State"
            >
              <RequiredRule />
              <Lookup dataSource={states} valueExpr="abbreviation" displayExpr="abbreviation" />
            </Column>
            <Column
              dataField="City"
              caption="City"
            >
              <RequiredRule />
            </Column>

            <Column
              type="buttons"
              buttons={[
                {
                  hint: 'View Customer',
                  icon: 'activefolder',
                  onClick: this.toggle,
                },
              ]}
            />

            <Column dataField="sale" caption="Sales Rep" visible={false}>
              <RequiredRule />
              <Lookup dataSource={salesReps} valueExpr="id" displayExpr="fullName" />
            </Column>
            <Column dataField="EMAIL" caption="Email" visible={false} />
            <Column dataField="Address2" caption="Address 2" visible={false} />
            <Column dataField="Zip" caption="Zip" visible={false}>
              <RequiredRule />
            </Column>
            <Column dataField="Phone1" caption="Phone" visible={false}>
              <RequiredRule />
            </Column>
            <Column dataField="Phone2" caption="Phone 2" visible={false} />
            <Column dataField="Fax" caption="Fax" visible={false} />
            <Column dataField="Shipping_State" caption="Shipping State" visible={false}>
              <Lookup dataSource={states} valueExpr="abbreviation" displayExpr="abbreviation" />
            </Column>
            <Column dataField="Shipping_Address1" caption="Shipping Address" visible={false} />
            <Column dataField="Shipping_Address2" caption="Shipping Address 2" visible={false} />
            <Column dataField="Shipping_City" caption="Shipping City" visible={false} />
            <Column dataField="Shipping_Zip" caption="Shipping Zip" visible={false} />
            <Column dataField="Ship_Via" caption="Shipping Method" visible={false}>
              <RequiredRule />
              <Lookup dataSource={shippingMethods} valueExpr="NAME" displayExpr="NAME" />
            </Column>
            <Column dataField="PaymentType" caption="Payment Type" visible={false}>
              <RequiredRule />
              <Lookup dataSource={paymentTypes} valueExpr="NAME" displayExpr="NAME" />
            </Column>
            <Column dataField="PMT_TERMS" caption="Payment Terms" visible={false}>
              <RequiredRule />
              <Lookup dataSource={paymentTerms} valueExpr="NAME" displayExpr="NAME" />
            </Column>
            <Column dataField="TaxRate" caption="Tax Rate (%)" visible={false}>
              <RequiredRule />
            </Column>
            <Column dataField="Taxable" caption="Taxable?" visible={false}>
              <RequiredRule />
              <Lookup dataSource={taxable} valueExpr="value" displayExpr="name" />
            </Column>
            <Column dataField="Discount" caption="Discount (%)" visible={false}>
              <RequiredRule />
            </Column>
            <Column dataField="Notes" caption="Notes" visible={false}>
              <RequiredRule />
            </Column>
          </DataGrid>

          {this.state.modal ?
            <CustomerPage
              toggle={this.toggle}
              modal={this.state.modal}
              selectedCompanies={this.state.selectedCompanies}
              orders={this.state.selectedOrder}
              locations={this.state.locations}
              defaultCenter={this.state.defaultCenter}
              salesRep={this.state.salesRep}
            /> : null
          }

        </React.Fragment>
      );
    }
}

const mapStateToProps = (state, prop) => ({
  customerDB: state.customers.customerDB,
  salesReps: state.sales.salesReps,
  shippingMethods: state.misc_items.shippingMethods,
  paymentTerms: state.misc_items.paymentTerms,
  paymentTypes: state.misc_items.paymentTypes
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadCustomers,
      updateCustomer,
      submitCustomer
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerTable);

