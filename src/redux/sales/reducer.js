import {
  LOAD_SALES,
} from './actions';

const initialState = {
  salesReps: [],
  loadedSales: false
};

export default function (state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case LOAD_SALES:
      return {
        ...state,
        salesReps: data,
        loadedSales: true
      };
    default:
      return {
        ...state,
      };
  }
}
