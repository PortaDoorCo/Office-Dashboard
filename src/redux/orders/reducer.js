import {
  LOAD_ORDERS,
  SUBMIT_ORDER,
  UPDATE_ORDER,
  LOAD_DELIVERIES,
  SOCKET_LOAD_ORDERS
} from './actions';
import moment from 'moment'

import uniqid from 'uniqid';

const initialState = {
  ordersDBLoaded: false,
  orders: [],
  deliveries: [],
  sortedDestinations: [],
};

export default function (state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case LOAD_ORDERS:
      return {
        ...state,
        orders: data,
        ordersDBLoaded: true
      };
    case SUBMIT_ORDER:
      return {
        ...state,
      };
    case UPDATE_ORDER:
      return {
        ...state,
      };
    case SOCKET_LOAD_ORDERS:
      return {
        ...state,
        orders: [...state.orders, data]
      };
    case LOAD_DELIVERIES:
      const updatedDeliveries = data
      const dateDeliveries = updatedDeliveries.filter(function (d, i) {
        return moment(d.createdAt).isSame(new Date(), 'day')
      })
      // const sortedLocations = sortByDistance(state.current_location.coords, updatedDeliveries.map(i=>i.location), opts);

      // const sortedDestinations = sortedLocations.map(location => {
      //     const deliveryCompany = updatedDeliveries.find(({ location: { latitude }}) => latitude === location.latitude);
      //     return deliveryCompany;
      // });

      return {
        ...state,
        deliveries: dateDeliveries,
        // sortedDestinations
      };
    default:
      return {
        ...state,

      };
  }
}
