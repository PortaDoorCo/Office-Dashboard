import Ratio from 'lb-ratio';
import frac2dec from '../../../frac2dec';
import numQty from 'numeric-quantity';

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};


export default (info, part, breakdowns) => {

  const door = [
    {
      qty: '',
      measurement: '',
      pattern: '',
      width: 0,
      height: 0,
      panel: ''
    },
  ];



  return door;
};