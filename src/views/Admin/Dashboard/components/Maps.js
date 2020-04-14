import React, { Component } from 'react';
import { NavLink } from 'reactstrap';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import truck from '../../../../assets/icon/truck.png'
import delivery from '../../../../assets/icon/delivery.png'
import io from 'socket.io-client';

const socket = io('https://server.portadoor.com/');
// To use the Google Maps JavaScript API, you must register your app project on the Google API Console and get a Google API key which you can add to your app
const apiKey = 'AIzaSyB_JC10u6MVdITB1FhLhCJGNu_qQ8kJyFE'

const defaultZoom = 13;
// const defaultCenter = []
// const locations = [];




class DeliveryLocations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: []
        };
    }

    render() {
        const { locations } = this.props
        return (
            <div>
                <MarkerClusterer
                    averageCenter
                    enableRetinaIcons
                    gridSize={60}
                >
                    {locations.map((location, index) => {
                        console.log(location)
                        return (
                            <DeliveryInfoWindow key={index} location={location} />
                        )
                    })}
                </MarkerClusterer>
            </div>

        )

    }
}

class DeliveryInfoWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        const { location } = this.props;

        console.log(location)

        const loc = {
            lat: location.location.latitude,
            lng: location.location.longitude
        }

        return (
            <Marker
                onClick={this.toggle}
                icon={{
                    url: delivery
                }}

                position={loc}
                title={"Delivery"}
                label={location.address}>

                {this.state.isOpen &&
                    <InfoWindow onCloseClick={this.toggle}>
                        <NavLink href={location.www} target="_blank">{location.companyprofile.Company}</NavLink>
                    </InfoWindow>}
            </Marker>

        )
    }
}

class DriverLocations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: []
        };
    }

    render() {
        const { locations } = this.props
        return locations.map((location, index) => {
            console.log(location)
            return (
                <DriverInfoWindow key={index} location={location} />
            )
        }
        );
    }
}

class DriverInfoWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        const { location } = this.props;

        console.log(location)

        const loc = {
            lat: location.coords.latitude,
            lng: location.coords.longitude
        }

        return (

            <Marker
                onClick={this.toggle}
                icon={{
                    url: truck
                }}
                position={loc}
                title={"Driver"}
                label={location.address}>
                {this.state.isOpen &&
                    <InfoWindow onCloseClick={this.toggle}>
                        <NavLink href={location.www} target="_blank">Driver</NavLink>
                    </InfoWindow>}
            </Marker>


        )
    }
}



const GoogleMapsComponent = withScriptjs(withGoogleMap((props) => {

    console.log(props)

    const center = {
        lat: 41.3879115,
        lng: -73.0502929
    }
    const zoom = 8

    return (
        <GoogleMap defaultZoom={zoom} center={center}>
            {props.locations.length>0 ? <DeliveryLocations locations={props.locations} /> : <div />}
            {<DriverLocations locations={props.driverLocations} />}
        </GoogleMap>
    );
}
));

class Maps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            defaultCenter: [],
            driverLocations: []
        };
    }

    componentDidMount() {

        // socket.emit('position', {
        //     coords: {
        //         latitude: 41.3705498,
        //         longitude: -73.2105237
        //     }
        // })

        socket.on('drivers', res =>
            this.setState({
                driverLocations: res
            })
        )
    }



    render() {



        return (
            <div className="animated fadeIn">

                <GoogleMapsComponent
                    key="map"
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${apiKey}`}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `600px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    locations={this.props.deliveries}
                    defaultCenter={this.props.defaultCenter}
                    driverLocations={this.state.driverLocations}
                />

            </div>
        )
    }
}

const mapStateToProps = (state, prop) => ({
    deliveries: state.Orders.deliveries
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {

        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Maps);
