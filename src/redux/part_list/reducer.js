import {
  GET_WOODTYPES,
  GET_APPLIED_MOULDS,
  GET_BASE_CAP,
  GET_BASEBOARDS,
  GET_CASINGS,
  GET_CHAIR_RAILS,
  GET_COPE_DESIGNS,
  GET_CROWN_MOULDINGS,
  GET_EDGE_SLABS,
  GET_EDGES,
  GET_FINISH,
  GET_LITES,
  GET_MITER_DF_DESIGNS,
  GET_MITER_DESIGNS,
  GET_MOULDINGS_LENGTHS,
  GET_MT_DESIGNS,
  GET_MT_DF_DESIGNS,
  GET_PANELS,
  GET_PLYNTHS_STOOLS,
  GET_PROFILES,
  GET_SOLID_CROWNS,
  GET_WAINSCOT_BEADS,


  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  ADD_PRODUCT,
  UPLOAD_FILE,
  GET_PHOTO_ID,
  GET_DOOR_OPTIONS
} from "./actions";

const initialState = {
  woodtypes: ["Loading"],
  applied_moulds: ["Loading"],
  base_caps: ["Loading"],
  baseboards: ["Loading"],
  casings: ["Loading"],
  chair_rails: ["Loading"],
  cope_designs: ["Loading"],
  crown_mouldings: ["Loading"],
  edge_slabs: ["Loading"],
  edges: ["Loading"],
  finishes: ["Loading"],
  lites: ["Loading"],
  miter_DF_designs: ["Loading"],
  miter_designs: ["Loading"],
  mouldings_lengths: ["Loading"],
  mt_designs: ["Loading"],
  mt_DF_designs: ["Loading"],
  panels: ["Loading"],
  plynths_stools: ["Loading"],
  profiles: ["Loading"],
  solid_crowns: ["Loading"],
  wainscot_beads: ["Loading"],


  scoop: [
    {
      Name: "No",
    },
    {
      Name: "Yes"
    }
  ],
  dividers: [
    {
      Name: "None",
    },
    {
      Name: "1"
    },
    {
      Name: "2"
    }
  ],
  construction: [
    {
      name: "Cope And Stick",
      value: "Cope"
    },
    {
      name: "Mitered Construction",
      value: "M"
    },
    {
      name: "MT Construction",
      value: "MT"
    }
  ],
  orderType: [
    {
      name: "Door Order",
      value: "Door"
    },
    {
      name: "Drawer Order",
      value: "DF"
    }
  ],
  thickness: [
    {
      name: "4/4",
      value: 0.75
    },
    {
      name: "5/4",
      value: 1
    }
  ],

  loadedWoodtype: false,
  loadedAppliedMoulds: false,
  loadedBaseCaps: false,
  loadedBaseboards: false,
  loadedCasings: false,
  loadedChairRails: false,
  loadedCopeDesigns: false,
  loadedCrownMouldings: false,
  loadedEdgeSlabs: false,
  loadedEdges: false,
  loadedFinishes: false,
  loadedLites: false,
  loadedMiter_DF_Designs: false,
  loadedMiterDesigns: false,
  loadedMouldingsLengths: false,
  loaded_MT_Designs: false,
  loaded_MT_DF_Designs: false,
  loadedOrders: false,
  loadedPanels: false,
  loaded_Plynths_Stools: false,
  loadedProfiles: false,
  loadedSolidCrowns: false,
  loadedWainscotBeads: false,


  error: null,

  productUrl: '',
  file: [],
  photoId: ''

};

export default function (state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case GET_WOODTYPES:
      return {
        ...state,
        woodtypes: data,
        loadedWoodtype: true
      };
    case GET_APPLIED_MOULDS:
      return {
        ...state,
        applied_moulds: data,
        loadedAppliedMoulds: true
      };
    case GET_BASE_CAP:
      return {
        ...state,
        base_caps: data,
        loadedBaseCaps: true
      };
    case GET_BASEBOARDS:
      return {
        ...state,
        baseboards: data,
        loadedBaseboards: true
      };
    case GET_CASINGS:
      return {
        ...state,
        casings: data,
        loadedCasings: true
      };
    case GET_CHAIR_RAILS:
      return {
        ...state,
        chair_rails: data,
        loadedChairRails: true
      };
    case GET_COPE_DESIGNS:
      return {
        ...state,
        cope_designs: data,
        loadedCopeDesigns: true
      };
    case GET_CROWN_MOULDINGS:
      return {
        ...state,
        crown_mouldings: data,
        loadedCrownMouldings: true
      };
    case GET_EDGE_SLABS:
      return {
        ...state,
        edge_slabs: data,
        loadedEdgeSlabs: true
      };
    case GET_EDGES:
      return {
        ...state,
        edges: data,
        loadedEdges: true
      };
    case GET_FINISH:
      return {
        ...state,
        finishes: data,
        loadedFinishes: true
      };
    case GET_LITES:
      return {
        ...state,
        lites: data,
        loadedLites: true
      };
    case GET_MITER_DF_DESIGNS:
      return {
        ...state,
        miter_DF_designs: data,
        loadedMiter_DF_Designs: true
      };
    case GET_MITER_DESIGNS:
      return {
        ...state,
        miter_designs: data,
        loadedMiterDesigns: true
      };
    case GET_MOULDINGS_LENGTHS:
      return {
        ...state,
        mouldings_lengths: data,
        loadedMouldingsLengths: true
      };
    case GET_MT_DESIGNS:
      return {
        ...state,
        mt_designs: data,
        loaded_MT_Designs: true
      };
    case GET_MT_DF_DESIGNS:
      return {
        ...state,
        mt_DF_designs: data,
        loaded_MT_Designs: true
      };
    case GET_PANELS:
      return {
        ...state,
        panels: data,
        loadedPanels: true
      };
    case GET_PLYNTHS_STOOLS:
      return {
        ...state,
        plynths_stools: data,
        loaded_Plynths_Stools: true
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: data,
        loadedProfiles: true
      };
    case GET_SOLID_CROWNS:
      return {
        ...state,
        solid_crowns: data,
        loadedSolidCrowns: true
      };
    case GET_WAINSCOT_BEADS:
      return {
        ...state,
        wainscot_beads: data,
        loadedWainscotBeads: true
      };














    case ADD_PRODUCT:
      return {
        ...state,
        // designs: state.designs.map(item => {
        //   return item.Item === data.Item ? data : item;
        // })
      }
    case DELETE_PRODUCT:
      return {
        ...state,
        designs: state.designs.filter(item => item.id !== data.id)
      }
    case UPDATE_PRODUCT:
      return {
        ...state,
      }
    case UPLOAD_FILE:
      return {
        ...state,
        file: data
      }
    case GET_PHOTO_ID:
      return {
        ...state,
        photoId: data
      }
    default:
      return state;
  }
}
