import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';
import frac2dec from '../../../frac2dec';


const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};


export default (info, part, breakdowns) => {
  const vMidRail = info.verticalMidRailSize ? info.verticalMidRailSize : 0;
  const hMidRail = info.horizontalMidRailSize ? info.horizontalMidRailSize : 0;
  
  const top_rail_arch = part?.design?.TOP_RAIL_ADD;
  const btm_rail_arch = part?.design?.BTM_RAIL_ADD;

  let edge_factor = part?.edge?.LIP_FACTOR ? part?.edge?.LIP_FACTOR : 0;
  let lip_factor = part?.edge?.LIP_FACTOR ? part?.edge?.LIP_FACTOR : 0;

  const topRail = info.topRail
    ? Math.round(numQty(info.topRail) * 16) / 16 + lip_factor / 2
    : 0;
  const bottomRail = info.bottomRail
    ? Math.round(numQty(info.bottomRail) * 16) / 16 + lip_factor / 2
    : 0;
  const leftStile = info.leftStile
    ? Math.round(numQty(info.leftStile) * 16) / 16 + lip_factor / 2
    : 0;
  const rightStile = info.rightStile
    ? Math.round(numQty(info.rightStile) * 16) / 16 + lip_factor / 2
    : 0;
  const vertMull = Math.round(numQty(vMidRail) * 16) / 16;
  const horizMull = Math.round(numQty(hMidRail) * 16) / 16;
  const panelsH = parseInt(info.panelsH);
  const panelsW = parseInt(info.panelsW);
  const height = Math.round(numQty(info.height) * 16) / 16;
  const width = Math.round(numQty(info.width) * 16) / 16;
  const qty = parseInt(info.qty);
  const item = parseInt(info.item);


  
  let inset = 0;
  if (part.profile) {
    inset = part.profile?.INSET;
  } else {
    inset = part.design?.INSET;
  }
  
  if (eval(breakdowns.leftStile_width) === eval(breakdowns.rightStile_width)) {
    if (((panelsW > 1) && (panelsH > 1)) || ((panelsW > 1) && (panelsH === 1))) {
      return [
        {
          door_qty: qty,
          qty: `(${(qty * 2)})`,
          qty_2: qty * 2,
          measurement: `${fraction(
            eval(breakdowns.leftStile_width)
          )} x ${fraction(eval(breakdowns.leftStile_height))}`,
          pattern: 'LR',
          razor_pattern: 'L / R',
          width: eval(breakdowns.leftStile_width),
          height: eval(breakdowns.leftStile_height),
          multiplier: 2,
          item: item,
        },
        {
          door_qty: qty,
          qty: `(${(panelsW > 1 ? (panelsH > 1 ? panelsH : panelsW - 1) : panelsW - 1)})`,
          qty_2: (panelsW > 1 ? (panelsH > 1 ? panelsH : panelsW - 1) : panelsW - 1),
          measurement: `${fraction(eval(breakdowns.vertical_mid_rail_width))} x ${fraction(
            Math.round(
              eval(breakdowns.vertical_mid_rail_height) * 16) / 16
          )}`,
          width: eval(breakdowns.vertical_mid_rail_width),
          height: eval(breakdowns.vertical_mid_rail_height),
          pattern: 'VM',
          razor_pattern: 'V Mull',
          multiplier: (panelsW > 1 ? (panelsH > 1 ? panelsH : panelsW - 1) : panelsW - 1),
          item: item,
        },
      ];
    } else {
      return [
        {
          door_qty: qty,
          qty: `(${(qty * 2)})`,
          qty_2: qty * 2,
          measurement: `${fraction(
            eval(breakdowns.leftStile_width)
          )} x ${fraction(eval(breakdowns.leftStile_height))}`,
          pattern: 'LR',
          razor_pattern: 'L / R',
          width: eval(breakdowns.leftStile_width),
          height: eval(breakdowns.leftStile_height),
          multiplier: 2,
          item: item,
        }
      ];
    }
  }
  else {
    if (((panelsW > 1) && (panelsH > 1)) || ((panelsW > 1) && (panelsH === 1))) {
      return [
        {
          door_qty: qty,
          qty: `(${(qty)})`,
          qty_2: qty,
          measurement: `${fraction(
            eval(breakdowns.leftStile_width)
          )} x ${fraction(eval(breakdowns.leftStile_height))}`,
          pattern: 'L',
          razor_pattern: 'L',
          width:eval(breakdowns.leftStile_width),
          height: eval(breakdowns.leftStile_height),
          multiplier: 1,
          item: item,
        },
        {
          door_qty: qty,
          qty: `(${(qty)})`,
          qty_2: qty,
          measurement: `${fraction(
            eval(breakdowns.rightStile_width)
          )} x ${fraction(eval(breakdowns.rightStile_height))}`,
          pattern: 'R',
          razor_pattern: 'R',
          width:eval(breakdowns.rightStile_width),
          height: eval(breakdowns.rightStile_height),
          multiplier: 1,
          item: item,
        },
        {
          door_qty: qty,
          qty: `(${(panelsW > 1 ? (panelsH > 1 ? panelsH : panelsW - 1) : panelsW - 1)})`,
          qty_2: (panelsW > 1 ? (panelsH > 1 ? panelsH : panelsW - 1) : panelsW - 1),
          measurement: `${fraction(eval(breakdowns.vertical_mid_rail_width))} x ${fraction(
            Math.round(
              eval(breakdowns.vertical_mid_rail_height) * 16) / 16
          )}`,
          pattern: 'VM',
          razor_pattern: 'V Mull',
          width: eval(breakdowns.vertical_mid_rail_width),
          height: eval(breakdowns.vertical_mid_rail_height),
          multiplier: (panelsW > 1 ? (panelsH > 1 ? panelsH : panelsW - 1) : panelsW - 1),
          item: item,
        },
      ];
    }
    else {
      return [
        {
          door_qty: qty,
          qty: `(${(qty)})`,
          qty_2: qty,
          measurement: `${fraction(
            eval(breakdowns.leftStile_width)
          )} x ${fraction(eval(breakdowns.leftStile_height))}`,
          pattern: 'L',
          razor_pattern: 'L',
          width: eval(breakdowns.leftStile_width),
          height: eval(breakdowns.leftStile_height),
          multiplier: 1,
          item: item,
        },
        {
          door_qty: qty,
          qty: `(${(qty)})`,
          qty_2: qty,
          measurement: `${fraction(
            eval(breakdowns.rightStile_width)
          )} x ${fraction(eval(breakdowns.rightStile_height))}`,
          pattern: 'R',
          razor_pattern: 'R',
          width: eval(breakdowns.rightStile_width),
          height: eval(breakdowns.rightStile_height),
          multiplier: 1,
          item: item,
        }

      ];
    }
  }
};
