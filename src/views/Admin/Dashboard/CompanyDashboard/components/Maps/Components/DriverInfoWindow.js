import React, { Component } from 'react';
import { NavLink } from 'reactstrap';
import { Marker, InfoWindow } from 'react-google-maps';
import truck from '../../../../../../../assets/icon/truck.png';

export class DriverInfoWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  render() {
    const { location } = this.props;

    console.log({ location });

    const loc = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };

    return (
      <Marker
        onClick={this.toggle}
        icon={{
          url: truck,
        }}
        position={loc}
        title={'Driver'}
        label={location.address}
      >
        {this.state.isOpen && (
          <InfoWindow onCloseClick={this.toggle}>
            <NavLink href={location.www} target="_blank">
              Driver
            </NavLink>
          </InfoWindow>
        )}
      </Marker>
    );
  }
}
