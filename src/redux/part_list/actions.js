import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import db_url from '../db_url';
import { showLoading } from 'react-redux-loading-bar';



export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const UPLOAD_FILE = 'UPLOAD_FILE';
export const GET_PHOTO_ID = 'GET_PHOTO_ID';
export const GET_BREAKDOWNS = 'GET_BREAKDOWNS';
export const UPDATE_BREAKDOWNS = 'UPDATE_BREAKDOWNS';
export const GET_BOX_BREAKDOWNS = 'GET_BOX_BREAKDOWNS';
export const GET_PRICING = 'GET_PRICING';
export const UPDATE_PRICING = 'UPDATE_PRICING';
export const GET_ALL_PRODUCTS = 'GET_ALL_PRODUCTS';
export const GET_SINGLE_PRODUCT = 'GET_SINGLE_PRODUCT';
export const PRODUCT_ADDED = 'PRODUCT_ADDED';
export const PRODUCT_DELETED = 'PRODUCT_DELETED';
export const PRODUCT_UPDATED = 'PRODUCT_UPDATED';

export function getAllProducts(cookie) {

  return async function (dispatch) {
    await dispatch(showLoading());
    const res = await fetch(`${db_url}/products-api`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_ALL_PRODUCTS,
      data: data
    });
  };
}

export function getSingleProduct(id, product, cookie) {

  return async function (dispatch) {
    const res = await fetch(`${db_url}/products-api/get/${product}/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_SINGLE_PRODUCT,
      data: data,
      product: product
    });
  };
}

export function productUpdated(res, data) {
  return async function (dispatch) {

    return dispatch({
      type: PRODUCT_UPDATED,
      data: data,
      product: res.product
    });
  };
}

export function productAdded(res, data) {
  return async function (dispatch) {
    return dispatch({
      type: PRODUCT_ADDED,
      data: data,
      product: res.id
    });
  };
}

export function productDeleted(res) {

  return async function (dispatch) {
    return dispatch({
      type: PRODUCT_DELETED,
      data: res
    });
  };
}


export function addProduct(product, url, cookie) {

  return async function (dispatch) {
    try {
      const { data } = await axios.post(`${db_url}/products-api/post/${url}`, product, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });
      return dispatch({
        type: ADD_PRODUCT,
        data: data
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission.  Your changes were not saved', 'Error', 4000);
    }
  };
}

export function updateProduct(productId, product, collection, cookie) {


  return async function (dispatch) {
    try {
      const { data } = await axios.put(`${db_url}/products-api/update/${collection}/${productId}`, product, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });
      return dispatch({
        type: UPDATE_PRODUCT,
        data: data
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission.  Your changes were not saved', 'Error', 4000);
    }
  };
}

export function deleteProduct(orderId, product, cookie) {

  return async function (dispatch) {
    try {
      const { data } = await axios.delete(`${db_url}/products-api/delete/${product}/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });
      return dispatch({
        type: DELETE_PRODUCT,
        data: data,
        product: product,
        id: orderId
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission.  Your changes were not saved', 'Error', 4000);
    }
  };
}



export function uploadFile(file, cookie) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(`${db_url}/upload`, file, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });
      return dispatch({
        type: UPLOAD_FILE,
        data: data[0]
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission.  Your changes were not saved', 'Error', 4000);
    }
  };
}

export function getPhotoId(i, cookie) {
  return async function (dispatch) {
    try {
      return dispatch({
        type: GET_PHOTO_ID,
        data: i
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission.  Your changes were not saved', 'Error', 4000);
    }
  };
}

export function getBreakdowns(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/breakdowns`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_BREAKDOWNS,
      data: data
    });
  };
}

export function updateBreakdowns(id, item, cookie) {
  return async function (dispatch) {
    const { data } = await axios.put(`${db_url}/breakdowns/${id}`, item, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });

    NotificationManager.success('Breakdown Updated!', 'Breakdown Updated!', 2000);
    return dispatch({
      type: UPDATE_BREAKDOWNS,
      data: data
    });
  };
}

export function getBoxBreakdowns(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/breakdowns-boxes`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_BOX_BREAKDOWNS,
      data: data
    });
  };
}

export function getPricing(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/pricings`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_PRICING,
      data: data
    });
  };
}

export function updatePricing(id, item, cookie) {
  return async function (dispatch) {
    const { data } = await axios.put(`${db_url}/pricings/${id}`, item, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });

    NotificationManager.success('Pricing Updated!', 'Pricing Updated!', 2000);
    return dispatch({
      type: UPDATE_PRICING,
      data: data
    });
  };
}

