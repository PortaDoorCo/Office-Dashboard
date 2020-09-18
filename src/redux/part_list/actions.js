import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import db_url from '../db_url';


export const GET_WOODTYPES = 'GET_WOODTYPES';
export const GET_APPLIED_MOULDS = 'GET_APPLIED_MOULDS';
export const GET_BASE_CAP = 'GET_BASE_CAP';
export const GET_BASEBOARDS = 'GET_BASEBOARDS';
export const GET_CASINGS = 'GET_CASINGS';
export const GET_CHAIR_RAILS = 'GET_CHAIR_RAILS';
export const GET_COPE_DESIGNS = 'GET_COPE_DESIGNS';
export const GET_CROWN_MOULDINGS = 'GET_CROWN_MOULDINGS';
export const GET_EDGE_SLABS = 'GET_EDGE_SLABS';
export const GET_EDGES = 'GET_EDGES';
export const GET_FINISH = 'GET_FINISH';
export const GET_LITES = 'GET_LITES';
export const GET_MITER_DF_DESIGNS = 'GET_MITER_DF_DESIGNS';
export const GET_MITER_DESIGNS = 'GET_MITER_DESIGNS';
export const GET_MOULDINGS_LENGTHS = 'GET_MOULDINGS_LENGTHS';
export const GET_MT_DESIGNS = 'GET_MT_DESIGNS';
export const GET_MT_DF_DESIGNS = 'GET_MT_DF_DESIGNS';
export const GET_PANELS = 'GET_PANELS';
export const GET_PLYNTHS_STOOLS = 'GET_PLYNTHS_STOOLS';
export const GET_PROFILES = 'GET_PROFILES';
export const GET_SOLID_CROWNS = 'GET_SOLID_CROWNS';
export const GET_WAINSCOT_BEADS = 'GET_WAINSCOT_BEADS';
export const GET_FACE_FRAME_DESIGNS = 'GET_FACE_FRAME_DESIGNS';
export const GET_FACE_FRAME_TOP_RAILS = 'GET_FACE_FRAME_TOP_RAILS';
export const GET_FURNITURE_FEET = 'GET_FURNITURE_FEET';
export const GET_ONE_PIECE_WOODTYPES = 'GET_ONE_PIECE_WOODTYPES';
export const GET_ONE_PIECE_DESIGNS = 'GET_ONE_PIECE_DESIGNS';
export const GET_ONE_PIECE_PANELS = 'GET_ONE_PIECE_PANELS';
export const GET_ONE_PIECE_EDGES = 'GET_ONE_PIECE_EDGES';

export const GET_BOX_SCOOPS = 'GET_BOX_SCOOPS';

export const GET_BOX_BOTTOM_THICKNESS = 'GET_BOX_BOTTOM_THICKNESS';
export const GET_BOX_FINISH = 'GET_BOX_FINISH';
export const GET_BOX_NOTCHES = 'GET_BOX_NOTCHES';
export const GET_BOX_THICKNESS = 'GET_BOX_THICKNESS';
export const GET_BOX_WOODTYPES = 'GET_BOX_WOODTYPES';
export const GET_BOX_BOTTOM_WOODTYPES = 'GET_BOX_BOTTOM_WOODTYPES';

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
    const res = await fetch(`${db_url}/breakdowns?_sort=Item:ASC`,
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

