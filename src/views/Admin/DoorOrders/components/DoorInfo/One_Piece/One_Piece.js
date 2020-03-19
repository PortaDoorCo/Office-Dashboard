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
import { Field } from "redux-form";
import {
    getOnePieceWoodtypes,
    getOnePieceDesigns,
    getOnePieceEdges,
    getOnePiecePanels,
    getFinish
} from "../../../../../../redux/part_list/actions";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cookies from "js-cookie";
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField } from '../../RenderInputs/renderInputs'

const required = value => (value ? undefined : 'Required');


class One_Piece_Door extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = async () => {
        const cookie = await Cookies.get("jwt");
        const {
            getOnePieceWoodtypes,
            getOnePieceDesigns,
            getOnePieceEdges,
            getOnePiecePanels,
            getFinish
        } = this.props;

        if (cookie) {
            await getOnePieceWoodtypes(cookie);
            await getOnePieceDesigns(cookie);
            await getOnePieceEdges(cookie);
            await getOnePiecePanels(cookie);
            await getFinish(cookie);
        } else {
            alert('not logged in')
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
                                name={`${part}.edges`}
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
                            <Label htmlFor="hinges">Panels</Label>
                            <Field
                                name={`${part}.face_frame_top_rail`}
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
                            <Label htmlFor="hinges">Finishes</Label>
                            <Field
                                name={`${part}.furniture_feets`}
                                component={renderDropdownList}
                                data={finishes}
                                valueField="value"
                                textField="NAME"
                                validate={required}
                            />
                        </FormGroup>
                    </Col>

                </Row>
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
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getOnePieceWoodtypes,
            getOnePieceDesigns,
            getOnePieceEdges,
            getOnePiecePanels,
            getFinish
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(One_Piece_Door);
