import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import moment from 'moment'
import db_url from '../db_url'

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
export const UPDATE_ORDER_NUM = 'UPDATE_ORDER_NUM'
export const DELETE_ORDER = 'DELETE_ORDER'
export const UPDATE_BALANCE = 'UPDATE_BALANCE'

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



export function loadOrders(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/orders?_limit=500&_sort=orderNum:DESC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return await dispatch({
      type: LOAD_ORDERS,
      data: data
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

export function submitOrder(order, cookie) {
  return async function (dispatch) {
    try {
      const res = axios.post(`${db_url}/orders/`, order,
        {
          headers: {
            'Authorization': `Bearer ${cookie}`
          }
        }
      );
      const data = await res;
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


export function deleteOrder(orderId, cookie) {
  return async function (dispatch) {
    try {
      const res = await axios.delete(`${db_url}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });
      const data = await res;
      return dispatch({
        type: DELETE_ORDER,
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission', 'Error', 2000);
    }
  };
}



export function loadCustomers(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/companyprofiles?_limit=2000&_sort=CUSTNO:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return await dispatch({
      type: LOAD_CUSTOMERS,
      data: data
    });
  };
}

export function updateCustomer(custId, customer, cookie) {
  return async function (dispatch) {
    try {
      const res = await axios.put(`${db_url}/companyprofiles/${custId}`, customer,
        {
          headers: {
            'Authorization': `Bearer ${cookie}`
          }
        }
      );
      const data = await res;

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

export function loadSales(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/sales`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: LOAD_SALES,
      data: data
    });
  };
}

export function loadShippingMethod(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/shippingmethods`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: LOAD_SHIPPING_METHODS,
      data: data
    });
  };
}

export function submitCustomer(customer, cookie) {
  return async function (dispatch) {
    try {
      const res = await axios.post(`${db_url}/companyprofiles`, customer, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });


      NotificationManager.success(`Customer has been added!`, 'Submission Succeeded!', 2000);
      return dispatch({
        type: SUBMIT_CUSTOMER,
        data: res
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission', 'Error', 2000);
    }
  };
}

export function resetOrder(cookie) {
  return async function (dispatch) {
    return dispatch({
      type: RESET_ORDER
    });
  };
}

export function loadSelectedOrder(data, cookie) {
  return async function (dispatch) {
    return dispatch({
      type: LOAD_SELECTED_ORDER,
      data: data
    });
  };
}

export function updateOrder(orderId, order, cookie) {
  console.log("SKDFJDSFKLJSDF")
  return async function (dispatch) {

    try {
      const res = await axios.put(`${db_url}/orders/${orderId}`, order, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });
      const data = await res;
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


export function updateStatus(orderId, key, status, cookie) {
  console.log(key)
  console.log(status)
  const item = {
    status: status.status,
    tracking: [
      ...key.tracking,
      {
        "status": status.status,
        "date": new Date()
      }
    ]
  }

  console.log(item)
  return async function (dispatch) {
    try {
     await axios.put(`${db_url}/orders/status/${orderId}`, item, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });
      return dispatch({
        type: UPDATE_STATUS,
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission', 'Error', 2000);
    }
  };
}

export function updateBalance(orderId, balance, cookie) {

  const item = {
    balance_due: balance.balance_due,
    balance_paid: balance.balance_paid,
    balance_history: [
      ...balance.balance_history,
      {
        "balance_due": parseFloat(balance.balance_due),
        "balance_paid": parseFloat(balance.balance_paid),
        "date": new Date()
      }
    ]
  }
  console.log(balance)
  console.log(item)


  return async function (dispatch) {
    try {
     await axios.put(`${db_url}/orders/${orderId}`, item, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });
      return dispatch({
        type: UPDATE_BALANCE,
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

