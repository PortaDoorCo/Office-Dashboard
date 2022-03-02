import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSelectedOrder } from '../../../../../../redux/orders/actions';
import moment from 'moment';
import { GoogleMapsComponent } from './Components/GoogleMapsComponent';

// To use the Google Maps JavaScript API, you must register your app project on the Google API Console and get a Google API key which you can add to your app
const apiKey = 'AIzaSyB_JC10u6MVdITB1FhLhCJGNu_qQ8kJyFE';

class Maps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      defaultCenter: [],
      driverLocations: [],
    };
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <div className="animated fadeIn">
        <h3>{moment().format('dddd, MMMM Do YYYY')}</h3>
        <h3>Today's Deliveries</h3>
        <GoogleMapsComponent
          key="map"
          googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${apiKey}`}
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '600px' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          locations={this.props.deliveries}
          // defaultCenter={this.props.defaultCenter}
          driverLocations={this.state.driverLocations}
          orders={this.props.orders}
          setSelectedOrder={this.props.setSelectedOrder}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  deliveries: state.Orders.deliveries,
  orders: state.Orders.orders,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setSelectedOrder,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Maps);
