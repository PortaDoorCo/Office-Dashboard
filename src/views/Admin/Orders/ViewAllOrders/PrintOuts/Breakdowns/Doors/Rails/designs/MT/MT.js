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

  if (topRail === bottomRail) {
    if ((panelsW > 1) || (panelsH > 1)) {
      if (!part.design.LOCK_UPDN) {
        return [
          {
            qty: (qty * 2),
            measurement: `${fraction(
              topRail
            )} x ${fraction(
              Math.round((width +
                add_len -
                leftStile -
                rightStile +
                tenon_factor)
                * 16) / 16
            )}`,
            pattern: 'TB'
          },
          {
            qty: (((panelsH) - 1) * qty),
            measurement: `${fraction(horizMull)} x ${fraction(
              Math.round((width +
                add_len -
                leftStile -
                rightStile +
                tenon_factor)
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
              Math.round((width +
                add_len -
                leftStile -
                rightStile +
                tenon_factor)
                * 16) / 16
            )}`,
            pattern: 'TB'
          },
          {
            qty: (((panelsH - 1) * panelsW) * qty),
            measurement: `${fraction(horizMull)} x ${fraction(
              Math.round(
                ((width +
                  add_len -
                  leftStile -
                  rightStile -
                  vertMull * (panelsW - 1)) /
                  panelsW +
                  tenon_factor)
                * 16) / 16

            )}`,
            pattern: "HM"
          }
        ];
      }

    } else {
      return [
        {
          qty: (qty * 2),
          measurement: `${fraction(
            topRail
          )} x ${fraction(
            Math.round((width +
              add_len -
              leftStile -
              rightStile +
              tenon_factor)
              * 16) / 16
          )}`,
          pattern: 'TB'
        }
      ];
    }
  } else {
    if ((panelsW > 1) || (panelsW)) {

      if (!part.design.LOCK_UPDN) {
        return [
          {
            qty: qty,
            measurement: `${fraction(
              topRail
            )} x ${fraction(
              Math.round((width +
                add_len -
                leftStile -
                rightStile +
                tenon_factor)
                * 16) / 16
            )}`,
            pattern: "T"
          },
          {
            qty: qty,
            measurement: `${fraction(
              bottomRail
            )} x ${fraction(
              Math.round((width +
                add_len -
                leftStile -
                rightStile +
                tenon_factor)
                * 16) / 16
            )}`,
            pattern: "B"
          },
          {
            qty: (((panelsH) - 1) * qty),
            measurement: `${fraction(horizMull)} x ${fraction(
              Math.round((width +
                add_len -
                leftStile -
                rightStile +
                tenon_factor)
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
              Math.round((width +
                add_len -
                leftStile -
                rightStile +
                tenon_factor)
                * 16) / 16
            )}`,
            pattern: "T"
          },
          {
            qty: qty,
            measurement: `${fraction(
              bottomRail
            )} x ${fraction(
              Math.round((width +
                add_len -
                leftStile -
                rightStile +
                tenon_factor)
                * 16) / 16
            )}`,
            pattern: "B"
          },
          {
            qty: (((panelsH - 1) * panelsW) * qty),
            measurement: `${fraction(horizMull)} x ${fraction(
              Math.round(
                ((width +
                  add_len -
                  leftStile -
                  rightStile -
                  vertMull * (panelsW - 1)) /
                  panelsW +
                  tenon_factor)
                * 16) / 16
            )}`,
            pattern: "HM"
          }
        ];
      }


    } else {
      return [
        {
          qty: qty,
          measurement: `${fraction(
            topRail
          )} x ${fraction(
            Math.round((width +
              add_len -
              leftStile -
              rightStile +
              tenon_factor)
              * 16) / 16
          )}`,
          pattern: "T"
        },
        {
          qty: qty,
          measurement: `${fraction(
            bottomRail
          )} x ${fraction(
            Math.round((width +
              add_len -
              leftStile -
              rightStile +
              tenon_factor)
              * 16) / 16
          )}`,
          pattern: "B"
        },
      ];
    }
  }
}