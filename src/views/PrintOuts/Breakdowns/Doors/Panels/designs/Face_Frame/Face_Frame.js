import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';
// import frac2dec from '../frac2dec'



export default (info, part, breakdowns) => {
  const lites = part.lite ? part.lite.NAME : '';
  const none = [
    {
      qty: '',
      measurement: 'GLASS',
      pattern: '',
      width: 0,
      height: 0
    },
  ];
  return none;
};
