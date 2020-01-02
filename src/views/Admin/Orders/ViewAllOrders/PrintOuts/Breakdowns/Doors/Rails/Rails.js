import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part) => {

  const topRail = (part.design.TOP_RAIL_W !== numQty(info.topRail) ? (numQty(info.topRail) + 0.0625) : numQty(info.topRail))
  const bottomRail = (part.design.BOT_RAIL_W !== numQty(info.bottomRail) ? (numQty(info.bottomRail) + 0.0625) : numQty(info.bottomRail))
  const leftStile = (part.design.L_STILE_W !== numQty(info.leftStile) ? (numQty(info.leftStile) + 0.0625) : numQty(info.leftStile))
  const rightStile = (part.design.R_STILE_W !== numQty(info.rightStile) ? (numQty(info.rightStile) + 0.0625) : numQty(info.rightStile))
  const horizMull = (part.design.H_MULL_WTH !== numQty(info.horizontalMidRailSize) ? (numQty(info.horizontalMidRailSize) + 0.0625) : numQty(info.horizontalMidRailSize))
  const vertMull = (part.design.V_MULL_WTH !== numQty(info.verticalMidRailSize) ? (numQty(info.verticalMidRailSize) + 0.0625) : numQty(info.verticalMidRailSize))



  if (info.topRail === info.bottomRail) {
    if ((info.panelsH && info.panelsW > 1) || (info.panelsW && info.panelsH > 1)) {
      return [
        {
          qty: info.qty * 2,
          measurement: `${fraction(
            numQty(info.topRail)
          )} x ${fraction(
            numQty(info.width) +
            part.design.S_ADD_LEN -
            numQty(leftStile) -
            numQty(rightStile) +
            part.design.TENON
          )}`,
          pattern: 'TB'
        },
        {
          qty: `${(info.panelsW > 1 && info.panelsH < 2) ? ((info.panelsW - 1) * info.qty) : (info.panelsH > 1 && info.panelsW < 2) ? ((info.panelsH - 1) * info.qty) : (parseInt(info.panelsH) - 1) * info.qty}`,
          measurement: `${fraction(horizMull)} x ${fraction(
            numQty(info.width) +
            0.125 -
            numQty(leftStile) -
            numQty(rightStile) +
            part.design.TENON
          )}`,
          pattern: "HM"
        }
      ];
    } else {
      return [
        {
          qty: info.qty * 2,
          measurement: `${fraction(
            numQty(info.topRail)
          )} x ${fraction(
            numQty(info.width) +
            part.design.S_ADD_LEN -
            numQty(leftStile) -
            numQty(rightStile) +
            part.design.TENON
          )}`,
          pattern: 'TB'
        }
      ];
    }
  } else {
    if ((info.panelsH && info.panelsW > 1) || (info.panelsH > 1 && info.panelsW)) {
      return [
        {
          qty: info.qty,
          measurement: `${fraction(
            topRail
          )} x ${fraction(
            numQty(info.width) +
            part.design.S_ADD_LEN -
            numQty(leftStile) -
            numQty(rightStile) +
            part.design.TENON
          )}`,
          pattern: "T"
        },
        {
          qty: info.qty,
          measurement: `${fraction(
            bottomRail
          )} x ${fraction(
            numQty(info.width) +
            part.design.S_ADD_LEN -
            numQty(leftStile) -
            numQty(rightStile) +
            part.design.TENON
          )}`,
          pattern: "B"
        },
        {
          qty: `${(info.panelsW > 1 && info.panelsH < 2) ? ((info.panelsW - 1) * info.qty) : (info.panelsH > 1 && info.panelsW < 2) ? ((info.panelsH - 1) * info.qty) : (parseInt(info.panelsH) - 1) * info.qty}`,
          measurement: `${fraction(horizMull)} x ${fraction(
            numQty(info.width) +
            0.125 -
            numQty(leftStile) -
            numQty(rightStile) +
            part.design.TENON
          )}`,
          pattern: "HM"
        }
      ];
    } else {
      return [
        {
          qty: info.qty,
          measurement: `${fraction(
            topRail
          )} x ${fraction(
            numQty(info.width) +
            part.design.S_ADD_LEN -
            numQty(leftStile) -
            numQty(rightStile) +
            part.design.TENON
          )}`,
          pattern: "T"
        },
        {
          qty: info.qty,
          measurement: `${fraction(
            bottomRail
          )} x ${fraction(
            numQty(info.width) +
            part.design.S_ADD_LEN -
            numQty(leftStile) -
            numQty(rightStile) +
            part.design.TENON
          )}`,
          pattern: "B"
        },
      ];
    }
  }

};
