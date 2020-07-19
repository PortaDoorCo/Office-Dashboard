import {
  LOAD_ORDERS,
  SUBMIT_ORDER,
  LOAD_SELECTED_ORDER,
  UPDATE_ORDER,
  LOAD_CUSTOMER_ORDER,
  SELECT_DATE_RANGE,
  LOAD_SHIPPING_METHODS,
  LOAD_DELIVERIES,
  LOAD_PAYMENT_TERMS,
  LOAD_PAYMENT_TYPES
} from './actions';
import moment from 'moment'

import uniqid from 'uniqid';

const initialState = {
  ordersDBLoaded: false,
  orders: [],
  deliveries: [],
  sortedDestinations: [],
  selectedDateRange: 'day',
  shippingMethods: [],
  paymentTypes: [],
  paymentTerms: [],
  loadedPaymentTypes: false,
  loadedPaymentTerms: false,
  loadedShippingMethods: false,
};

export default function (state = initialState, action) {
  const { type, data, date } = action;
  switch (type) {
    case LOAD_ORDERS:
      return {
        ...state,
        orders: data,
        ordersDBLoaded: true
      };

    case LOAD_CUSTOMER_ORDER:
      return {
        ...state,
        customerOrder: state.orders.filter(
          order => order.companyprofile === data
        )
      };
    case LOAD_SELECTED_ORDER:
      return {
        ...state,
        orders: data
      };
    case LOAD_PAYMENT_TERMS:
      return {
        ...state,
        paymentTerms: data,
        loadedPaymentTerms: true
      };
    case LOAD_PAYMENT_TYPES:
      return {
        ...state,
        paymentTypes: data,
        loadedPaymentTypes: true
      };
    case SUBMIT_ORDER:
      return {
        ...state,
        cart: [],
        submitted: false,
        subTotal: [],
        sessionOrders: state.sessionOrders + 1
      };
    case UPDATE_ORDER:
      return {
        ...state,
        cart: [],
        subTotal: [],
        sessionOrders: state.sessionOrders + 1
      };

    case SELECT_DATE_RANGE:
      return {
        ...state,
        selectedDateRange: date
      };
    case LOAD_SHIPPING_METHODS:
      return {
        ...state,
        shippingMethods: data,
        loadedShippingMethods: true
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
