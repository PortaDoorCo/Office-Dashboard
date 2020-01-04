import axios from "axios";
import { NotificationManager } from 'react-notifications';


export const GET_WOODTYPES = 'GET_WOODTYPES';
export const GET_DESIGNS = 'GET_DESIGNS';
export const GET_EDGES = 'GET_EDGES';
export const GET_MOULDS = 'GET_MOULDS';
export const GET_PANELS = 'GET_PANELS';
export const GET_GRADES = 'GET_GRADES';
export const GET_FINISH = 'GET_FINISH';

export const GET_BOX_THICKNESS = 'GET_BOX_THICKNESS';
export const GET_BOX_BOTTOMS = 'GET_BOX_BOTTOMS';
export const GET_ASSEMBLY = 'GET_ASSEMBLY';
export const GET_NOTCH = 'GET_NOTCH';
export const GET_DOOR_EXTRAS = 'GET_DOOR_EXTRAS';
export const GET_HINGES = 'GET_HINGES';
export const GET_DRAWER_FINISH = 'GET_DRAWER_FINISH'

export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
export const ADD_PRODUCT = 'ADD_PRODUCT'
export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const UPLOAD_FILE = 'UPLOAD_FILE'
export const GET_PHOTO_ID = 'GET_PHOTO_ID'

export function getWoodtypes(cookie) {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/woodtypes?_limit=2000&_sort=_id:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_WOODTYPES,
      data: data
    });
  };
}

export function getDesigns(cookie) {

  return async function (dispatch) {

    const res = await fetch(`https://portadoor-server-production.herokuapp.com/designs?_limit=2000&_sort=Index:ASC`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
 
    return dispatch({
      type: GET_DESIGNS,
      data: data
    });
  };
}

export function getEdges(cookie) {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/edges?_limit=200&_sort=_id:ASC`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: GET_EDGES,
      data: data
    });
  };
}

export function getMoulds(cookie) {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/moulds?_limit=200&_sort=Index:ASC`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: GET_MOULDS,
      data: data
    });
  };
}

export function getPanels(cookie) {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/panels?_limit=200&_sort=PANEL_CODE:ASC`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: GET_PANELS,
      data: data
    });
  };
}

export function getGrades(cookie) {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/grades`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: GET_GRADES,
      data: data
    });
  };
}

export function getFinish(cookie) {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/finishes?_limit=200&_sort=_id:ASC`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: GET_FINISH,
      data: data
    });
  };
}

export function getBoxThickness(cookie) {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/boxthicknesses`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: GET_BOX_THICKNESS,
      data: data
    });
  };
}

export function getBoxBottoms(cookie) {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/boxbottoms`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    })
    const data = await res.json();
    return dispatch({
      type: GET_BOX_BOTTOMS,
      data: data
    });
  };
}

export function getAssembly(cookie) {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/assemblies`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: GET_ASSEMBLY,
      data: data
    });
  };
}

export function getNotch(cookie) {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/notchdrills`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: GET_NOTCH,
      data: data
    });
  };
}

export function getDrawerFinish(cookie) {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/drawerfinishes`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: GET_DRAWER_FINISH,
      data: data
    });
  };
}

export function getDoorExtras(cookie) {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/doorextras`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: GET_DOOR_EXTRAS,
      data: data
    });
  };
}

export function getHinges(cookie) {
  return async function (dispatch) {
    const res = await fetch(`https://portadoor-server-production.herokuapp.com/hinges`, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res.json();
    return dispatch({
      type: GET_HINGES,
      data: data
    });
  };
}

export function addProduct(product, url, cookie) {

  return async function (dispatch) {
    try {
      const { data } = await axios.post(`https://portadoor-server-production.herokuapp.com/${url}`, product, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });
   
      NotificationManager.success('Product Added', 'Product Added', 2000);
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

export function updateProduct(orderId, product, url, cookie) {
  return async function (dispatch) {
    try {
      const { data } = await axios.put(`https://portadoor-server-production.herokuapp.com/${url}/${orderId}`, product, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });
    
      // NotificationManager.success(`Product Updated!`, 'Order Updated!', 2000);
      return dispatch({
        type: UPDATE_PRODUCT,
        data:data
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
      const { data } = await axios.delete(`https://portadoor-server-production.herokuapp.com/${product}/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });
    
      // NotificationManager.success(`Product Deleted`, 'Product Deleted', 2000);
      return dispatch({
        type: DELETE_PRODUCT,
        data: data
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
      const { data } = await axios.post(`https://portadoor-server-production.herokuapp.com/upload`, file, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      })
  
      // NotificationManager.success(`Product Deleted`, 'Product Deleted', 2000);
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

