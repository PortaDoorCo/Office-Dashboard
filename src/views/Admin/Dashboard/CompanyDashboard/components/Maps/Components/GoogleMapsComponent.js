import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';
import { DeliveryLocations } from './DeliveryLocations';
import { DriverLocations } from './DriverLocations';

export const GoogleMapsComponent = withScriptjs(
  withGoogleMap((props) => {
    const center = {
      lat: 41.3879115,
      lng: -73.0502929,
    };
    const zoom = 8;

    return (
      <GoogleMap defaultZoom={zoom} center={center}>
        {props.locations.length > 0 ? (
          <DeliveryLocations
            locations={props.locations}
            orders={props.orders}
            setSelectedOrder={props.setSelectedOrder}
          />
        ) : (
          <div />
        )}
        {<DriverLocations locations={props.driverLocations} />}
      </GoogleMap>
    );
  })
);
