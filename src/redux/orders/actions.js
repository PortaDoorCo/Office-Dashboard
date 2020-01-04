import axios from 'axios';
import { NotificationManager } from 'react-notifications';

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const TOGGLE = 'TOGGLE';
export const LOAD_ORDERS = 'LOAD_ORDERS';
export const SUBMIT_ORDER = 'SUBMIT_ORDER';
export const LOAD_CUSTOMERS = 'LOAD_CUSTOMERS';
export const SUBMIT_CUSTOMER = 'SUBMIT_CUSTOMER';
export const SHIPPING_ADDRESS = 'SHIPPING_ADDRESS';
export const RESET_ORDER = 'RESET_ORDER';
export const LOAD_SELECTED_ORDER = 'LOAD_SELECTED_ORDER';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const LOAD_CUSTOMER_ORDER = 'LOAD_CUSTOMER_ORDER';
export const COUNT_ORDERS = 'COUNT_ORDERS';
export const SELECT_DATE_RANGE = 'SELECT_DATE_RANGE';
export const LOAD_SALES = 'LOAD_SALES';
export const UPDATE_STATUS = 'UPDATE_STATUS';
export const LOAD_SHIPPING_METHODS = 'LOAD_SHIPPING_METHODS';
export const UPDATE_CUSTOMER = 'UPDATE_CUSTOMER';

const url = 'https://portadoor-server-production.herokuapp.com/'

export function addToCart(
  order,
  price,
  customer,
  jobInfo,
  orderType,
  subTotal
) {
  return async function (dispatch) {
    return dispatch({
      type: ADD_TO_CART,
      data: order,
      price: price,
      subTotal: subTotal,
      customer: customer,
      jobInfo: jobInfo,
      orderType: orderType
    });
  };
}

export function removeFromCart(order) {
  return async function (dispatch) {
    return dispatch({
      type: REMOVE_FROM_CART,
      data: order
    });
  };
}

export function shippingAddress(address) {
  return async function (dispatch) {
    return dispatch({
      type: SHIPPING_ADDRESS,
      data: address
    });
  };
}

export function countOrders() {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/orders/count`);
    const data = await res.json();
    return dispatch({
      type: COUNT_ORDERS,
      data: data
    });
  };
}

export function loadOrders() {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/orders?_limit=500&_sort=orderNum:DESC`);
    const data = await res.json();
    return await dispatch({
      type: LOAD_ORDERS,
      data: data
    });
  };
}

export function loadOrderSubmitted() {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/orders/5e0e7d7df863b200179227be`);
    const data = await res.json();
    return await dispatch({

    });
  };
}

export function loadCustomerOrder(customer) {
  return async function (dispatch) {
    return dispatch({
      type: LOAD_CUSTOMER_ORDER,
      data: customer
    });
  };
}

export function submitOrder(order) {
  return async function (dispatch) {
    try {
      const res = axios.post(`https://portadoor-server-production.herokuapp.com/orders`, order);
      const data = await res;
      // NotificationManager.success('Your order was successfully submitted', 'Submit Success', 2000);
      return dispatch({
        type: SUBMIT_ORDER,
        data: data
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission', 'Error', 2000);
    }
  };
}

export function loadCustomers() {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/companyprofiles?_limit=2000&_sort=CUSTNO:ASC`);
    const data = await res.json();
    return await dispatch({
      type: LOAD_CUSTOMERS,
      data: data
    });
  };
}

export function updateCustomer(custId, customer) {
  return async function (dispatch) {
    try {
      const res = await axios.put(`https://portadoor-server-production.herokuapp.com/companyprofiles/${custId}`, customer);
      const data = await res;
      console.log(data);
      NotificationManager.success(`Customer has been update!`, 'Customer Updated!', 2000);
      return dispatch({
        type: UPDATE_CUSTOMER,
        data: data.data
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission', 'Error', 2000);
    }
  };
}

export function loadSales() {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/sales`);
    const data = await res.json();
    return dispatch({
      type: LOAD_SALES,
      data: data
    });
  };
}

export function loadShippingMethod() {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/shippingmethods`);
    const data = await res.json();
    return dispatch({
      type: LOAD_SHIPPING_METHODS,
      data: data
    });
  };
}

export function submitCustomer(customer) {
  return async function (dispatch) {
    try {
      const res = await axios.post(`https://portadoor-server-production.herokuapp.com/companyprofiles`, customer);
      const data = await res;
      console.log(data);
      NotificationManager.success(`Customer has been added!`, 'Submission Succeeded!', 2000);
      return dispatch({
        type: SUBMIT_CUSTOMER,
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission', 'Error', 2000);
    }
  };
}

export function resetOrder() {
  return async function (dispatch) {
    return dispatch({
      type: RESET_ORDER
    });
  };
}

export function loadSelectedOrder(data) {
  return async function (dispatch) {
    return dispatch({
      type: LOAD_SELECTED_ORDER,
      data: data
    });
  };
}

export function updateOrder(orderId, order) {
  return async function (dispatch) {

    try {
      const res = await axios.put(`https://portadoor-server-production.herokuapp.com/orders/orders/${orderId}`, order);
      const data = await res;
      console.log(data);
      NotificationManager.success(`Order ${data.data.orderNum} has been update!`, 'Order Updated!', 2000);
      return dispatch({
        type: UPDATE_ORDER,
        data: data
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission', 'Error', 2000);
    }
  };
}


export function updateStatus(orderId, status) {
  return async function (dispatch) {
    try {
      const res = await axios.put(`https://portadoor-server-production.herokuapp.com/orders/${orderId}`, status);
      const data = await res;
      console.log(data);
      // NotificationManager.success(`Order ${data.data.orderNum} has been update!`, 'Order Updated!', 2000);
      return dispatch({
        type: UPDATE_STATUS,
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission', 'Error', 2000);
    }
  };
}


export function selectDateRange(date) {
  return async function (dispatch) {
    return dispatch({
      type: SELECT_DATE_RANGE,
      date: date
    });
  };
}
