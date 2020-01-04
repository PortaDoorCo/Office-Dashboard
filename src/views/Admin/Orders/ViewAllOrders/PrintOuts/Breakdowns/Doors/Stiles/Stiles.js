import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part) => {
  const add_len = part.design.S_ADD_LEN;
  const topRail = (part.design.TOP_RAIL_W !== numQty(info.topRail) ? (numQty(info.topRail) + 0.0625) : numQty(info.topRail))
  const bottomRail = (part.design.BOT_RAIL_W !== numQty(info.bottomRail) ? (numQty(info.bottomRail) + 0.0625) : numQty(info.bottomRail))
  const leftStile = (part.design.L_STILE_W !== numQty(info.leftStile) ? (numQty(info.leftStile) + 0.0625) : numQty(info.leftStile))
  const rightStile = (part.design.R_STILE_W !== numQty(info.rightStile) ? (numQty(info.rightStile) + 0.0625) : numQty(info.rightStile))
  const vertMull = (part.design.V_MULL_WTH !== numQty(info.verticalMidRailSize) ? (numQty(info.verticalMidRailSize) + 0.0625) : numQty(info.verticalMidRailSize))
  const horizMull = (part.design.H_MULL_WTH !== numQty(info.horizontalMidRailSize) ? (numQty(info.horizontalMidRailSize) + 0.0625) : numQty(info.horizontalMidRailSize))


  if (part.design.NAME === "PRP 15") {
    if (info.leftStile === info.rightStile) {
      if (info.panelsW > 1) {
        return [
          {
            qty: info.qty * 2,
            measurement: `${fraction(
              numQty(leftStile)
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "LR"
          },
          {
            qty: (parseInt(info.panelsH) * (parseInt(info.panelsW) - 1) * parseInt(info.qty)),
            measurement: `${fraction(vertMull)} x ${fraction(
              Math.floor(
                ((numQty(info.height) +
                  add_len -
                  topRail -
                  bottomRail -
                  numQty(horizMull) * (numQty(info.panelsH) - 1)) /
                  numQty(info.panelsH) +
                  part.design.TENON) *
                16
              ) / 16
            )}`,
            pattern: "VM3"
          },
        ]
      } else if (parseInt(info.panelsH) > 1 && parseInt(info.panelsW > 1)) {
        return [
          {
            qty: info.qty * 2,
            measurement: `${fraction(
              numQty(leftStile)
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "LR"
          },
          {
            qty: (info.panelsH - 1) * parseInt(info.qty),
            measurement: `${fraction(vertMull)} x ${fraction(
              numQty(info.height) +
              add_len -
              numQty(leftStile) -
              numQty(rightStile) +
              part.design.TENON
            )}`,
            pattern: "VM2"
          }
        ]
      }
      else {
        return [
          {
            qty: info.qty * 2,
            measurement: `${fraction(
              numQty(leftStile)
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "LR"
          }
        ]
      }
    }
    else {
      if (info.panelsW > 1) {
        return [
          {
            qty: info.qty,
            measurement: `${fraction(
              numQty(leftStile)
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "L"
          },
          {
            qty: info.qty,
            measurement: `${fraction(
              numQty(rightStile)
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "R"
          },
          {
            qty: (parseInt(info.panelsH) * (parseInt(info.panelsW) - 1) * parseInt(info.qty)),
            measurement: `${fraction(leftStile)} x ${fraction(
              Math.floor(
                ((numQty(info.height) +
                  add_len -
                  topRail -
                  bottomRail -
                  numQty(horizMull) * (numQty(info.panelsH) - 1)) /
                  numQty(info.panelsH) +
                  part.design.TENON) *
                16
              ) / 16
            )}`,
            pattern: "VM4"
          },
        ]
      } else if (parseInt(info.panelsH) > 1 && parseInt(info.panelsW > 1)) {
        return [
          {
            qty: info.qty,
            measurement: `${fraction(
              numQty(leftStile)
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "L"
          },
          {
            qty: info.qty,
            measurement: `${fraction(
              numQty(rightStile)
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "R"
          },
          {
            qty: (info.panelsH - 1) * parseInt(info.qty),
            measurement: `${fraction(leftStile)} x ${fraction(
              numQty(info.height) +
              add_len -
              numQty(leftStile) -
              numQty(rightStile) +
              part.design.TENON
            )}`,
            pattern: "VM2"
          }
        ]
      }
      else {
        return [
          {
            qty: info.qty,
            measurement: `${fraction(
              numQty(leftStile)
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "L"
          },
          {
            qty: info.qty,
            measurement: `${fraction(
              numQty(rightStile)
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "R"
          }

        ]
      }
    }


  } else {
    return [
      {
        qty: info.qty * 2,
        measurement: `${fraction(
          numQty(leftStile) + 0.0625
        )} x ${fraction(numQty(info.height) + add_len)}`,
        pattern: "LR"
      }
    ]
  }

};
