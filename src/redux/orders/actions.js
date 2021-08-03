import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import db_url from '../db_url';

export const TOGGLE = 'TOGGLE';
export const LOAD_ORDERS = 'LOAD_ORDERS';
export const SUBMIT_ORDER = 'SUBMIT_ORDER';

export const SHIPPING_ADDRESS = 'SHIPPING_ADDRESS';

export const LOAD_SELECTED_ORDER = 'LOAD_SELECTED_ORDER';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const LOAD_CUSTOMER_ORDER = 'LOAD_CUSTOMER_ORDER';
export const COUNT_ORDERS = 'COUNT_ORDERS';
export const SELECT_DATE_RANGE = 'SELECT_DATE_RANGE';

export const UPDATE_STATUS = 'UPDATE_STATUS';
export const LOAD_SHIPPING_METHODS = 'LOAD_SHIPPING_METHODS';

export const UPDATE_ORDER_NUM = 'UPDATE_ORDER_NUM';
export const DELETE_ORDER = 'DELETE_ORDER';
export const UPDATE_BALANCE = 'UPDATE_BALANCE';
export const LOAD_DELIVERIES = 'LOAD_DELIVERIES';
export const LOAD_PAYMENT_TYPES = 'LOAD_PAYMENT_TYPES';
export const LOAD_PAYMENT_TERMS = 'LOAD_PAYMENT_TERMS';

export const SOCKET_LOAD_ORDERS = 'SOCKET_LOAD_ORDERS';
export const SOCKET_RECEIVE_UPDATE_STATUS = 'SOCKET_RECEIVE_UPDATE_STATUS';
export const SET_SELECTED_ORDER = 'SET_SELECTED_ORDER';
export const UPLOAD_FILE_TO_ORDER = 'UPLOAD_FILE_TO_ORDER';
export const ORDER_ADDED = 'ORDER_ADDED';
export const ORDER_UPDATED = 'ORDER_UPDATED';
export const ORDER_DELETED = 'ORDER_DELETED';

export const UPDATE_NOTES = 'UPDATE_NOTES';

export const UPDATE_SELECTED_ORDER = 'UPDATE_SELECTED_ORDER';

export function orderAdded(res) {
  return async function (dispatch) {
    return dispatch({
      type: ORDER_ADDED,
      data: res,
    });
  };
}

export function orderUpdated(res) {
  return async function (dispatch) {
    return dispatch({
      type: ORDER_UPDATED,
      data: res,
    });
  };
}

export function orderDeleted(res) {
  return async function (dispatch) {
    return dispatch({
      type: ORDER_DELETED,
      data: res,
    });
  };
}

export function setSelectedOrder(data) {
  return async function (dispatch) {
    return await dispatch({
      type: SET_SELECTED_ORDER,
      data: data,
    });
  };
}

export function updateSelectedOrder(data) {
  return async function (dispatch) {
    return await dispatch({
      type: UPDATE_SELECTED_ORDER,
      data: data,
    });
  };
}

export function uploadFilesToOrder(order, e, cookie) {
  const orderId = order.id;

  const id = e.map((i) => i.id);
  const orderIds = order.files.map((i) => i.id);

  const fileIds = orderIds.concat(id);

  const files = {
    files: fileIds,
  };

  return async function (dispatch) {
    try {
      const res = await axios.put(`${db_url}/orders/${orderId}`, files, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      });
      const data = await res;

      return dispatch({
        type: UPLOAD_FILE_TO_ORDER,
        data: data,
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error(
        'There was an problem with your submission',
        'Error',
        2000
      );
    }
  };
}

export function loadOrders(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/orders`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    });
    const data = await res.json();
    return await dispatch({
      type: LOAD_ORDERS,
      data: data,
    });
  };
}

export function loadAllOrders(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/orders/all`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    });
    const data = await res.json();
    return await dispatch({
      type: LOAD_ORDERS,
      data: data,
    });
  };
}

export function submitOrder(order, cookie) {
  return async function (dispatch) {
    try {
      const res = axios.post(`${db_url}/orders/`, order, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      });
      const data = await res;
      return dispatch({
        type: SUBMIT_ORDER,
        data: data,
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error(
        'There was an problem with your submission',
        'Error',
        2000
      );
    }
  };
}

export function deleteOrder(orderId, cookie) {
  return async function (dispatch) {
    try {
      const res = await axios.delete(`${db_url}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      });
      const data = await res;
      return dispatch({
        type: DELETE_ORDER,
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error(
        'There was an problem with your submission',
        'Error',
        2000
      );
    }
  };
}

export function updateOrder(orderId, order, cookie) {
  return async function (dispatch) {
    try {
      const res = await axios.put(`${db_url}/orders/${orderId}`, order, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      });
      const data = await res;

      return dispatch({
        type: UPDATE_ORDER,
        data: data,
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error(
        'There was an problem with your submission',
        'Error',
        2000
      );
    }
  };
}

export function updateStatus(orderId, key, status, cookie) {
  const item = {
    status: status.status,
    tracking: [
      ...key.tracking,
      {
        status: status.status,
        date: new Date(),
      },
    ],
  };
  return async function (dispatch) {
    try {
      const res = await axios.put(`${db_url}/orders/status/${orderId}`, item, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      });
      const data = await res;
      return dispatch({
        type: UPDATE_STATUS,
        data: data,
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error(
        'There was an problem with your submission',
        'Error',
        2000
      );
    }
  };
}

export function socketReceiveUpdateStatus(res) {
  return async function (dispatch) {
    return dispatch({
      type: SOCKET_RECEIVE_UPDATE_STATUS,
      data: res,
    });
  };
}

export function updateBalance(orderId, balance, cookie) {
  let item;

  if (balance.status === 'Quote') {
    item = {
      balance_due: balance.balance_due,
      balance_paid: balance.balance_paid,
      balance_history: [
        ...balance.balance_history,
        {
          balance_due: parseFloat(balance.balance_due),
          balance_paid: parseFloat(balance.balance_paid),
          payment_method: balance.payment_method,
          date: balance.payment_date,
        },
      ],
      status: 'Ordered',
      tracking: [
        ...balance.tracking,
        {
          status: 'Ordered',
          date: new Date(),
        },
      ],
    };
  } else {
    item = {
      balance_due: balance.balance_due,
      balance_paid: balance.balance_paid,
      balance_history: [
        ...balance.balance_history,
        {
          balance_due: parseFloat(balance.balance_due),
          balance_paid: parseFloat(balance.balance_paid),
          payment_method: balance.payment_method,
          date: balance.payment_date,
        },
      ],
    };
  }

  return async function (dispatch) {
    try {
      await axios.put(`${db_url}/orders/${orderId}`, item, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      });
      return dispatch({
        type: UPDATE_BALANCE,
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error(
        'There was an problem with your submission',
        'Error',
        2000
      );
    }
  };
}

export function getDeliveries(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/deliveries`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    });
    const data = await res.json();
    return await dispatch({
      type: LOAD_DELIVERIES,
      data: data,
    });
  };
}

export function updateNotes(orderId, balance, cookie) {
  const item = {
    Conversation_Notes: [
      ...balance.Conversation_Notes,
      {
        note: balance.note,
        date: new Date(),
      },
    ],
  };

  return async function (dispatch) {
    try {
      await axios.put(`${db_url}/orders/${orderId}`, item, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      });
      return dispatch({
        type: UPDATE_NOTES,
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error(
        'There was an problem with your submission',
        'Error',
        2000
      );
    }
  };
}
