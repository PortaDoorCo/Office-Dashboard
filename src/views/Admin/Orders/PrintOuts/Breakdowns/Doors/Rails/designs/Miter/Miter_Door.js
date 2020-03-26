import Ratio from 'lb-ratio';
import frac2dec from '../../../frac2dec'
import numQty from 'numeric-quantity';

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




  console.log(part)
  console.log(info)

  if (topRail === bottomRail) {
    if ((panelsW > 1) || (panelsH > 1)) {
      return [
        {
          qty: (qty * 2),
          measurement: `${fraction(
            topRail
          )} x ${fraction(
            Math.round((
              (width)
            )
              * 16) / 16
          )}`,
          pattern: 'TB'
        },
        {
          qty: (((panelsH) - 1) * qty),
          measurement: `${fraction(horizMull)} x ${fraction(
            Math.round((
              (width -
                leftStile -
                rightStile)
            )
              * 16) / 16
          )}`,
          pattern: "HM"
        }
      ];
    } else {
      return [
        {
          qty: (qty * 2),
          measurement: `${fraction(
            topRail
          )} x ${fraction(
            Math.round((
              (width)
            )
              * 16) / 16
          )}`,
          pattern: 'TB'
        }
      ];
    }
  } else {
    if ((panelsW > 1) || (panelsH > 1)) {
      return [
        {
          qty: qty,
          measurement: `${fraction(
            topRail
          )} x ${fraction(
            Math.round((
              (width)
            )
              * 16) / 16
          )}`,
          pattern: "T"
        },
        {
          qty: qty,
          measurement: `${fraction(
            bottomRail
          )} x ${fraction(
            Math.round((
              (width)
            )
              * 16) / 16
          )}`,
          pattern: "B"
        },
        {
          qty: ((panelsH - 1) * qty),
          measurement: `${fraction(horizMull)} x ${fraction(
            Math.round(
              (
                (width -
                  leftStile -
                  rightStile)
              )
              * 16) / 16
          )}`,
          pattern: "HM"
        }
      ];
    } else {
      return [
        {
          qty: qty,
          measurement: `${fraction(
            topRail
          )} x ${fraction(
            Math.round((
              (width)
            )
              * 16) / 16
          )}`,
          pattern: "T"
        },
        {
          qty: qty,
          measurement: `${fraction(
            bottomRail
          )} x ${fraction(
            Math.round((
              (width)
            )
              * 16) / 16
          )}`,
          pattern: "B"
        },
      ];
    }
  }
}