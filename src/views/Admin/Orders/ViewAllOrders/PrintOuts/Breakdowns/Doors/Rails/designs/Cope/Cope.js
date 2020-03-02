import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};


export default (info, part) => {

  const add_len = part.design.S_ADD_LEN;
  const topRail = numQty(info.topRail) + part.design.TR_MILL_AD;
  const bottomRail = numQty(info.bottomRail) + part.design.BR_MILL_AD;
  const leftStile = numQty(info.leftStile) + part.design.LS_MILL_AD;
  const rightStile = numQty(info.rightStile) + part.design.RS_MILL_AD;
  const vertMull = numQty(info.verticalMidRailSize) + part.design.V_MULL_ADD;
  const horizMull = numQty(info.horizontalMidRailSize) + part.design.H_MULL_ADD;

  if (info.topRail === info.bottomRail) {
    if ((info.panelsH && info.panelsW > 1) || (info.panelsW && info.panelsH > 1)) {
      if (!part.design.LOCK_UPDN) {
        return [
          {
            qty: info.qty * 2,
            measurement: `${fraction(
              topRail
            )} x ${fraction(
              numQty(info.width) +
              add_len -
              leftStile -
              rightStile +
              part.design.TENON
            )}`,
            pattern: 'TB'
          },
          {
            qty: `${(info.panelsW > 1 && info.panelsH < 2) ? ((info.panelsW - 1) * info.qty) : (info.panelsH > 1 && info.panelsW < 2) ? ((info.panelsH - 1) * info.qty) : (parseInt(info.panelsH) - 1) * info.qty}`,
            measurement: `${fraction(horizMull)} x ${fraction(
              numQty(info.width) +
              add_len -
              leftStile -
              rightStile +
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
              topRail
            )} x ${fraction(
              numQty(info.width) +
              add_len -
              leftStile -
              rightStile +
              part.design.TENON
            )}`,
            pattern: 'TB'
          },
          {
            qty: (parseInt(info.panelsH) * (parseInt(info.panelsW) - 1) * parseInt(info.qty)),
            measurement: `${fraction(horizMull)} x ${fraction(

              ((numQty(info.width) +
                add_len -
                leftStile -
                rightStile -
                vertMull * (numQty(info.panelsW) - 1)) /
                numQty(info.panelsW) +
                part.design.TENON)

            )}`,
            pattern: "HM"
          }
        ];
      }

    } else {
      return [
        {
          qty: info.qty * 2,
          measurement: `${fraction(
            topRail
          )} x ${fraction(
            numQty(info.width) +
            add_len -
            leftStile -
            rightStile +
            part.design.TENON
          )}`,
          pattern: 'TB'
        }
      ];
    }
  } else {
    if ((info.panelsH && info.panelsW > 1) || (info.panelsH > 1 && info.panelsW)) {

      if (!part.design.LOCK_UPDN) {
        return [
          {
            qty: info.qty,
            measurement: `${fraction(
              topRail
            )} x ${fraction(
              numQty(info.width) +
              add_len -
              leftStile -
              rightStile +
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
              add_len -
              leftStile -
              rightStile +
              part.design.TENON
            )}`,
            pattern: "B"
          },
          {
            qty: `${(info.panelsW > 1 && info.panelsH < 2) ? ((info.panelsW - 1) * info.qty) : (info.panelsH > 1 && info.panelsW < 2) ? ((info.panelsH - 1) * info.qty) : (parseInt(info.panelsH) - 1) * info.qty}`,
            measurement: `${fraction(horizMull)} x ${fraction(
              numQty(info.width) +
              add_len -
              leftStile -
              rightStile +
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
              add_len -
              leftStile -
              rightStile +
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
              add_len -
              leftStile -
              rightStile +
              part.design.TENON
            )}`,
            pattern: "B"
          },
          {
            qty: (parseInt(info.panelsH) * (parseInt(info.panelsW) - 1) * parseInt(info.qty)),
            measurement: `${fraction(horizMull)} x ${fraction(

              ((numQty(info.width) +
                add_len -
                leftStile -
                rightStile -
                vertMull * (numQty(info.panelsW) - 1)) /
                numQty(info.panelsW) +
                part.design.TENON)

            )}`,
            pattern: "HM"
          }
        ];
      }


    } else {
      return [
        {
          qty: info.qty,
          measurement: `${fraction(
            topRail
          )} x ${fraction(
            numQty(info.width) +
            add_len -
            leftStile -
            rightStile +
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
            add_len -
            leftStile -
            rightStile +
            part.design.TENON
          )}`,
          pattern: "B"
        },
      ];
    }
  }
}