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
  GET_FACE_FRAME_DESIGNS,
  GET_FACE_FRAME_TOP_RAILS,
  GET_FURNITURE_FEET,
  GET_ONE_PIECE_WOODTYPES,
  GET_ONE_PIECE_DESIGNS,
  GET_ONE_PIECE_PANELS,
  GET_ONE_PIECE_EDGES,

  GET_BOX_BOTTOM_THICKNESS,
  GET_BOX_FINISH,
  GET_BOX_NOTCHES,
  GET_BOX_THICKNESS,
  GET_BOX_WOODTYPES,

  GET_PRICING,
  UPDATE_PRICING,


  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  ADD_PRODUCT,
  UPLOAD_FILE,
  GET_PHOTO_ID,
  GET_DOOR_OPTIONS,
  GET_BREAKDOWNS,
  UPDATE_BREAKDOWNS,
  GET_BOX_BREAKDOWNS,
  GET_BOX_BOTTOM_WOODTYPES
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
  face_frame_designs: ["Loading"],
  face_frame_top_rails: ["Loading"],
  furniture_feets: ["Loading"],
  one_piece_woodtypes: ["Loading"],
  one_piece_designs: ["Loading"],
  one_piece_panels: ["Loading"],
  one_piece_edges: ["Loading"],

  box_bottom_thickness: ["Loading"],
  box_finish: ["Loading"],
  box_notches: ["Loading"],
  box_thickness: ["Loading"],
  box_woodtypes: ["Loading"],
  box_bottom_woodtypes: ["Loading"],

  breakdowns: [],
  box_breakdowns: [],

  pricing: [],

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
  loadedFaceFrameDesigns: false,
  loadedFaceFrameTopRails: false,
  loadedFurnitureFeets: false,
  loadedOnePieceWoodtypes: false,
  loadedOnePieceDesigns: false,
  loadedOnePiecePanels: false,
  loadedOnePieceEdges: false,

  loadedBoxBottomThickness: false,
  loadedBoxFinish: false,
  loadedBoxNotches: false,
  loadedBoxThickness: false,
  loadedBoxWoodtypes: false,
  loadedBoxBottomWoodtypes: false,

  loadedBreakdowns: false,

  error: null,

  productUrl: '',
  file: [],
  photoId: ''

};

export default function (state = initialState, action) {
  const { type, data, product, id } = action;
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
    case GET_FACE_FRAME_DESIGNS:
      return {
        ...state,
        face_frame_designs: data,
        loadedFaceFrameDesigns: true
      };
    case GET_FACE_FRAME_TOP_RAILS:
      return {
        ...state,
        face_frame_top_rails: data,
        loadedFaceFrameTopRails: true
      };
    case GET_FURNITURE_FEET:
      return {
        ...state,
        furniture_feets: data,
        loadedFurnitureFeets: true
      };

    case GET_ONE_PIECE_WOODTYPES:
      return {
        ...state,
        one_piece_woodtypes: data,
        loadedOnePieceWoodtypes: true
      };
    case GET_ONE_PIECE_DESIGNS:
      return {
        ...state,
        one_piece_designs: data,
        loadedOnePieceDesigns: true
      };
    case GET_ONE_PIECE_PANELS:
      return {
        ...state,
        one_piece_panels: data,
        loadedOnePiecePanels: true
      };
    case GET_ONE_PIECE_EDGES:
      return {
        ...state,
        one_piece_edges: data,
        loadedOnePieceEdges: true
      };


    case GET_BOX_BOTTOM_THICKNESS:
      return {
        ...state,
        box_bottom_thickness: data,
        loadedBoxBottomThickness: true
      };
    case GET_BOX_FINISH:
      return {
        ...state,
        box_finish: data,
        loadedBoxFinish: true
      };
    case GET_BOX_NOTCHES:
      return {
        ...state,
        box_notches: data,
        loadedBoxNotches: true
      };
    case GET_BOX_THICKNESS:
      return {
        ...state,
        box_thickness: data,
        loadedBoxThickness: true
      };
    case GET_BOX_WOODTYPES:
      return {
        ...state,
        box_woodtypes: data,
        loadedBoxWoodtypes: true
      };
    case GET_BOX_BOTTOM_WOODTYPES:
      return {
        ...state,
        box_bottom_woodtypes: data,
        loadedBoxBottomWoodtypes: true
      };














    case ADD_PRODUCT:
      return {
        ...state,
        // designs: state.designs.map(item => {
        //   return item.Item === data.Item ? data : item;
        // })
      }
    case DELETE_PRODUCT:
      // const p = `state.${product}.filter(item => item.id !== id)`
      // const q = eval(p)
      return {
        ...state,
        // [product]: q
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
    case GET_BREAKDOWNS:
      return {
        ...state,
        breakdowns: data
      }
    case GET_BOX_BREAKDOWNS:
      return {
        ...state,
        box_breakdowns: data
      }
    case UPDATE_BREAKDOWNS:
      return {
        ...state,
        breakdowns: state.breakdowns.map(i => i.id === data.id ?
          data : i
        )
      }

    case GET_PRICING:
      return {
        ...state,
        pricing: data
      }
    case UPDATE_PRICING:
      return {
        ...state,
        pricing: state.pricing.map(i => i.id === data.id ?
          data : i
        )
      }
    default:
      return state;
  }
}
