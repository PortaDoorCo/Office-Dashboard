import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part) => {

  const topRail = numQty(info.topRail)
  const bottomRail = numQty(info.bottomRail)
  const leftStile = numQty(info.leftStile)
  const rightStile = numQty(info.rightStile)

  const INSET = part.panels.IN_SET


  const add_len = part.design.S_ADD_LEN;


  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  const unevenSplitArray = Array.from(Array(parseInt(info.panelsH)).keys()).slice(1).map((i, v) => {
    return numQty(info[`unevenSplitInput${v}`])
  }) 

  const unevenSplitTotal = unevenSplitArray.length > 0 ? unevenSplitArray.reduce(reducer) : 0;


  const door = [
    {
      qty: `${(info.panelsH > 1 && info.panelsW < 2) ? (parseInt(info.panelsH) * parseInt(info.qty)) : (info.panelsW > 1 && info.panelsH < 2) ? (parseInt(info.panelsW) * parseInt(info.qty)) : (parseInt(info.panelsW) > 1 && parseInt(info.panelsH) > 1) ? (parseInt(info.panelsH) * parseInt(info.panelsW)) * parseInt(info.qty) : info.qty}`,
      measurement: `${fraction(
        (numQty(info.width) +
          add_len -
          (leftStile) -
          (rightStile)
          - (numQty(info.verticalMidRailSize) * (parseInt(info.panelsW) - 1))) / parseInt(info.panelsW) + (INSET * 2)
      )} x ${fraction(
        (numQty(info.height) +
          add_len -
          (topRail) -
          (bottomRail)
          - (numQty(info.horizontalMidRailSize) * (parseInt(info.panelsH) - 1))) / parseInt(info.panelsH) + (INSET * 2) 
      )}`,
      pattern: 'PR'
    },
  ]

  const none = [
    {
      qty: ``,
      measurement: ``,
      pattern: 'GLASS'
    },
  ]


  const df = [
    {
      qty: `${info.qty}`,
      measurement: `${fraction(
        numQty(info.height) +
        add_len -
        numQty(topRail) -
        numQty(bottomRail) +
        (INSET * 2)
      )} x ${fraction(
        numQty(info.width) +
        add_len -
        numQty(leftStile) -
        numQty(rightStile) +
        (INSET * 2)
      )}`,
      pattern: 'PR'
    },
  ]




  const unevenSplit = [
    ...Array.from(Array(parseInt(info.panelsH)).keys()).slice(1).map((i, v) => {
      return {
        qty: `${info.qty}`,
        measurement: `${fraction(
          (numQty(info.width) +
            add_len -
            numQty(leftStile) -
            numQty(rightStile)
            - (numQty(info.verticalMidRailSize) * (parseInt(info.panelsW) - 1))) / parseInt(info.panelsW) + (INSET * 2)
        )} x ${fraction(
          (numQty(info[`unevenSplitInput${v}`]) + (INSET * 2))
        )}`,
        pattern: 'PR'
      }
    }),
    {
      qty: `${info.qty}`,
      measurement: `${fraction((numQty(info.width) +
        add_len -
        numQty(leftStile) -
        numQty(rightStile)
        - (numQty(info.verticalMidRailSize) * (parseInt(info.panelsW) - 1))) / parseInt(info.panelsW) + (INSET * 2)
      )} x ${fraction(numQty(info.height)
        - unevenSplitTotal
        - (numQty(info.horizontalMidRailSize) * (numQty(info.panelsH) - 1))
        - numQty(info.bottomRail)
        - numQty(info.topRail)
        + (INSET * 2)
      )}`,
      pattern: "PR"
    }
  ]

  if (part.orderType.value === 'Door') {
    if (part.panels.PANEL === "NONE") {
      return none
    } else {
      if (info.unevenCheck) {
        return unevenSplit
      } else {
        return door;
      }

    }
  } else {
    return df;
  }
};
