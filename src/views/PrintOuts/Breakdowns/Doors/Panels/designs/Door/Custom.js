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

  console.log({info});

  return info.Panels?.map(i => {
    return     {
      qty: `(${i.qty})`,
      measurement: `${i.width} x ${i.height}`,
      pattern: panelFlat ? 'PF' : 'PR',
      width: Math.round(numQty(i.width) * 16) / 16,
      height: Math.round(numQty(i.height) * 16) / 16,
      panel: panelName,
      count: parseInt(i.qty),
      multiplier: parseInt(i.qty),
    }
  })



};
