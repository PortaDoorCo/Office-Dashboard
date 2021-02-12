import React, { Component } from 'react';
import { NavLink } from 'reactstrap';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import truck from '../../../../assets/icon/truck.png';
import delivery from '../../../../assets/icon/delivery.png';
import OrderPage from '../../Orders/OrderPage';
import { setSelectedOrder } from '../../../../redux/orders/actions';
import moment from 'moment';


// To use the Google Maps JavaScript API, you must register your app project on the Google API Console and get a Google API key which you can add to your app
const apiKey = 'AIzaSyB_JC10u6MVdITB1FhLhCJGNu_qQ8kJyFE';

// const defaultZoom = 13;
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
    const { locations, orders, setSelectedOrder } = this.props;
    return (
      <div>
        <MarkerClusterer
          averageCenter
          enableRetinaIcons
          gridSize={60}
        >
          {locations.map((location, index) => {
                 
            return (
              <DeliveryInfoWindow key={index} location={location} orders={orders} setSelectedOrder={setSelectedOrder} />
            );
          })}
        </MarkerClusterer>
      </div>

    );

  }
}

class DeliveryInfoWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      modal: false,
      edit: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  editable = () => {
    this.setState({ 
      edit: !this.state.edit
    });
  }


  toggleOrder = (id) => {
    const { setSelectedOrder, orders } = this.props;
    const { modal } = this.state;

    const selectedOrder = orders.filter(i => i.id === id);

    this.setState({
      modal: !modal
    });

    this.setState({
      isOpen: false
    });

    console.log({selectedOrder});

    if(!modal){
      setSelectedOrder(selectedOrder[0]);
      
    } else {
      setSelectedOrder(null);
    }

  }

  render() {
    const { location } = this.props;
    const { modal, edit } = this.state;



    const loc = {
      lat: location.location.latitude,
      lng: location.location.longitude
    };

    return (
      <div>

        <Marker
          onClick={this.toggle}
          icon={{
            url: delivery
          }}
          position={loc}
          title={'Delivery'}
        >

          {this.state.isOpen &&
                    <InfoWindow onCloseClick={this.toggle}>
                      <div onClick={() => this.toggleOrder(location.order && location.order.id)}>{location && location.company}</div>
                    </InfoWindow>}
        </Marker>

        {modal ? <OrderPage
          toggle={this.toggleOrder}
          modal={modal}
          editable={this.editable}
          edit={edit}        
        /> : null}

      </div>


    );
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
    const { locations } = this.props;
    return locations.map((location, index) => {
       
      return (
        <DriverInfoWindow key={index} location={location} />
      );
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

  

    const loc = {
      lat: location.coords.latitude,
      lng: location.coords.longitude
    };

    return (

      <Marker
        onClick={this.toggle}
        icon={{
          url: truck
        }}
        position={loc}
        title={'Driver'}
        label={location.address}>
        {this.state.isOpen &&
                    <InfoWindow onCloseClick={this.toggle}>
                      <NavLink href={location.www} target="_blank">Driver</NavLink>
                    </InfoWindow>}
      </Marker>


    );
  }
}



const GoogleMapsComponent = withScriptjs(withGoogleMap((props) => {



  const center = {
    lat: 41.3879115,
    lng: -73.0502929
  };
  const zoom = 8;

  return (
    <GoogleMap defaultZoom={zoom} center={center}>
      {props.locations.length>0 ? <DeliveryLocations locations={props.locations} orders={props.orders} setSelectedOrder={props.setSelectedOrder} /> : <div />}
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

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
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
          defaultCenter={this.props.defaultCenter}
          driverLocations={this.state.driverLocations}
          orders={this.props.orders}
          setSelectedOrder={this.props.setSelectedOrder}
        />

      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  deliveries: state.Orders.deliveries,
  orders: state.Orders.orders
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setSelectedOrder
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Maps);
