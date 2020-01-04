import {
  GET_WOODTYPES,
  GET_DESIGNS,
  GET_EDGES,
  GET_FINISH,
  GET_GRADES,
  GET_MOULDS,
  GET_PANELS,
  GET_BOX_THICKNESS,
  GET_BOX_BOTTOMS,
  GET_ASSEMBLY,
  GET_NOTCH,
  GET_DOOR_EXTRAS,
  GET_HINGES,
  GET_DRAWER_FINISH,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  ADD_PRODUCT,
  UPLOAD_FILE,
  GET_PHOTO_ID
} from "./actions";

const initialState = {
  woodtypes: ["Loading"],
  designs: ["Loading"],
  edges: ["Loading"],
  moulds: ["Loading"],
  panels: ["Loading"],
  grades: ["Loading"],
  finish: ["Loading"],
  boxThickness: ["Loading"],
  boxBottoms: ["Loading"],
  assembly: ["Loading"],
  notchDrill: ["Loading"],
  drawerFinishes: ["Loading"],
  doorExtras: ["Loading"],
  hinges: ["Loading"],
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
  loadedDesign: false,
  loadedEdge: false,
  loadedMould: false,
  loadedPanel: false,
  loadedGrade: false,
  loadedFinish: false,
  loadedBoxThickness: false,
  loadedBoxBottoms: false,
  loadedAssembly: false,
  loadedNotch: false,
  loadedDoorExtras: false,
  loadedHinges: false,
  loadedDrawerFinishes: false,

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
    case GET_DESIGNS:
      return {
        ...state,
        designs: data,
        loadedDesign: true
      };
    case GET_EDGES:
      return {
        ...state,
        edges: data,
        loadedEdge: true
      };
    case GET_MOULDS:
      return {
        ...state,
        moulds: data,
        loadedMould: true
      };
    case GET_PANELS:
      return {
        ...state,
        panels: data,
        loadedPanel: true
      };
    case GET_GRADES:
      return {
        ...state,
        grades: data,
        loadedGrade: true
      };
    case GET_FINISH:
      return {
        ...state,
        finish: data,
        loadedFinish: true
      };
    case GET_BOX_THICKNESS:
      return {
        ...state,
        boxThickness: data,
        loadedBoxThickness: true
      };
    case GET_BOX_BOTTOMS:
      return {
        ...state,
        boxBottoms: data,
        loadedBoxBottoms: true
      };
    case GET_ASSEMBLY:
      return {
        ...state,
        assembly: data,
        loadedAssembly: true
      };
    case GET_DRAWER_FINISH:
      return {
        ...state,
        drawerFinishes: data,
        loadedDrawerFinishes: true
      };
    case GET_NOTCH:
      return {
        ...state,
        notchDrill: data,
        loadedNotch: true
      };
    case GET_DOOR_EXTRAS:
      return {
        ...state,
        doorExtras: data,
        loadedDoorExtras: true
      };
    case GET_HINGES:
      return {
        ...state,
        hinges: data,
        loadedHinges: true
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
