import {
  LOAD_ORDERS,
  SUBMIT_ORDER,
  UPDATE_ORDER,
  LOAD_DELIVERIES,
  UPDATE_STATUS,
  SOCKET_RECEIVE_UPDATE_STATUS,
  SET_SELECTED_ORDER,
  UPLOAD_FILE_TO_ORDER,
  ORDER_ADDED,
  ORDER_UPDATED,
  ORDER_DELETED,
  UPDATE_SELECTED_ORDER,
  UPDATE_NOTES,
  DELETE_FILE_FROM_ORDER
} from './actions';
import moment from 'moment';

const initialState = {
  ordersDBLoaded: false,
  orders: [],
  deliveries: [],
  sortedDestinations: [],
  selectedOrder: null,
};

export default function (state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case LOAD_ORDERS:
      return {
        ...state,
        orders: data,
        ordersDBLoaded: true,
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
        orders: state.orders.map((i) =>
          i.id === data.id ? data : i
        ),
      };
    case ORDER_DELETED:
      return {
        ...state,
        orders: state.orders.filter(item => item.id !== data.id),
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
        selectedOrder: data.data
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
        return moment(d.updatedAt).isSame(new Date(), 'day');
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
