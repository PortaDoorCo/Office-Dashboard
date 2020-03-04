import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';
import frac2dec from '../../../frac2dec'


const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part) => {
  const add_len = part.design.S_ADD_LEN;
  const topRail = frac2dec(info.topRail) + part.design.TR_MILL_AD;
  const bottomRail = frac2dec(info.bottomRail) + part.design.BR_MILL_AD;
  const leftStile = frac2dec(info.leftStile) + part.design.LS_MILL_AD;
  const rightStile = frac2dec(info.rightStile) + part.design.RS_MILL_AD;
  const vertMull = frac2dec(info.verticalMidRailSize) + part.design.V_MULL_ADD;
  const horizMull = frac2dec(info.horizontalMidRailSize) + part.design.H_MULL_ADD;
  const panelsH = parseInt(info.panelsH)
  const panelsW = parseInt(info.panelsW)
  const height = frac2dec(info.height)
  const width = frac2dec(info.width)
  const qty = parseInt(info.qty)
  const tenon_factor = part.design.TENON


  if (leftStile === rightStile) {
    if ((panelsW > 1) || (panelsH > 1)) {
      if (!part.design.LOCK_UPDN) {
        return [
          {
            qty: (qty * 2),
            measurement: `${fraction(
              leftStile
            )} x ${fraction(height + add_len)}`,
            pattern: "LR"
          },
          {
            qty: (panelsH * (panelsW - 1) * qty),
            measurement: `${fraction(vertMull)} x ${fraction(
              Math.round(
                ((height +
                add_len -
                topRail -
                bottomRail -
                horizMull * (panelsH - 1)) /
                panelsH +
                tenon_factor)
                * 16) / 16
            )}`,
            pattern: "VM7"
          },
        ]
      } else {
        return [
          {
            qty: (qty * 2),
            measurement: `${fraction(
              leftStile
            )} x ${fraction(height + add_len)}`,
            pattern: "LR"
          },
          {
            qty: (((panelsW) - 1) * qty),
            measurement: `${fraction(vertMull)} x ${fraction(
              Math.round((height +
                add_len -
                topRail -
                bottomRail +
                tenon_factor
              ) * 16) / 16
            )}`,
            pattern: "VM3"
          },
        ]
      }
    } else {
      return [
        {
          qty: (qty * 2),
          measurement: `${fraction(
            leftStile
          )} x ${fraction(height + add_len)}`,
          pattern: "LR"
        }
      ]
    }
  }
  else {
    if ((panelsW > 1) || (panelsH > 1)) {
      if (!part.design.LOCK_UPDN) {
        return [
          {
            qty: qty,
            measurement: `${fraction(
              leftStile
            )} x ${fraction(height + add_len)}`,
            pattern: "L"
          },
          {
            qty: qty,
            measurement: `${fraction(
              rightStile
            )} x ${fraction(height + add_len)}`,
            pattern: "R"
          },
          {
            qty: (panelsH * (panelsW - 1) * qty),
            measurement: `${fraction(leftStile)} x ${fraction(
              Math.round(
                ((height +
                  add_len -
                  topRail -
                  bottomRail -
                  horizMull * (panelsH - 1)) /
                  panelsH +
                  tenon_factor) *
                16
              ) / 16
            )}`,
            pattern: "VM4"
          },
        ]
      } else {
        return [
          {
            qty: height,
            measurement: `${fraction(
              leftStile
            )} x ${fraction(height + add_len)}`,
            pattern: "L"
          },
          {
            qty: height,
            measurement: `${fraction(
              rightStile
            )} x ${fraction(height + add_len)}`,
            pattern: "R"
          },
          {
            qty: (((panelsW) - 1) * qty),
            measurement: `${fraction(vertMull)} x ${fraction(
              Math.round((height +
                add_len -
                topRail -
                bottomRail +
                tenon_factor
              ) * 16) / 16
            )}`,
            pattern: "VM9"
          },
        ]
      }
    }
    else {
      return [
        {
          qty: height,
          measurement: `${fraction(
            leftStile
          )} x ${fraction(height + add_len)}`,
          pattern: "L"
        },
        {
          qty: height,
          measurement: `${fraction(
            rightStile
          )} x ${fraction(height + add_len)}`,
          pattern: "R"
        }

      ]
    }
  }
};
