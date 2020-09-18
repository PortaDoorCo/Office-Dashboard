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
} from './actions';

const initialState = {
  woodtypes: ['Loading'],
  applied_moulds: ['Loading'],
  base_caps: ['Loading'],
  baseboards: ['Loading'],
  casings: ['Loading'],
  chair_rails: ['Loading'],
  cope_designs: ['Loading'],
  crown_mouldings: ['Loading'],
  edge_slabs: ['Loading'],
  edges: ['Loading'],
  finishes: ['Loading'],
  lites: ['Loading'],
  miter_DF_designs: ['Loading'],
  miter_designs: ['Loading'],
  mouldings_lengths: ['Loading'],
  mt_designs: ['Loading'],
  mt_DF_designs: ['Loading'],
  panels: ['Loading'],
  plynths_stools: ['Loading'],
  profiles: ['Loading'],
  solid_crowns: ['Loading'],
  wainscot_beads: ['Loading'],
  face_frame_designs: ['Loading'],
  face_frame_top_rails: ['Loading'],
  furniture_feets: ['Loading'],
  one_piece_woodtypes: ['Loading'],
  one_piece_designs: ['Loading'],
  one_piece_panels: ['Loading'],
  one_piece_edges: ['Loading'],

  box_bottom_thickness: ['Loading'],
  box_finish: ['Loading'],
  box_notches: ['Loading'],
  box_thickness: ['Loading'],
  box_woodtypes: ['Loading'],
  box_bottom_woodtypes: ['Loading'],
  box_scoops: ['Loading'],

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
      value: 'M',
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

      console.log('reducer data', data);
      // console.log('reducer product', product);
      console.log({[product]: state[product].map((i) => (i.id === data.id ? data : i))}); 

      return {
        ...state,
        [product]: state[product].map((i) => (i.id === data.id ? data : i))
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
