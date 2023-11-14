import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';
// import frac2dec from '../frac2dec'

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info) => {
  const height = numQty(info.height);
  const width = numQty(info.width);
  const qty = parseInt(info.qty);

  const door = [
    {
      qty: ``,
      measurement: 'OP',
      pattern: '',
      width: 0,
      height: 0,
      panel: '',
      count: qty,
      multiplier: qty,
    },
  ];

  return door;
};
