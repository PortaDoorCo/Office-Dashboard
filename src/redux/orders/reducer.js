import moment from 'moment';
import {
  DELETE_FILE_FROM_ORDER,
  LOAD_DELIVERIES,
  LOAD_ORDERS,
  ORDER_ADDED,
  ORDER_DELETED,
  ORDER_UPDATED,
  SET_ORDER_TYPE,
  SET_SELECTED_ORDER,
  SOCKET_RECEIVE_UPDATE_STATUS,
  SUBMIT_ORDER,
  UPDATE_ORDER,
  UPDATE_STATUS,
  UPLOAD_FILE_TO_ORDER,
} from './actions';

const initialState = {
  ordersDBLoaded: false,
  orders: [],
  deliveries: [],
  sortedDestinations: [],
  selectedOrder: null,
  orderType: null,
};

export default function (state = initialState, action) {
  const { type, data, ordersDBLoaded } = action;
  switch (type) {
    case LOAD_ORDERS:
      return {
        ...state,
        orders: data,
        ordersDBLoaded: ordersDBLoaded,
      };
    case SET_ORDER_TYPE:
      return {
        ...state,
        orderType: data,
      };
    case SUBMIT_ORDER:
      return {
        ...state,
      };
    case ORDER_ADDED:
      return {
        ...state,
        orders: [data, ...state.orders],
      };
    case ORDER_UPDATED:
      return {
        ...state,
        orders: state.orders.map((i) => (i.id === data.id ? data : i)),
      };
    case ORDER_DELETED:
      return {
        ...state,
        orders: state.orders.filter((item) => item.id !== data.id),
      };
    case SET_SELECTED_ORDER:
      return {
        ...state,
        selectedOrder: data,
      };
    case UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map((item, index) => {
          if (item.id !== data.data.id) {
            return item;
          }
          return data.data;
        }),
        selectedOrder: data.data,
      };
    case UPLOAD_FILE_TO_ORDER:
      return {
        ...state,
        orders: state.orders.map((item, index) => {
          if (item.id !== data.data.id) {
            return item;
          }
          return data.data;
        }),
        selectedOrder: data.data,
      };
    case DELETE_FILE_FROM_ORDER:
      return {
        ...state,
        orders: state.orders.map((item, index) => {
          if (item.id !== data.data.id) {
            return item;
          }
          return data.data;
        }),
        selectedOrder: data.data,
      };
    case UPDATE_STATUS:
      return {
        ...state,
        orders: state.orders.map((item, index) => {
          if (item.id !== data.data.id) {
            return item;
          }
          return data.data;
        }),
      };
    case SOCKET_RECEIVE_UPDATE_STATUS:
      return {
        ...state,
        orders: state.orders.map((item, index) => {
          if (item.id !== data.id) {
            return item;
          }
          return data;
        }),
      };
    case LOAD_DELIVERIES:
      const updatedDeliveries = data;

      const dateDeliveries = updatedDeliveries.filter(function (d, i) {
        return moment(d.updated_at).isSame(new Date(), 'day');
      });
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
