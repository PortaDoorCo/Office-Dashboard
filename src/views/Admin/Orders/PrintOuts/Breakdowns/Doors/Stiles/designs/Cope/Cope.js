import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';
import frac2dec from '../../../frac2dec'


const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part) => {

  const vMidRail = info.verticalMidRailSize ? info.verticalMidRailSize : 0
  const hMidRail = info.horizontalMidRailSize ? info.horizontalMidRailSize : 0

  const top_rail_add = part.design.TOP_RAIL_ADD
  const btm_rail_add = part.design.BTM_RAIL_ADD

  const topRail = numQty(info.topRail) + top_rail_add
  const bottomRail = numQty(info.bottomRail) + btm_rail_add
  const leftStile = numQty(info.leftStile)
  const rightStile = numQty(info.rightStile)
  const vertMull = numQty(vMidRail)
  const horizMull = numQty(hMidRail)
  const panelsH = parseInt(info.panelsH)
  const panelsW = parseInt(info.panelsW)
  const height = numQty(info.height)
  const width = numQty(info.width)
  const qty = parseInt(info.qty)

  const inset = part.profile.INSET
  const edge_factor = part.edge.LIP_FACTOR

  const add_len = 0;
  const tenon_factor = 0;



  if (leftStile === rightStile) {
    if ((panelsW > 1) || (panelsH > 1)) {
      return [
        {
          qty: (qty * 2),
          measurement: `${fraction(
            leftStile
          )} x ${fraction(height + edge_factor)}`,
          pattern: "LR"
        },
        {
          qty: (((panelsW) - 1) * qty),
          measurement: `${fraction(vertMull)} x ${fraction(
            Math.round((
              ((height -
                topRail -
                bottomRail -
                (horizMull *
                  (panelsH - 1))) /
              panelsH) + inset + (edge_factor / panelsH)
            ) * 16) / 16
          )}`,
          pattern: "VM3"
        },
      ]
    } else {
      return [
        {
          qty: (qty * 2),
          measurement: `${fraction(
            leftStile
          )} x ${fraction(height + edge_factor)}`,
          pattern: "LR"
        }
      ]
    }
  }
  else {
    if ((panelsW > 1) || (panelsH > 1)) {
      return [
        {
          qty: height,
          measurement: `${fraction(
            leftStile
          )} x ${fraction(height + edge_factor)}`,
          pattern: "L"
        },
        {
          qty: height,
          measurement: `${fraction(
            rightStile
          )} x ${fraction(height + edge_factor)}`,
          pattern: "R"
        },
        {
          qty: (((panelsW) - 1) * qty),
          measurement: `${fraction(vertMull)} x ${fraction(
            Math.round((
              ((height -
                topRail -
                bottomRail -
                (horizMull *
                  (panelsH - 1))) /
              panelsH) + inset + (edge_factor / panelsH)
            ) * 16) / 16
          )}`,
          pattern: "VM9"
        },
      ]
    }
    else {
      return [
        {
          qty: height,
          measurement: `${fraction(
            leftStile
          )} x ${fraction(height + edge_factor)}`,
          pattern: "L"
        },
        {
          qty: height,
          measurement: `${fraction(
            rightStile
          )} x ${fraction(height + edge_factor)}`,
          pattern: "R"
        }

      ]
    }
  }
};
