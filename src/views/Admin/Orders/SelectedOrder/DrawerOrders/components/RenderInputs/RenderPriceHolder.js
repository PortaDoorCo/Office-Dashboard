import React, { Component } from 'react';
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';

class RenderPriceHolder extends Component {
  render() {
    const { edit } = this.props;
    return (
      <div>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <Input placeholder={this.props.input} disabled={edit} autocomplete="new-password" />
        </InputGroup>
      </div>
    );
  }
}

export default RenderPriceHolder;