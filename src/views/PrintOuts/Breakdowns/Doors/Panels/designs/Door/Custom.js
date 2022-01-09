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

  const panelName = info?.panel?.NAME ? info?.panel?.NAME : part?.panel?.NAME;
  const panelFlat = info?.panel?.Flat ? info?.panel?.Flat : part?.panel?.Flat;



  return [
    {
      qty: `(${qty})`,
      measurement: '22 x 22',
      pattern: panelFlat ? 'PF' : 'PR',
      width: 22,
      height: 22,
      panel: panelName,
      count: qty,
      multiplier: qty,
    },
  ];

};
