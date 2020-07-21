import React, { Component } from 'react';
import {
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap'

class RenderPriceHolder extends Component {
    render() {
        return (
            <div>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder={this.props.input} autocomplete="new-password" />
                </InputGroup>
            </div>
        );
    }
}

export default RenderPriceHolder;