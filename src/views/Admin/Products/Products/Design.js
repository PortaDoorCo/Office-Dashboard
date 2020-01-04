import React from 'react';
import Button from 'devextreme-react/button';
import DataGrid, {
  Column, Editing, Popup, Paging, Lookup, RequiredRule, Position,
  Form, Pager, FilterRow, HeaderFilter, SearchPanel, ColumnFixing
} from 'devextreme-react/data-grid';
import { SelectBox, CheckBox, FileUploader } from 'devextreme-react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import { Item } from 'devextreme-react/form';
import DeleteModal from '../DeleteModal';
import CustomStore from 'devextreme/data/custom_store';

const numPanels = [
  {
    'ID': 1,
    'Name': '1'
  },
  {
    'ID': 2,
    'Name': '2'
  },
  {
    'ID': 3,
    'Name': '3'
  },
  {
    'ID': 4,
    'Name': '4'
  },
  {
    'ID': 5,
    'Name': '5'
  },
];

const construction = [
  {
    name: 'Cope And Stick',
    value: 'Cope'
  },
  {
    name: 'Mitered Construction',
    value: 'M'
  },
  {
    name: 'MT Construction',
    value: 'MT'
  },
  {
    name: 'Special Item',
    value: 'Special'
  }
];

const orderType = [
  {
    name: 'Door Order',
    value: 'Door'
  },
  {
    name: 'Drawer Front',
    value: 'DF'
  }
];

const thickness = [
  {
    name: '4/4',
    value: 0.75
  },
  {
    name: '5/4',
    value: 1
  }
];

class Design extends React.Component {
  constructor(props) {
    super(props);
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately'
    }, {
      key: 'onClick',
      name: 'On Button Click'
    }];
    this.state = {
      showFilterRow: true,
      showHeaderFilter: true,
      currentFilter: this.applyFilterTypes[0].key,
      productData: new CustomStore({
        load: () => this.props.getProduct(),
        insert: (values) => this.props.addProduct(values, 'designs'),
        update: (key, values) => this.props.updateProduct(key.id, values, 'designs'),
        remove: (key) => this.props.deleteProduct(key.id, 'designs')
      })
    };
    this.onShowFilterRowChanged = this.onShowFilterRowChanged.bind(this);
    this.onShowHeaderFilterChanged = this.onShowHeaderFilterChanged.bind(this);
    this.onCurrentFilterChanged = this.onCurrentFilterChanged.bind(this);
  }




    onInitNewRow = (e) => {
      const { product } = this.props;
      const item = product.length + 1;
      e.data.Item = item;
    }

    renderPhoto = (rowData) => {
      if (!rowData.data.photo) {
        return <div />;
      } else {
        return (
          <div
            style={{ width: '100px', height: '100px', margin: 'auto' }}
          >
            <img src={rowData.data.photo.url} style={{ width: '100px', height: '100px' }} />
          </div>
        );
      }
    }

    onUploaded = (cell, e) => {
      console.log(e);
      const data = JSON.parse(e.request.response);
      const id = data[0].id;
      console.log(id);
      cell.setValue(id);
    }


    editCellRender = (cell) => {
      let onUploaded = this.onUploaded.bind(this, cell);
      return (
        <div>
          <form id="form" ref={this.formElement} method="post" action="" encType="multipart/form-data">
            <FileUploader name="files" uploadMode="instantly" onUploaded={onUploaded} uploadUrl="http://server.portadoor.com/upload" />
          </form>

        </div>
      );
    }

    onShowFilterRowChanged(e) {
      this.setState({
        showFilterRow: e.value
      });
      this.clearFilter();
    }
    onShowHeaderFilterChanged(e) {
      this.setState({
        showHeaderFilter: e.value
      });
      this.clearFilter();
    }
    onCurrentFilterChanged(e) {
      this.setState({
        currentFilter: e.value
      });
    }



    render() {
      const { productData } = this.state;
      return (

        <React.Fragment>
          <DataGrid
            id="designs"
            dataSource={productData}
            keyExpr="id"
            allowColumnReordering={true}
            showBorders={true}
            onInitNewRow={this.onInitNewRow}
            allowColumnResizing={true}
            columnMinWidth={50}
            columnAutoWidth={true}
          >
            <ColumnFixing enabled={true} />
            <SearchPanel visible={true}
              width={240}
              placeholder="Search..." />

            <Paging defaultPageSize={20} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[20, 50, 100]}
              showInfo={true} />
            <Editing
              mode="popup"
              allowUpdating={true}
              allowAdding={true}
              allowDeleting={true}
              refreshMode="full"
            >
              <Popup title="Design" showTitle={true} width={700} height={525}>
                <Position my="top" at="top" of={window} />
              </Popup>
              <Form>
                <Item itemType="group" colCount={2} colSpan={2}>
                  <Item dataField="NAME" />
                  <Item dataField="DESIGNCOST" />
                  <Item dataField="Construction" />
                  <Item dataField="OrderType" />
                  <Item dataField="THICKNESS" />

                </Item>

                <Item itemType="group" caption="Stiles" colCount={2} colSpan={2}>
                  <Item dataField="L_STILE_W" />
                  <Item dataField="R_STILE_W" />
                </Item>
                <Item itemType="group" caption="Rails" colCount={2} colSpan={2}>
                  <Item dataField="TOP_RAIL_W" />
                  <Item dataField="BOT_RAIL_W" />
                </Item>

                <Item itemType="group" caption="Mullions" colCount={2} colSpan={2}>
                  <Item dataField="H_MULL_WTH" />
                  <Item dataField="V_MULL_WTH" />
                </Item>
                <Item itemType="group" caption="Panels" colCount={2} colSpan={2}>
                  <Item dataField="NUMHPANELS" />
                  <Item dataField="NUMVPANELS" />
                </Item>
                <Item itemType="group" caption="Misc" colCount={2} colSpan={2}>
                  <Item dataField="S_ADD_LEN" />
                  <Item dataField="TENON" />
                </Item>
                <Item itemType="group" colCount={2} colSpan={2}>
                  <Item dataField="photo" />
                </Item>
              </Form>
            </Editing>

            <Column type="buttons" width={70} fixed={true} fixedPosition={'left'}
              buttons={['edit', 'delete']} />
            <Column dataField="Item" caption="Item" width={30} fixed={true} sortOrder='asc' ><RequiredRule /></Column>

            <Column dataField="NAME" caption="Name" width={150} fixed={true}><RequiredRule /></Column>
            <Column dataField="photo" caption="Photo" width={150} fixed={true} cellRender={this.renderPhoto} editCellRender={this.editCellRender} setCellValue={this.setCellValue}></Column>
            <Column dataField="L_STILE_W" caption="Left Stile Width"><RequiredRule /></Column>
            <Column dataField="R_STILE_W" caption="Right Stile Width"><RequiredRule /></Column>
            <Column dataField="TOP_RAIL_W" caption="Top Rail Width"><RequiredRule /></Column>
            <Column dataField="BOT_RAIL_W" caption="Bottom Rail Width"><RequiredRule /></Column>
            <Column dataField="S_ADD_LEN" caption="ADD LENGTH"><RequiredRule /></Column>
            <Column dataField="H_MULL_WTH" caption="H Mull Width"><RequiredRule /></Column>
            <Column dataField="V_MULL_WTH" caption="V Mull Width"><RequiredRule /></Column>
            <Column dataField="NUMHPANELS" caption="Number of Panels High"><RequiredRule />
              <Lookup dataSource={numPanels} valueExpr="ID" displayExpr="Name" />
            </Column>
            <Column dataField="NUMVPANELS" caption="Number of Panels Wide"><RequiredRule />
              <Lookup dataSource={numPanels} valueExpr="ID" displayExpr="Name" />
            </Column>
            <Column dataField="DESIGNCOST" caption="Price"><RequiredRule /></Column>
            <Column dataField="TENON" caption="Tenon Factor"><RequiredRule /></Column>
            <Column dataField="THICKNESS" caption="Thickness"><RequiredRule />
              <Lookup dataSource={thickness} valueExpr="value" displayExpr="name" />
            </Column>
            <Column dataField="OrderType" caption="Order Type"><RequiredRule />
              <Lookup dataSource={orderType} valueExpr="value" displayExpr="name" />
            </Column>
            <Column dataField="Construction" caption="Construction"><RequiredRule />
              <Lookup dataSource={construction} valueExpr="value" displayExpr="name" />
            </Column>


          </DataGrid>
        </React.Fragment>
      );
    }
}

export default Design;
