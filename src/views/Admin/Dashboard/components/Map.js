import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import io from 'socket.io-client';
const socket = io('https://server.portadoor.com/');

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
    constructor(props) {
        super(props);
        this.state = {
            driverLocation: {}
        }
    }

    componentDidMount() {
        socket.on('otherPositions', res =>
            this.setState({
                driverLocation: {
                    latitude: res.position[0].coords.latitude,
                    longitude: res.position[0].coords.longitude
                }
            })
        )

        
    }


    static defaultProps = {
        center: {
            lat: 41.379521,
            lng: -73.045469
        },
        zoom: 8
    };

    render() {
        const { driverLocation } = this.state;
        console.log(driverLocation)
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
                        lat={driverLocation.latitude}
                        lng={driverLocation.longitude}
                        name="Driver"
                        color="red"
                    />
                </GoogleMapReact>
            </div>
        );
    }
}

export default Map;