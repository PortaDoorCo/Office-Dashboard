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


  if (info.leftStile === info.rightStile) {
    if (info.panelsW > 1) {
      if(!part.design.LOCK_UPDN){
        return [
          {
            qty: info.qty * 2,
            measurement: `${fraction(
             leftStile
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "LR"
          },
          {
            qty: (parseInt(info.panelsH) * (parseInt(info.panelsW) - 1) * parseInt(info.qty)),
            measurement: `${fraction(vertMull)} x ${fraction(

                ((numQty(info.height) +
                  add_len -
                  topRail -
                  bottomRail -
                  horizMull * (numQty(info.panelsH) - 1)) /
                  numQty(info.panelsH) +
                  part.design.TENON)
            )}`,
            pattern: "VM3"
          },
        ]
      } else {
        return [
          {
            qty: info.qty * 2,
            measurement: `${fraction(
              leftStile
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "LR"
          },
          {
            qty: `${(info.panelsW > 1 && info.panelsH < 2) ? ((info.panelsW - 1) * info.qty) : (info.panelsH > 1 && info.panelsW < 2) ? ((info.panelsH - 1) * info.qty) : (parseInt(info.panelsH) - 1) * info.qty}`,
            measurement: `${fraction(vertMull)} x ${fraction(
                ((numQty(info.height) -
                  topRail -
                  bottomRail +
                  part.design.TENON
                  ))
            )}`,
            pattern: "VM12"
          },
        ]
      }
      
    } 
    // else if (parseInt(info.panelsH) > 1 && parseInt(info.panelsW > 1)) {
    //   return [
    //     {
    //       qty: info.qty * 2,
    //       measurement: `${fraction(
    //         numQty(leftStile)
    //       )} x ${fraction(numQty(info.height) + add_len)}`,
    //       pattern: "LR"
    //     },
    //     {
    //       qty: (info.panelsH - 1) * parseInt(info.qty),
    //       measurement: `${fraction(vertMull)} x ${fraction(
    //         numQty(info.height) +
    //         add_len -
    //         numQty(leftStile) -
    //         numQty(rightStile) +
    //         part.design.TENON
    //       )}`,
    //       pattern: "VM2"
    //     }
    //   ]
    // }
    else {
      return [
        {
          qty: info.qty * 2,
          measurement: `${fraction(
            leftStile
          )} x ${fraction(numQty(info.height) + add_len)}`,
          pattern: "LR"
        }
      ]
    }
  }
  else {
    if (info.panelsW > 1) {
      if(!part.design.LOCK_UPDN){
        return [
          {
            qty: info.qty,
            measurement: `${fraction(
              leftStile
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "L"
          },
          {
            qty: info.qty,
            measurement: `${fraction(
              rightStile
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "R"
          },
          {
            qty: (parseInt(info.panelsH) * (parseInt(info.panelsW) - 1) * parseInt(info.qty)),
            measurement: `${fraction(leftStile)} x ${fraction(
              
                ((numQty(info.height) -
                  topRail -
                  bottomRail -
                  numQty(horizMull) * (numQty(info.panelsH) - 1)) /
                  numQty(info.panelsH) +
                  part.design.TENON)

            )}`,
            pattern: "VM4"
          },
        ]
      } else {
        return [
          {
            qty: info.qty,
            measurement: `${fraction(
              leftStile
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "L"
          },
          {
            qty: info.qty,
            measurement: `${fraction(
              rightStile
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "R"
          },
          {
            qty: `${(info.panelsW > 1 && info.panelsH < 2) ? ((info.panelsW - 1) * info.qty) : (info.panelsH > 1 && info.panelsW < 2) ? ((info.panelsH - 1) * info.qty) : (parseInt(info.panelsH) - 1) * info.qty}`,
            measurement: `${fraction(vertMull)} x ${fraction(
                ((numQty(info.height) -
                  topRail -
                  bottomRail +
                  part.design.TENON
                  ))
            )}`,
            pattern: "VM9"
          },
        ]
      }
    } 
    else if (parseInt(info.panelsH) > 1 && parseInt(info.panelsW > 1)) {
      if(!part.design.LOCK_UPDN) {
        return [
          {
            qty: info.qty,
            measurement: `${fraction(
              leftStile
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "L"
          },
          {
            qty: info.qty,
            measurement: `${fraction(
              rightStile
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "R"
          },
          {
            qty: (info.panelsH - 1) * parseInt(info.qty),
            measurement: `${fraction(leftStile)} x ${fraction(
              numQty(info.height) +
              add_len -
              leftStile -
              rightStile +
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
              leftStile
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "L"
          },
          {
            qty: info.qty,
            measurement: `${fraction(
              rightStile
            )} x ${fraction(numQty(info.height) + add_len)}`,
            pattern: "R"
          },
          {
            qty: `${(info.panelsW > 1 && info.panelsH < 2) ? ((info.panelsW - 1) * info.qty) : (info.panelsH > 1 && info.panelsW < 2) ? ((info.panelsH - 1) * info.qty) : (parseInt(info.panelsH) - 1) * info.qty}`,
            measurement: `${fraction(vertMull)} x ${fraction(
                ((numQty(info.height) -
                  topRail -
                  bottomRail +
                  part.design.TENON
                  ))
            )}`,
            pattern: "VM11"
          },
        ]
      }
    }
    else {
      return [
        {
          qty: info.qty,
          measurement: `${fraction(
            leftStile
          )} x ${fraction(numQty(info.height) + add_len)}`,
          pattern: "L"
        },
        {
          qty: info.qty,
          measurement: `${fraction(
           rightStile
          )} x ${fraction(numQty(info.height) + add_len)}`,
          pattern: "R"
        }
      ]
    }
  }
};
