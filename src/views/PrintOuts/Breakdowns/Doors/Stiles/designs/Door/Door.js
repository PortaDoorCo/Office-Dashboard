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

  const lip_factor = part?.edge?.LIP_FACTOR ? part?.edge?.LIP_FACTOR : 0;
  
  const topRail = info.topRail
    ? numQty(info.topRail) + lip_factor / 2
    : 0;
  const bottomRail = info.bottomRail
    ? numQty(info.bottomRail) + lip_factor / 2
    : 0;
  const leftStile = info.leftStile
    ? numQty(info.leftStile) + lip_factor / 2
    : 0;
  const rightStile = info.rightStile
    ? numQty(info.rightStile) + lip_factor / 2
    : 0;
  const vertMull = numQty(vMidRail);
  const horizMull = numQty(hMidRail);
  const panelsH = parseInt(info.panelsH);
  const panelsW = parseInt(info.panelsW);
  const height = numQty(info.height);
  const width = numQty(info.width);
  const qty = parseInt(info.qty);
  const edge_factor = part.edge?.LIP_FACTOR;
  
  let inset = 0;
  if (part.profile) {
    inset = part.profile?.INSET;
  } else {
    inset = part.design?.INSET;
  }
  
  if (eval(breakdowns.leftStile_width) === eval(breakdowns.rightStile_width)) {
    if (((panelsW > 1) && (panelsH > 1)) || ((panelsW > 1) && (panelsH == 1))) {
      return [
        {
          qty: `(${(qty * 2)})`,
          measurement: `${fraction(
            eval(breakdowns.leftStile_width)
          )} x ${fraction(eval(breakdowns.leftStile_height))}`,
          pattern: 'LR',
          width: eval(breakdowns.leftStile_width),
          height: eval(breakdowns.leftStile_width),
          multiplier: 2
        },
        {
          qty: `(${(panelsW > 1 ? (panelsH > 1 ? panelsH : panelsW - 1) : panelsW - 1)})`,
          measurement: `${fraction(eval(breakdowns.vertical_mid_rail_width))} x ${fraction(
            Math.round(
              eval(breakdowns.vertical_mid_rail_height) * 16) / 16
          )}`,
          width: eval(breakdowns.vertical_mid_rail_width),
          height: eval(breakdowns.vertical_mid_rail_height),
          pattern: 'VM',
          multiplier: (panelsW > 1 ? (panelsH > 1 ? panelsH : panelsW - 1) : panelsW - 1)
        },
      ];
    } else {
      return [
        {
          qty: `(${(qty * 2)})`,
          measurement: `${fraction(
            eval(breakdowns.leftStile_width)
          )} x ${fraction(eval(breakdowns.leftStile_height))}`,
          pattern: 'LR',
          width: eval(breakdowns.leftStile_width),
          height: eval(breakdowns.leftStile_height),
          multiplier: 2
        }
      ];
    }
  }
  else {
    if (((panelsW > 1) && (panelsH > 1)) || ((panelsW > 1) && (panelsH == 1))) {
      return [
        {
          qty: `(${(qty)})`,
          measurement: `${fraction(
            eval(breakdowns.leftStile_width)
          )} x ${fraction(eval(breakdowns.leftStile_height))}`,
          pattern: 'L',
          width:eval(breakdowns.leftStile_width),
          height: eval(breakdowns.leftStile_height),
          multiplier: 1
        },
        {
          qty: `(${(qty)})`,
          measurement: `${fraction(
            eval(breakdowns.rightStile_width)
          )} x ${fraction(eval(breakdowns.rightStile_height))}`,
          pattern: 'R',
          width:eval(breakdowns.rightStile_width),
          height: eval(breakdowns.rightStile_height),
          multiplier: 1
        },
        {
          qty: `(${(panelsW > 1 ? (panelsH > 1 ? panelsH : panelsW - 1) : panelsW - 1)})`,
          measurement: `${fraction(eval(breakdowns.vertical_mid_rail_width))} x ${fraction(
            Math.round(
              eval(breakdowns.vertical_mid_rail_height) * 16) / 16
          )}`,
          pattern: 'VM',
          width: eval(breakdowns.vertical_mid_rail_width),
          height: eval(breakdowns.vertical_mid_rail_height),
          multiplier: (panelsW > 1 ? (panelsH > 1 ? panelsH : panelsW - 1) : panelsW - 1)
        },
      ];
    }
    else {
      return [
        {
          qty: `(${(qty)})`,
          measurement: `${fraction(
            eval(breakdowns.leftStile_width)
          )} x ${fraction(eval(breakdowns.leftStile_height))}`,
          pattern: 'L',
          width: eval(breakdowns.leftStile_width),
          height: eval(breakdowns.leftStile_height),
          multiplier: 1
        },
        {
          qty: `(${(qty)})`,
          measurement: `${fraction(
            eval(breakdowns.rightStile_width)
          )} x ${fraction(eval(breakdowns.rightStile_height))}`,
          pattern: 'R',
          width: eval(breakdowns.rightStile_width),
          height: eval(breakdowns.rightStile_height),
          multiplier: 1
        }

      ];
    }
  }
};
