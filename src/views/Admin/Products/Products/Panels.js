import React from 'react';
import DataGrid, {
    Column, Editing, Popup, Paging, RequiredRule, Position,
    Form, Pager, SearchPanel, ColumnFixing
} from 'devextreme-react/data-grid';
import { FileUploader } from 'devextreme-react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import { Item } from 'devextreme-react/form';
import CustomStore from 'devextreme/data/custom_store';
import Cookies from "js-cookie";

const cookie = Cookies.get("jwt");

class Panels extends React.Component {
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
                insert: (values) => this.props.addProduct(values, "panels", cookie),
                update: (key, values) => this.props.updateProduct(key.id, values, 'panels', cookie),
                remove: (key) => this.props.deleteProduct(key.id, 'panels', cookie)
            })

        };
        this.onShowFilterRowChanged = this.onShowFilterRowChanged.bind(this);
        this.onShowHeaderFilterChanged = this.onShowHeaderFilterChanged.bind(this);
        this.onCurrentFilterChanged = this.onCurrentFilterChanged.bind(this);
        this.formElement = React.createRef();
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
                    <img src={rowData.data.photo.url} alt='panels' style={{ width: '150px', height: '90px' }} />
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
                    id="panels"
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
                        <Popup title="Edges" showTitle={true} width={700} height={525}>
                            <Position my="top" at="top" of={window} />
                        </Popup>
                        <Form>
                            <Item itemType="group" colCount={2} colSpan={2}>
                                <Item dataField="PANEL" />
                                <Item dataField="IN_SET" />
                                <Item dataField="WASTE_PCT" />
                                <Item dataField="ADDCOST" />
                            </Item>
                            <Item itemType="group" colCount={2} colSpan={2}>
                                <Item dataField="photo" />
                            </Item>
                        </Form>
                    </Editing>
                    <Column type="buttons" width={70} fixed={true} fixedPosition={'left'}
                        buttons={['edit', 'delete']} />
                    <Column dataField="Item" caption="Item" width={30} fixed={true} sortOrder='asc'><RequiredRule /></Column>
                    <Column dataField="PANEL" caption="Name" fixed={true}><RequiredRule /></Column>
                    <Column dataField="IN_SET" caption="Inset" fixed={true}><RequiredRule /></Column>
                    <Column dataField="WASTE_PCT" caption="Waste %" fixed={true}><RequiredRule /></Column>
                    <Column dataField="ADDCOST" caption="Additional Cost" fixed={true}><RequiredRule /></Column>

                    <Column dataField="photo" width={200} caption="Photo" fixed={true} cellRender={this.renderPhoto} editCellRender={this.editCellRender} setCellValue={this.setCellValue}></Column>

                </DataGrid>
            </React.Fragment>
        );
    }
}
export default Panels;
