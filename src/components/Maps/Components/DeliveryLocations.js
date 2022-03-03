import React, { Component } from 'react';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { DeliveryInfoWindow } from './DeliveryInfoWindow';

export class DeliveryLocations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: [],
    };
  }

  render() {
    const { locations } = this.props;
    return (
      <div>
        <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
          {locations.map((location, index) => {
            return (
              <DeliveryInfoWindow
                key={index}
                location={location}
                {...this.props}
              />
            );
          })}
        </MarkerClusterer>
      </div>
    );
  }
}
