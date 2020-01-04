import React from 'react';
import DataGrid, {
  Column, Editing, Popup, Paging, Lookup, RequiredRule, Position,
  Form, Pager, SearchPanel, ColumnFixing
} from 'devextreme-react/data-grid';
import { FileUploader } from 'devextreme-react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import { Item } from 'devextreme-react/form';
import CustomStore from 'devextreme/data/custom_store';
import Cookies from "js-cookie";

const cookie = Cookies.get("jwt");


const thickness = [
  {
    name: '0.75',
    value: 0.75
  },
  {
    name: '1',
    value: 1
  }
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

class Moulds extends React.Component {
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
        load: () => this.props.getProduct(cookie),
        insert: (values) => this.props.addProduct(values, "moulds", cookie),
        update: (key, values) => this.props.updateProduct(key.id, values, 'moulds', cookie),
        remove: (key) => this.props.deleteProduct(key.id, 'moulds', cookie)
      })

    };
    this.onShowFilterRowChanged = this.onShowFilterRowChanged.bind(this);
    this.onShowHeaderFilterChanged = this.onShowHeaderFilterChanged.bind(this);
    this.onCurrentFilterChanged = this.onCurrentFilterChanged.bind(this);
    this.formElement = React.createRef();
  }

  componentDidMount() {
    localStorage.removeItem('uploadUrl');
  }

  onInitNewRow = (e) => {
    const { product } = this.props;
    const item = product.length + 1
    e.data.Item = item
  }

  renderPhoto = (rowData) => {
    if (!rowData.data.photo) {
      return <div />
    } else {
      return (
        <div
          style={{ width: '100px', height: '100px', margin: 'auto' }}
        >
          <img src={rowData.data.photo.url} alt='moulds' style={{ width: '100px', height: '100px' }} />
        </div>
      )
    }
  }

  onUploaded = (cell, e) => {
  
    const data = JSON.parse(e.request.response)
    const id = data[0].id
  
    cell.setValue(id)
  }


  editCellRender = (cell) => {
    let onUploaded = this.onUploaded.bind(this, cell)
    return (
      <div>
        <form id="form" ref={this.formElement} method="post" action="" encType="multipart/form-data">
          <FileUploader name="files" uploadMode="instantly" onUploaded={onUploaded} uploadUrl="https://server.portadoor.com/upload" />
        </form>
      </div>
    )
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
          id="moulds"
          dataSource={productData}
          keyExpr="id"
          allowColumnReordering={true}
          showBorders={true}
          onInitNewRow={this.onInitNewRow}
          onRowInserted={this.onRowInserted}
          onRowUpdating={this.onEditorPreparing}
          onEditingStart={this.onEditingStart}
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
            <Popup title="Moulds" showTitle={true} width={700} height={525}>
              <Position my="top" at="top" of={window} />
            </Popup>
            <Form>
              <Item itemType="group" colCount={2} colSpan={2}>
                <Item dataField="NAME" />
                <Item dataField="Width" />
                <Item dataField="Thickness" />
                <Item dataField="Construction" />
              </Item>
              <Item itemType="group" colCount={2} colSpan={2}>
                <Item dataField="photo" />
              </Item>
            </Form>
          </Editing>
          <Column type="buttons" width={70} fixed={true} fixedPosition={'left'}
            buttons={['edit', 'delete']} />
          <Column dataField="Item" caption="Item" width={30} fixed={true} sortOrder='asc'><RequiredRule /></Column>
          <Column dataField="NAME" caption="Name" fixed={true}><RequiredRule /></Column>
          <Column dataField="Width" caption="Width" fixed={true}><RequiredRule /></Column>
          <Column dataField="Thickness" caption="Thickness" fixed={true}><RequiredRule />
            <Lookup dataSource={thickness} valueExpr="value" displayExpr="name" />
          </Column>
          <Column dataField="Construction" caption="Construction" fixed={true}><RequiredRule />
            <Lookup dataSource={construction} valueExpr="value" displayExpr="name" />
          </Column>
          <Column dataField="photo" caption="Photo" fixed={true} cellRender={this.renderPhoto} editCellRender={this.editCellRender} setCellValue={this.setCellValue}></Column>

        </DataGrid>
      </React.Fragment>
    );
  }
}
export default Moulds;
