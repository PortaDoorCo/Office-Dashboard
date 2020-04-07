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
            driverLocations: []
        }
    }

    componentDidMount() {
        socket.emit('position', {
            coords: {
                latitude: 32.2140789,
                longitude: -110.9478166
            }
        })
        socket.on('drivers', res => 
            this.setState({
                driverLocations: res
            })
        )
    }


    static defaultProps = {
        center: {
            lat: 32.25888143746854,
            lng: -110.94025981016813
        },
        zoom: 8
    };

    render() {
        const { driverLocations } = this.state;
        console.log(driverLocations)
        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '100%', width: '100%' }}>
                <h3>Deliveries</h3>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyB_JC10u6MVdITB1FhLhCJGNu_qQ8kJyFE' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                >
                    {this.state.driverLocations.map(i => {
                        return (
                            <Marker
                            lat={i.coords.latitude}
                            lng={i.coords.longitude}
                            name="Driver"
                            color="red"
                        />
                        )
                    })}

                </GoogleMapReact>
            </div>
        );
    }
}

export default Map;