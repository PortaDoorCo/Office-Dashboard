import {
  SELECT_DATE_RANGE,
  LOAD_SHIPPING_METHODS,
  LOAD_PAYMENT_TERMS,
  LOAD_PAYMENT_TYPES
} from './actions';

const initialState = {
  selectedDateRange: 'day',
  shippingMethods: [],
  paymentTypes: [],
  paymentTerms: [],
  loadedPaymentTypes: false,
  loadedPaymentTerms: false,
  loadedShippingMethods: false,
};

export default function (state = initialState, action) {
  const { type, data, date } = action;
  switch (type) {
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
    case LOAD_SHIPPING_METHODS:
      return {
        ...state,
        shippingMethods: data,
        loadedShippingMethods: true
      };
    default:
      return {
        ...state,
      };
  }
}
