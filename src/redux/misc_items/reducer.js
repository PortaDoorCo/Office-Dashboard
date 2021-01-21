import {
  SELECT_DATE_RANGE,
  LOAD_SHIPPING_METHODS,
  LOAD_PAYMENT_TERMS,
  LOAD_PAYMENT_TYPES,
  LOAD_MISC_ITEMS,
  UPDATE_MISC_ITEMS,
  DELETE_MISC_ITEM,
  ADD_MISC_ITEM,
  MISC_ITEM_ADDED,
  MISC_ITEM_DELETED,
  MISC_ITEM_UPDATED
} from './actions';

const initialState = {
  misc_items: [],
  selectedDateRange: 'day',
  shippingMethods: [],
  paymentTypes: [],
  paymentTerms: [],
  loadedPaymentTypes: false,
  loadedPaymentTerms: false,
  loadedShippingMethods: false,
  loadedMiscItems: false
};

export default function (state = initialState, action) {
  const { type, data, date } = action;
  switch (type) {
    case LOAD_MISC_ITEMS:
      return {
        ...state,
        misc_items: data,
        loadedMiscItems: true
      };
    case LOAD_PAYMENT_TERMS:
      return {
        ...state,
        paymentTerms: data,
        loadedPaymentTerms: true
      };
    case LOAD_PAYMENT_TYPES:
      return {
        ...state,
        paymentTypes: data,
        loadedPaymentTypes: true
      };
    case SELECT_DATE_RANGE:
      return {
        ...state,
        selectedDateRange: date
      };
    case ADD_MISC_ITEM:
      return {
        ...state,
      };
    case UPDATE_MISC_ITEMS:
      return {
        ...state,
      };
    case DELETE_MISC_ITEM:
      return {
        ...state,
      };
    case LOAD_SHIPPING_METHODS:
      return {
        ...state,
        shippingMethods: data,
        loadedShippingMethods: true
      };
    case MISC_ITEM_UPDATED:
      return {
        ...state,
        misc_items: state.misc_items.map((i) => {
          console.log({i});
          console.log({data});
          return i.id === data.id ? data : i;
        }

        ),
      };
    case MISC_ITEM_ADDED:
      return {
        ...state,
        misc_items: [...state.misc_items, data],
      };
    case MISC_ITEM_DELETED:     
      return {
        ...state,
        misc_items: state.misc_items.filter(item => item.id !== data.id),
      };
    default:
      return {
        ...state,
      };
  }
}
