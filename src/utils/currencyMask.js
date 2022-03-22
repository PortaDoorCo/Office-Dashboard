import { createNumberMask } from 'redux-form-input-masks';

const currencyMask = createNumberMask({
  decimalPlaces: 2,
  locale: 'en-US',
  allowNegative: true,
});

export default currencyMask;
