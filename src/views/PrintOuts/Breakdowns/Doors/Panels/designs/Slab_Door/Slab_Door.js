import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';
// import frac2dec from '../frac2dec'

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part) => {
  const height = numQty(info.height);
  const width = numQty(info.width);
  const qty = parseInt(info.qty);
  const edge_factor = part?.edge?.LIP_FACTOR ? part?.edge?.LIP_FACTOR : 0;

  const door = [
    {
      qty: `(${qty})`,
      measurement: `${fraction(Math.round((width + edge_factor) * 16) / 16)} x ${fraction(
        Math.round((height + edge_factor) * 16) / 16
      )}`,
      pattern: 'SP',
      width: 0,
      height: 0,
      panel: 'SOLID PIECE',
      count: qty,
      multiplier: qty,
    },
  ];

  return door;
};
