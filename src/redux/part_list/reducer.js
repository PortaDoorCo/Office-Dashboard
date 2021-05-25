import {
  GET_PRICING,
  UPDATE_PRICING,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  ADD_PRODUCT,
  UPLOAD_FILE,
  GET_PHOTO_ID,
  GET_BREAKDOWNS,
  UPDATE_BREAKDOWNS,
  GET_BOX_BREAKDOWNS,
  GET_ALL_PRODUCTS,
  GET_SINGLE_PRODUCT,
  PRODUCT_ADDED,
  PRODUCT_DELETED, 
  PRODUCT_UPDATED
} from './actions';

import _ from 'lodash';

const initialState = {
  woodtypes: ['Loading'],
  applied_profiles: ['Loading'],
  designs:['Loading'],
  edge_slabs: ['Loading'],
  edges: ['Loading'],
  finish: ['Loading'],
  lites: ['Loading'],
  mouldings: ['Loading'],
  mouldings_lengths: ['Loading'],
  moulding_material: ['Loading'],
  panels: ['Loading'],
  profiles: ['Loading'],

  face_frame_designs: ['Loading'],
  face_frame_top_rail: ['Loading'],
  furniture_feet: ['Loading'],



  box_bottom_thickness: ['Loading'],
  box_finish: ['Loading'],
  box_assembly: ['Loading'],
  box_notch: ['Loading'],
  box_thickness: ['Loading'],
  box_woodtypes: ['Loading'],
  box_bottom_woodtypes: ['Loading'],
  box_scoop: ['Loading'],

  door_piece_number: ['Loading'],

  breakdowns: [],
  box_breakdowns: [],

  pricing: [],
  itemPricing: [],

  scoop: [
    {
      Name: 'No',
    },
    {
      Name: 'Yes',
    },
  ],
  dividers: [
    {
      Name: 'None',
    },
    {
      Name: '1',
    },
    {
      Name: '2',
    },
  ],
  construction: [
    {
      name: 'Cope And Stick',
      value: 'Cope',
    },
    {
      name: 'Mitered Construction',
      value: 'Miter',
    },
    {
      name: 'MT Construction',
      value: 'MT',
    },
  ],
  orderType: [
    {
      name: 'Door Order',
      value: 'Door',
    },
    {
      name: 'Drawer Order',
      value: 'DF',
    },
    {
      name: 'One Piece',
      value: 'One_Piece',
    },
    {
      name: 'Two Piece',
      value: 'Two_Piece',
    },
  ],
  thickness: [
    {
      name: '4/4',
      value: 0.75,
    },
    {
      name: '5/4',
      value: 1,
    },
  ],
  
  loadedProducts: false,
  loadedBreakdowns: false,
  loadedBoxBreakdowns: false,
  loadedPricing: false,
  error: null,
  productUrl: '',
  file: [],
  photoId: '',
};

export default function (state = initialState, action) {
  const { type, data, product } = action;
  switch (type) {
    case GET_ALL_PRODUCTS:
      return {
        ...state,
        ...data,
        loadedProducts: true,
      };
    case GET_SINGLE_PRODUCT:
      return {
        ...state,
        [_.snakeCase(product)]: state[_.snakeCase(product)].map((i) =>
          i.id === data.id ? data : i
        ),
      };
    case PRODUCT_UPDATED:
      return {
        ...state,
        [_.snakeCase(product)]: state[_.snakeCase(product)].map((i) =>
          i.id === data.id ? data : i
        ),
      };
    case PRODUCT_ADDED:
      return {
        ...state,
        [_.snakeCase(product)]: [...state[_.snakeCase(product)], data],
      };
    case PRODUCT_DELETED:     
      return {
        ...state,
        [_.snakeCase(data.product)]: state[_.snakeCase(data.product)].filter(item => item.id !== data.id),
      };
    case ADD_PRODUCT:
      return {
        ...state,
        // designs: state.designs.map(item => {
        //   return item.Item === data.Item ? data : item;
        // })
      };
    case DELETE_PRODUCT:
      // const p = `state.${product}.filter(item => item.id !== id)`
      // const q = eval(p)
      return {
        ...state,
        // [product]: q
      };
    case UPDATE_PRODUCT:
      return {
        ...state,
      };
    case UPLOAD_FILE:
      return {
        ...state,
        file: data,
      };
    case GET_PHOTO_ID:
      return {
        ...state,
        photoId: data,
      };
    case GET_BREAKDOWNS:
      return {
        ...state,
        breakdowns: data,
        loadedBreakdowns: true,
      };
    case GET_BOX_BREAKDOWNS:
      return {
        ...state,
        box_breakdowns: data,
        loadedBoxBreakdowns: true,
      };
    case UPDATE_BREAKDOWNS:
      return {
        ...state,
        breakdowns: state.breakdowns.map((i) => (i.id === data.id ? data : i)),
      };

    case GET_PRICING:
      return {
        ...state,
        pricing: data,
        loadedPricing: true,
      };
    case UPDATE_PRICING:
      return {
        ...state,
        pricing: state.pricing.map((i) => (i.id === data.id ? data : i)),
      };
    default:
      return state;
  }
}
