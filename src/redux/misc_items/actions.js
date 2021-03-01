import db_url from '../db_url';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';

export const SELECT_DATE_RANGE = 'SELECT_DATE_RANGE';
export const LOAD_SHIPPING_METHODS = 'LOAD_SHIPPING_METHODS';
export const LOAD_PAYMENT_TYPES = 'LOAD_PAYMENT_TYPES';
export const LOAD_PAYMENT_TERMS = 'LOAD_PAYMENT_TERMS';
export const LOAD_MISC_ITEMS = 'LOAD_MISC_ITEMS';
export const UPDATE_MISC_ITEMS = 'UPDATE_MISC_ITEMS';
export const DELETE_MISC_ITEM = 'DELETE_MISC_ITEM';
export const ADD_MISC_ITEM = 'ADD_MISC_ITEM';
export const MISC_ITEM_DELETED = 'MISC_ITEM_DELETED';
export const MISC_ITEM_ADDED = 'MISC_ITEM_ADDED';
export const MISC_ITEM_UPDATED = 'MISC_ITEM_UPDATED';
export const LOAD_CATEGORIES = 'LOAD_CATEGORIES';
export const LOAD_PRINTER_OPTIONS = 'LOAD_PRINTER_OPTIONS';
export const ADD_PRINTER_OPTION = 'ADD_PRINTER_OPTION';
export const SAVE_PRINTER_OPTION = 'SAVE_PRINTER_OPTION';
export const PRINTER_OPTION_ADDED = 'PRINTER_OPTION_ADDED';
export const PRINTER_OPTION_UPDATED = 'PRINTER_OPTION_UPDATED';

export function loadPrinterOptions(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/printer-options`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: LOAD_PRINTER_OPTIONS,
      data: data
    });
  };
}

export function addPrinterOption(data) {
  return async function (dispatch) {

    return dispatch({
      type: ADD_PRINTER_OPTION,
      data: data
    });
  };
}

export function savePrinterOption(id, item, cookie) {
  return async function (dispatch) {
    try {
      const res = await axios.put(`${db_url}/printer-options/${id}`, item,
        {
          headers: {
            'Authorization': `Bearer ${cookie}`
          }
        }
      );
      const data = await res;

      NotificationManager.success('Printing Option Saved!', 'Saved', 2000);
      return dispatch({
        type: SAVE_PRINTER_OPTION,
      });
    } catch (error) {
      console.error(error);
      // NotificationManager.error('There was an problem with your submission', 'Error', 2000);
    }
  };
}



export function loadShippingMethod(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/shipping-methods`, {
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

export function loadCategories(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/category`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: LOAD_CATEGORIES,
      data: data
    });
  };
}

export function loadPaymentTypes(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/payment-types`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: LOAD_PAYMENT_TYPES,
      data: data
    });
  };
}

export function loadPaymentTerms(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/payment-terms`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: LOAD_PAYMENT_TERMS,
      data: data
    });
  };
}

export function loadMiscItems(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/misc-items`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: LOAD_MISC_ITEMS,
      data: data
    });
  };
}

export function updateMiscItem(id, item, cookie) {
  return async function (dispatch) {
    try {
      const res = await axios.put(`${db_url}/misc-items/${id}`, item,
        {
          headers: {
            'Authorization': `Bearer ${cookie}`
          }
        }
      );
      const data = await res;

      // NotificationManager.success('Customer has been update!', 'Customer Updated!', 2000);
      return dispatch({
        type: UPDATE_MISC_ITEMS,
        data: data.data
      });
    } catch (error) {
      console.error(error);
      // NotificationManager.error('There was an problem with your submission', 'Error', 2000);
    }
  };
}

export function addMiscItem(product, cookie) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(`${db_url}/misc-items`, product, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });
      return dispatch({
        type: ADD_MISC_ITEM,
        data: data
      });
    } catch (error) {
      console.error(error);
      // NotificationManager.error('There was an problem with your submission.  Your changes were not saved', 'Error', 4000);
    }
  };
}


export function deleteMiscItem(id, cookie) {
  return async function (dispatch) {
    try {
      const res = await axios.delete(`${db_url}/misc-items/${id}`, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });
      const data = await res;
      return dispatch({
        type: DELETE_MISC_ITEM,
      });
    } catch (error) {
      console.error(error);
      // NotificationManager.error('There was an problem with your submission', 'Error', 2000);
    }
  };
}

export function miscItemUpdated(data) {
  return async function (dispatch) {


    return dispatch({
      type: MISC_ITEM_UPDATED,
      data: data,
    });
  };
}

export function miscItemAdded(data, entity) {
  return async function (dispatch) {
    return dispatch({
      type: MISC_ITEM_ADDED,
      data: entity,
    });
  };
}

export function miscItemDeleted(res) {

  return async function (dispatch) {
    return dispatch({
      type: MISC_ITEM_DELETED,
      data: res
    });
  };
}

export function printerOptionAdded(data) {

  return async function (dispatch) {
    return dispatch({
      type: PRINTER_OPTION_ADDED,
      data: data,
    });
  };
}

export function printerOptionUpdated(data, entity) {
  console.log({entity});
  return async function (dispatch) {
    return dispatch({
      type: PRINTER_OPTION_UPDATED,
      data: entity,
    });
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



