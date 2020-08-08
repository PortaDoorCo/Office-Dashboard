import axios from "axios";
import { NotificationManager } from 'react-notifications';
import db_url from '../db_url'


export const GET_WOODTYPES = 'GET_WOODTYPES';
export const GET_APPLIED_MOULDS = 'GET_APPLIED_MOULDS';
export const GET_BASE_CAP = 'GET_BASE_CAP';
export const GET_BASEBOARDS = 'GET_BASEBOARDS'
export const GET_CASINGS = 'GET_CASINGS'
export const GET_CHAIR_RAILS = 'GET_CHAIR_RAILS'
export const GET_COPE_DESIGNS = 'GET_COPE_DESIGNS'
export const GET_CROWN_MOULDINGS = 'GET_CROWN_MOULDINGS'
export const GET_EDGE_SLABS = 'GET_EDGE_SLABS'
export const GET_EDGES = 'GET_EDGES'
export const GET_FINISH = 'GET_FINISH'
export const GET_LITES = 'GET_LITES'
export const GET_MITER_DF_DESIGNS = 'GET_MITER_DF_DESIGNS'
export const GET_MITER_DESIGNS = 'GET_MITER_DESIGNS'
export const GET_MOULDINGS_LENGTHS = 'GET_MOULDINGS_LENGTHS'
export const GET_MT_DESIGNS = 'GET_MT_DESIGNS'
export const GET_MT_DF_DESIGNS = 'GET_MT_DF_DESIGNS'
export const GET_PANELS = 'GET_PANELS'
export const GET_PLYNTHS_STOOLS = 'GET_PLYNTHS_STOOLS'
export const GET_PROFILES = 'GET_PROFILES'
export const GET_SOLID_CROWNS = 'GET_SOLID_CROWNS'
export const GET_WAINSCOT_BEADS = 'GET_WAINSCOT_BEADS'
export const GET_FACE_FRAME_DESIGNS = 'GET_FACE_FRAME_DESIGNS'
export const GET_FACE_FRAME_TOP_RAILS = 'GET_FACE_FRAME_TOP_RAILS'
export const GET_FURNITURE_FEET = 'GET_FURNITURE_FEET'
export const GET_ONE_PIECE_WOODTYPES = 'GET_ONE_PIECE_WOODTYPES'
export const GET_ONE_PIECE_DESIGNS = 'GET_ONE_PIECE_DESIGNS'
export const GET_ONE_PIECE_PANELS = 'GET_ONE_PIECE_PANELS'
export const GET_ONE_PIECE_EDGES = 'GET_ONE_PIECE_EDGES'

export const GET_BOX_BOTTOM_THICKNESS = 'GET_BOX_BOTTOM_THICKNESS'
export const GET_BOX_FINISH = 'GET_BOX_FINISH'
export const GET_BOX_NOTCHES = 'GET_BOX_NOTCHES'
export const GET_BOX_THICKNESS = 'GET_BOX_THICKNESS'
export const GET_BOX_WOODTYPES = 'GET_BOX_WOODTYPES'
export const GET_BOX_BOTTOM_WOODTYPES = 'GET_BOX_BOTTOM_WOODTYPES'

export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
export const ADD_PRODUCT = 'ADD_PRODUCT'
export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const UPLOAD_FILE = 'UPLOAD_FILE'
export const GET_PHOTO_ID = 'GET_PHOTO_ID'
export const GET_BREAKDOWNS = 'GET_BREAKDOWNS'
export const UPDATE_BREAKDOWNS = 'UPDATE_BREAKDOWNS'
export const GET_BOX_BREAKDOWNS = 'GET_BOX_BREAKDOWNS'
export const GET_PRICING = 'GET_PRICING'
export const UPDATE_PRICING = 'UPDATE_PRICING'

export function getWoodtypes(cookie) {
  console.log("FIREEEEE")
  return async function (dispatch) {
    const res = await fetch(`${db_url}/woodtypes`,
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

export function getAppliedMoulds(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/applied-profiles?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_APPLIED_MOULDS,
      data: data
    });
  };
}


export function getBaseCap(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/base-caps?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_BASE_CAP,
      data: data
    });
  };
}

export function getBaseboards(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/baseboards?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_BASEBOARDS,
      data: data
    });
  };
}

export function getCasings(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/casings?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_CASINGS,
      data: data
    });
  };
}

export function getChairRails(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/chair-rails?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_CHAIR_RAILS,
      data: data
    });
  };
}

export function getCopeDesigns(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/cope-designs?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_COPE_DESIGNS,
      data: data
    });
  };
}

export function getCrownMouldings(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/crown-mouldings?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_CROWN_MOULDINGS,
      data: data
    });
  };
}

export function getEdgeSlabs(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/edge-slabs?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_EDGE_SLABS,
      data: data
    });
  };
}

export function getEdges(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/edges?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_EDGES,
      data: data
    });
  };
}

export function getFinish(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/finishes?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_FINISH,
      data: data
    });
  };
}

export function getLites(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/lites?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_LITES,
      data: data
    });
  };
}


export function get_Miter_DF_Designs(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/miter-df-designs?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_MITER_DF_DESIGNS,
      data: data
    });
  };
}

export function getMiterDesigns(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/miter-designs?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_MITER_DESIGNS,
      data: data
    });
  };
}

export function getMouldingsLengths(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/mouldings-lengths?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_MOULDINGS_LENGTHS,
      data: data
    });
  };
}

export function getMTDesigns(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/mt-designs?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_MT_DESIGNS,
      data: data
    });
  };
}

export function get_MT_DF_Designs(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/mt-df-designs?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_MT_DF_DESIGNS,
      data: data
    });
  };
}

export function getPanels(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/panels?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_PANELS,
      data: data
    });
  };
}

export function get_Plyths_Stools(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/plynths-stools?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_PLYNTHS_STOOLS,
      data: data
    });
  };
}

export function getProfiles(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/profiles?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_PROFILES,
      data: data
    });
  };
}

export function getSolidCrowns(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/solid-crowns?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_SOLID_CROWNS,
      data: data
    });
  };
}

export function get_Wainscot_Beads(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/wainscot-beads?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_WAINSCOT_BEADS,
      data: data
    });
  };
}

export function get_Face_Frame_Designs(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/face-frame-designs?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_FACE_FRAME_DESIGNS,
      data: data
    });
  };
}

export function get_Face_Frame_Top_Rails(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/face-frame-top-rails?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_FACE_FRAME_TOP_RAILS,
      data: data
    });
  };
}


export function getFurnitureFeet(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/furniture-feets?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_FURNITURE_FEET,
      data: data
    });
  };
}

export function getOnePieceWoodtypes(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/woodtypes?one_piece=true?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_ONE_PIECE_WOODTYPES,
      data: data
    });
  };
}

export function getOnePieceDesigns(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/cope-designs?one_piece=true&_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_ONE_PIECE_DESIGNS,
      data: data
    });
  };
}

export function getOnePiecePanels(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/panels?one_piece=true&_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_ONE_PIECE_PANELS,
      data: data
    });
  };
}

export function getOnePieceEdges(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/edges?one_piece=true&_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_ONE_PIECE_EDGES,
      data: data
    });
  };
}


export function getBoxBottomThickness(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/box-bottom-thicknesses?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_BOX_BOTTOM_THICKNESS,
      data: data
    });
  };
}

export function getBoxFinishes(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/box-finishes?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_BOX_FINISH,
      data: data
    });
  };
}

export function getBoxNotches(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/box-notches?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_BOX_NOTCHES,
      data: data
    });
  };
}

export function getBoxThicknesses(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/box-thicknesses?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_BOX_THICKNESS,
      data: data
    });
  };
}

export function getBoxWoodtypes(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/box-woodtypes?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_BOX_WOODTYPES,
      data: data
    });
  };
}

export function getBoxBottomWoodtypes(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/box-bottom-woodtypes?_sort=Item:ASC`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: GET_BOX_BOTTOM_WOODTYPES,
      data: data
    });
  };
}



export function addProduct(product, url, cookie) {

  return async function (dispatch) {
    try {
      const { data } = await axios.post(`${db_url}/${url}`, product, {
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
      const { data } = await axios.put(`${db_url}/${url}/${orderId}`, product, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });

      // NotificationManager.success(`Product Updated!`, 'Order Updated!', 2000);
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
      const { data } = await axios.delete(`${db_url}/${product}/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });


      NotificationManager.success(`Product Deleted`, 'Product Deleted', 2000);
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
    })
    console.log(data)
    NotificationManager.success(`Breakdown Updated!`, 'Breakdown Updated!', 2000);
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
    })
    console.log(data)
    NotificationManager.success(`Pricing Updated!`, 'Pricing Updated!', 2000);
    return dispatch({
      type: UPDATE_PRICING,
      data: data
    });
  };
}

