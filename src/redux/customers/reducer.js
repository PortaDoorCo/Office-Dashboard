import {
  LOAD_CUSTOMERS,
  UPDATE_CUSTOMER,
  SET_SELECTED_COMPANY
} from './actions';

const initialState = {
  customerDB: ['LOADING'],
  customer: [],
  customerDBLoaded: false,
  selectedCompanies: null
};

export default function (state = initialState, action) {
  const { type, data } = action;
  switch (type) {

    case LOAD_CUSTOMERS:
      return {
        ...state,
        customerDB: data,
        customerDBLoaded: true
      };
    case SET_SELECTED_COMPANY:
      return {
        ...state,
        selectedCompanies: data
      };
    case UPDATE_CUSTOMER:
      return {
        ...state,
        customerDB: state.customerDB.map((item, index) => {
          if (item.id !== data.id) {
            // This isn't the item we care about - keep it as-is
            return item;
          }

          // Otherwise, this is the one we want - return an updated value
          return {
            ...data
          };
        })
      };
    default:
      return {
        ...state,

      };
  }
}
