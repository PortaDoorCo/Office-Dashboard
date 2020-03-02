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

  console.log(part.design.LOCK_UPDN)

  // console.log(info.horizontalMidRailSize)
  // console.log(numQty(horizMull))
  // console.log(fraction(numQty(info.horizontalMidRailSize)))
  // console.log(part.design.H_MULL_ADD)
  // console.log(topRail)


  console.log(numQty(info.height))
  console.log(topRail)
  console.log(bottomRail)
  console.log(horizMull)
  console.log(part.design.TENON)


  if (info.leftStile === info.rightStile) {
    if (parseInt(info.panelsW) > 1) {
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
                Math.ceil(
                  ((numQty(info.height) +
                  add_len -
                  topRail -
                  bottomRail -
                  horizMull * (numQty(info.panelsH) - 1)) /
                  numQty(info.panelsH) +
                  part.design.TENON)
                  * 16 
                  ) / 16
            )}`,
            pattern: "VM7"
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
                Math.ceil((numQty(info.height) +
                  add_len -
                  topRail -
                  bottomRail +
                  part.design.TENON)
                  * 16
                  ) / 16
            )}`,
            pattern: "VM3"
          },
        ]
      }
    } else {
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

      
    // } if (parseInt(info.panelsH) > 1 && parseInt(info.panelsW > 1)) {
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
              Math.ceil(
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
                Math.ceil((numQty(info.height) +
                  add_len -
                  topRail -
                  bottomRail +
                  part.design.TENON)
                  * 16
                  ) / 16
            )}`,
            pattern: "VM9"
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

  // else if (parseInt(info.panelsH) > 1 && parseInt(info.panelsW > 1)) {
  //   return [
  //     {
  //       qty: info.qty,
  //       measurement: `${fraction(
  //         numQty(leftStile)
  //       )} x ${fraction(numQty(info.height) + add_len)}`,
  //       pattern: "L"
  //     },
  //     {
  //       qty: info.qty,
  //       measurement: `${fraction(
  //         numQty(rightStile)
  //       )} x ${fraction(numQty(info.height) + add_len)}`,
  //       pattern: "R"
  //     },
  //     {
  //       qty: (info.panelsH - 1) * parseInt(info.qty),
  //       measurement: `${fraction(leftStile)} x ${fraction(
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



};
