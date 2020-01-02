import React from 'react';
import DataGrid, {
    Column, Editing, Popup, Paging, Lookup, RequiredRule, Position,
    Form, Pager, FilterRow, HeaderFilter, SearchPanel, ColumnFixing
} from 'devextreme-react/data-grid';
import { SelectBox, CheckBox, FileUploader } from 'devextreme-react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import { Item } from 'devextreme-react/form';
import CustomStore from 'devextreme/data/custom_store';



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

class Woodtype extends React.Component {
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
                insert: (values) => this.props.addProduct(values, "woodtypes"),
                update: (key, values) => this.props.updateProduct(key.id, values, 'woodtypes'),
                remove: (key) => this.props.deleteProduct(key.id, 'woodtypes')
            })

        };
        this.onShowFilterRowChanged = this.onShowFilterRowChanged.bind(this);
        this.onShowHeaderFilterChanged = this.onShowHeaderFilterChanged.bind(this);
        this.onCurrentFilterChanged = this.onCurrentFilterChanged.bind(this);
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
                    <img src={rowData.data.photo.url} style={{ width: '100px', height: '100px' }} />
                </div>
            )
        }
    }

    onUploaded = (cell, e) => {
        console.log(e)
        const data = JSON.parse(e.request.response)
        const id = data[0].id
        console.log(id)
        cell.setValue(id)
    }


    editCellRender = (cell) => {
        let onUploaded = this.onUploaded.bind(this, cell)
        return (
            <div>
                <form id="form" ref={this.formElement} method="post" action="" encType="multipart/form-data">
                    <FileUploader name="files" uploadMode="instantly" onUploaded={onUploaded} uploadUrl="http://localhost:1337/upload" />
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
                    id="woodtypes"
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
                        <Popup title="Woodtype" showTitle={true} width={700} height={525}>
                            <Position my="top" at="top" of={window} />
                        </Popup>
                        <Form>
                            <Item itemType="group" colCount={2} colSpan={2}>
                                <Item dataField="NAME" />
                                <Item dataField="PRICE" />
                                <Item dataField="THICKNESS" />
                            </Item>
                            <Item itemType="group" colCount={2} colSpan={2}>
                                <Item dataField="photo" />
                            </Item>
                        </Form>
                    </Editing>
                    <Column type="buttons" width={70} fixed={true} fixedPosition={'left'}
                        buttons={['edit', 'delete']} />
                    <Column dataField="Item" caption="Item" width={30} fixed={true} sortOrder='asc' ><RequiredRule /></Column>
                    <Column dataField="NAME" caption="Name" fixed={true}><RequiredRule /></Column>
                    <Column dataField="THICKNESS" caption="Thickness" fixed={true}><RequiredRule />
                        <Lookup dataSource={thickness} valueExpr="value" displayExpr="name" />
                    </Column>
                    <Column dataField="PRICE" caption="Price" fixed={true}><RequiredRule /></Column>
                    <Column dataField="photo" caption="Photo" fixed={true} cellRender={this.renderPhoto} editCellRender={this.editCellRender} setCellValue={this.setCellValue}></Column>
                </DataGrid>
            </React.Fragment>
        );
    }
}
export default Woodtype;
