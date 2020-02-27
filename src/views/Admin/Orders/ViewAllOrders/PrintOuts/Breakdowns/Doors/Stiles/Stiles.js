import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part) => {
  const add_len = part.design.S_ADD_LEN;
  const topRail = numQty(info.topRail);
  const bottomRail = numQty(info.bottomRail);
  const leftStile = numQty(info.leftStile);
  const rightStile = numQty(info.rightStile);
  const vertMull = numQty(info.verticalMidRailSize);
  const horizMull = numQty(info.horizontalMidRailSize);

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
};
