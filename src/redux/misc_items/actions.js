import db_url from '../db_url';

export const SELECT_DATE_RANGE = 'SELECT_DATE_RANGE';
export const LOAD_SHIPPING_METHODS = 'LOAD_SHIPPING_METHODS';
export const LOAD_PAYMENT_TYPES = 'LOAD_PAYMENT_TYPES';
export const LOAD_PAYMENT_TERMS = 'LOAD_PAYMENT_TERMS';
export const LOAD_MISC_ITEMS = 'LOAD_MISC_ITEMS';

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


export function selectDateRange(date) {
  return async function (dispatch) {
    return dispatch({
      type: SELECT_DATE_RANGE,
      date: date
    });
  };
}



