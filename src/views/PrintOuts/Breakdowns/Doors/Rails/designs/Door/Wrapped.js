import Ratio from 'lb-ratio';
import frac2dec from '../../../frac2dec';
import numQty from 'numeric-quantity';
import _ from 'lodash';

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part, breakdowns) => {
  const vMidRail = info.verticalMidRailSize ? info.verticalMidRailSize : 0;
  const hMidRail = info.horizontalMidRailSize ? info.horizontalMidRailSize : 0;

  let edge_factor = 0.125;
  let lip_factor = 0.125;

  const topRail = part.wrap_width
    ? Math.round(numQty(part.wrap_width) * 16) / 16 + lip_factor / 2
    : 0;
  const bottomRail = part.wrap_width
    ? Math.round(numQty(part.wrap_width) * 16) / 16 + lip_factor / 2
    : 0;
  const leftStile = 0;
  const rightStile = 0;
  const vertMull = Math.round(numQty(vMidRail) * 16) / 16;
  const horizMull = Math.round(numQty(hMidRail) * 16) / 16;
  const panelsH = parseInt(info.panelsH);
  const panelsW = parseInt(info.panelsW);
  const height = Math.round(numQty(info.height) * 16) / 16;
  const width = Math.round(numQty(info.width) * 16) / 16;
  const qty = parseInt(info.qty);
  const item = parseInt(info.item);

  let inset = 0;

  const unequalMidRails = info[`unequalMidRails`];

  console.log({ info });

  return [
    {
      qty: '',
      qty_2: qty * 2,
      measurement: '',
      pattern: '',
      razor_pattern: '',
      width: topRail,
      height: eval(breakdowns.topRail_height),
      multiplier: 2,
      item: item,
    },
  ];
};
