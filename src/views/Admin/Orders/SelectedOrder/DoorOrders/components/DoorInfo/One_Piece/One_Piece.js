import React, { Component, useState, Fragment, useEffect } from "react";
import {
    Row,
    Col,
    CardSubtitle,
    FormGroup,
    Label,
    Button,
    Input
} from "reactstrap";
import { Field, FieldArray, change } from "redux-form";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cookies from "js-cookie";
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField } from '../../RenderInputs/renderInputs'
import One_Piece_Table from '../../Table/Doors/One_Piece_Table'
import {
    linePriceSelector,
    itemPriceSelector,
    subTotalSelector,
    taxSelector,
    totalSelector,
    addPriceSelector
  } from '../../../../../../../../selectors/doorPricing';

const required = value => (value ? undefined : 'Required');



class One_Piece_Door extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps) {
        if (this.props.formState !== prevProps.formState) {
          if (this.props.formState) {
            const update = async () => {
              const form = await this.props.formState;
              const part_list = await form.part_list;
    
    
              part_list.forEach((part, i) => {
                if (part.dimensions) {
                  part.dimensions.forEach((info, index) => {
    
                    this.props.dispatch(
                      change(
                        'DoorOrder',
                        `part_list[${i}].dimensions[${index}].item`,
                        index + 1
                      )
                    )
                  });
                } else {
                  return;
                }
              })
    
    
            };
            update();
          }
        }
      }


    render() {
        const {
            part,
            one_piece_woodtypes,
            one_piece_designs,
            one_piece_edges,
            one_piece_panels,
            finishes,

            isValid,
            index,
            part_list,
            formState,
            prices,
            itemPrice,
            subTotal
        } = this.props;
        return (
            <div>
                <Row>
                    <Col xs="4">
                        <FormGroup>
                            <Label htmlFor="woodtype">Woodtype</Label>
                            <Field
                                name={`${part}.woodtype`}
                                component={renderDropdownListFilter}
                                data={one_piece_woodtypes}
                                valueField="value"
                                textField="NAME"
                                validate={required}
                            />
                        </FormGroup>
                    </Col>

                    <Col xs="4">
                        <FormGroup>
                            <Label htmlFor="design">Design</Label>
                            <Field
                                name={`${part}.design`}
                                component={renderDropdownListFilter}
                                data={one_piece_designs}
                                valueField="value"
                                textField="NAME"
                                validate={required}
                            />
                        </FormGroup>
                    </Col>

                    <Col xs="4">
                        <FormGroup>
                            <Label htmlFor="mould">Edge</Label>
                            <Field
                                name={`${part}.edge`}
                                component={renderDropdownList}
                                data={one_piece_edges}
                                valueField="value"
                                textField="NAME"
                                validate={required}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>

                    <Col xs="6">
                        <FormGroup>
                            <Label htmlFor="hinges">Panel</Label>
                            <Field
                                name={`${part}.panel`}
                                component={renderDropdownList}
                                data={one_piece_panels}
                                valueField="value"
                                textField="NAME"
                                validate={required}
                            />
                        </FormGroup>
                    </Col>


                    <Col xs="6">
                        <FormGroup>
                            <Label htmlFor="hinges">Finish</Label>
                            <Field
                                name={`${part}.finish`}
                                component={renderDropdownList}
                                data={finishes}
                                valueField="value"
                                textField="NAME"
                                validate={required}
                            />
                        </FormGroup>
                    </Col>

                </Row>

                <Row className="mt-2">
                    <Col xs="4">
                        <FormGroup>
                            <strong>
                                <Label for="jobNotes">Job Notes</Label>
                                <Field
                                    name={`${part}.notes`}
                                    type="textarea"
                                    component={renderField}
                                />
                            </strong>
                        </FormGroup>
                    </Col>
                </Row>

                <div>
                    <CardSubtitle className="mt-4 mb-1">Dimensions</CardSubtitle>
                    <div className="mt-1" />
                    <FieldArray
                        name={`${part}.dimensions`}
                        component={One_Piece_Table}
                        i={index}
                        prices={prices}
                        subTotal={subTotal}
                        part_list={part_list}
                        formState={formState}
                        isValid={isValid}
                        part={part}
                    // updateSubmit={updateSubmit}
                    />
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    one_piece_woodtypes: state.part_list.one_piece_woodtypes,
    one_piece_designs: state.part_list.one_piece_designs,
    one_piece_edges: state.part_list.one_piece_edges,
    one_piece_panels: state.part_list.one_piece_panels,
    finishes: state.part_list.finishes,

    prices: linePriceSelector(state),
    itemPrice: itemPriceSelector(state),
    subTotal: subTotalSelector(state),
});

export default connect(
    mapStateToProps,
    null
)(One_Piece_Door);
