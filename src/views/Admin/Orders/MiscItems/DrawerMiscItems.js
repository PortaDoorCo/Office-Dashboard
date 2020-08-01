import React, { Component } from 'react';
import { Field, reduxForm, FieldArray, getFormValues, change } from 'redux-form';
import { renderField, renderDropdownListFilter, renderPrice } from '../SelectedOrder/DoorOrders/components/RenderInputs/renderInputs';
import { Button, Row, Col, Table, Input } from 'reactstrap';
import { connect } from 'react-redux';


let Inputs = props => {
    const { fields, misc_items, edit } = props

    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>QTY</th>
                        <th>Item</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {fields.map((table, index) => {
                        return (
                            <tr key={index}>
                                <td style={{ width: '90px' }}><Field name={`${table}.qty`} edit={edit} component={renderField} type="text" /></td>
                                <td >
                                    <Field
                                        name={`${table}.item`}
                                        component={renderDropdownListFilter}
                                        data={misc_items}
                                        edit={edit}
                                        valueField="value"
                                        textField="NAME"
                                    />
                                </td>
                                <td style={{ width: '150px' }}><Field name={`${table}.price`} edit={edit} component={renderPrice} type="text" /></td>
                                <td> {!edit ? <Button color="danger" onClick={() => fields.remove(index)}>X</Button> : null}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

            {!edit ?
                <Button color="primary" className="mt-3" onClick={() => fields.push({
                    qty: 1,
                    price: 0
                })}>Add Item</Button>
                : null
            }
        </div>
    )
}

class MiscItems extends Component {

    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps) {
        const { formState } = this.props;
        if (formState && formState.misc_items) {
            if ((formState && formState.misc_items) !== (prevProps.formState && prevProps.formState.misc_items)) {
                const misc_items = formState.misc_items
                misc_items.forEach((i, index) => {
                    if (i.item) {
                        if (i.item.Price !== 0) {
                            this.props.dispatch(
                                change(
                                    'DrawerOrder',
                                    `misc_items[${index}].price`,
                                    (i.qty ? (i.item.Price * parseInt(i.qty)) : i.item.Price)
                                )
                            );
                        } else {
                            return
                        }
                    }
                })
            } else {
                return
            }
        } else {
            return
        }
    }

    render() {
        const { handleSubmit, pristine, reset, submitting, misc_items, edit } = this.props
        return (
            <div>
                <h3>Misc Items</h3>
                <FieldArray name="misc_items" component={Inputs} edit={edit} misc_items={misc_items} />
            </div>
        );
    }
}



const mapStateToProps = state => ({
    formState: getFormValues('DrawerOrder')(state),
    misc_items: state.misc_items.misc_items
});

MiscItems = reduxForm({
    form: 'DrawerOrder',
    enableReinitialize: true
})(MiscItems)


export default connect(
    mapStateToProps,
    null
)(MiscItems);