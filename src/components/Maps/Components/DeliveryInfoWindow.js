import React, { Component } from 'react';
import { Marker, InfoWindow } from 'react-google-maps';
import delivery from '../../../assets/icon/delivery.png';
import OrderPage from '../../../views/Admin/Orders/OrderPage';

export class DeliveryInfoWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      modal: false,
      edit: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  editable = () => {
    this.setState({
      edit: !this.state.edit,
    });
  };

  toggleOrder = (id) => {
    const { setSelectedOrder, orders } = this.props;
    const { modal } = this.state;

    const selectedOrder = orders.filter((i) => i.id === id);

    this.setState({
      modal: !modal,
    });

    this.setState({
      isOpen: false,
    });

    if (!modal) {
      setSelectedOrder(selectedOrder[0]);
    } else {
      setSelectedOrder(null);
    }
  };

  render() {
    const { location } = this.props;
    const { modal, edit } = this.state;

    const loc = {
      lat: location.location.latitude,
      lng: location.location.longitude,
    };

    return (
      <div>
        <Marker
          onClick={this.toggle}
          icon={{
            url: delivery,
          }}
          position={loc}
          title={'Delivery'}
        >
          {this.state.isOpen && (
            <InfoWindow onCloseClick={this.toggle}>
              <div
                onClick={() =>
                  this.toggleOrder(location.order && location.order.id)
                }
              >
                {location && location.company}
              </div>
            </InfoWindow>
          )}
        </Marker>

        {modal ? (
          <OrderPage
            toggle={this.toggleOrder}
            modal={modal}
            editable={this.editable}
            edit={edit}
          />
        ) : null}
      </div>
    );
  }
}
