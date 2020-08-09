import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import truck from '../../../../assets/icon/truck.png';
import delivery from '../../../../assets/icon/delivery.png';
import db_url from '../../../../redux/db_url';
const socket = io(db_url);




const Drivers = () => {
  return (
    <div className="truck" title="Delivery Truck">
      <img alt='truck' src={truck}></img>
      <div className="pulse" />
    </div>
  );
};

const Deliveries = () => {
  return (
    <div className="marker" title="Delivery Truck">
      <img alt='truck' src={delivery}></img>
      {/* <div className="pulse" /> */}
    </div>
  );
};

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driverLocations: []
    };
  }

  componentDidMount() {

    socket.emit('position', {
      coords: {
        latitude: 41.3705498,
        longitude: -73.2105237
      }
    });

    socket.on('drivers', res =>
      this.setState({
        driverLocations: res
      })
    );
  }

  componentWillUnmount(){
    socket.disconnect();
  }



    static defaultProps = {
      center: {
        lat: 41.3879115,
        lng: -73.0502929
      },
      zoom: 8
    };

    render() {
      const { deliveries } = this.props;
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
                <Drivers
                  lat={i.coords.latitude}
                  lng={i.coords.longitude}
                  name="Driver"
                  color="red"
                />
              );
            })}

            {deliveries.map(i => {
              return (
                <Deliveries
                  lat={i.location.latitude}
                  lng={i.location.longitude}
                  name="Delivery"
                  color="blue"
                />
              );
            })}


          </GoogleMapReact>
        </div>
      );
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
)(Map);