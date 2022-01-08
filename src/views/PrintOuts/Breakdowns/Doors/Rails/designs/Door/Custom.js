import Ratio from 'lb-ratio';
import frac2dec from '../../../frac2dec';
import numQty from 'numeric-quantity';

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part) => {

  const qty = parseInt(info.qty);
  const item = parseInt(info.item);

  console.log({info});
  console.log({part});

  return [
    {
      qty: `(${qty * 2})`,
      qty_2: qty * 2,
      measurement: '44 x 44',
      pattern: 'TB',
      razor_pattern: 'T / B',
      width: 44,
      height: 44,
      multiplier: 2,
      item: item,
    },
  ];

};
