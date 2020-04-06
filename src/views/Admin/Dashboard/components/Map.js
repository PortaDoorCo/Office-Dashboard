import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const Marker = (props: any) => {
    const { color, name, id } = props;
    return (
        <div className="marker"
            style={{ backgroundColor: color, cursor: 'pointer' }}
            title={name}
        />
    );
};
class Map extends Component {
    static defaultProps = {
        center: {
            lat: 41.379521,
            lng: -73.045469
        },
        zoom: 8
    };

    render() {
        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '100%', width: '100%' }}>
                <h3>Deliveries</h3>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyB_JC10u6MVdITB1FhLhCJGNu_qQ8kJyFE' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                >
                    <Marker
                        lat={41.379521}
                        lng={-73.045469}
                        name="Driver"
                        color="red"
                    />
                </GoogleMapReact>
            </div>
        );
    }
}

export default Map;