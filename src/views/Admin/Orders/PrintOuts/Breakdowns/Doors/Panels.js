import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';
import frac2dec from './frac2dec'

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part) => {
  
  const add_len = part.design.S_ADD_LEN;
  const topRail = numQty(info.topRail) + part.design.TR_MILL_AD;
  const bottomRail = part.design.ARCHED_BOT ? numQty(info.bottomRail) + part.design.TR_MILL_AD : numQty(info.bottomRail) + part.design.BR_MILL_AD;
  const leftStile = numQty(info.leftStile) + part.design.LS_MILL_AD;
  const rightStile = numQty(info.rightStile) + part.design.RS_MILL_AD;
  const vertMull = numQty(info.verticalMidRailSize) + part.design.V_MULL_ADD;
  const horizMull = numQty(info.horizontalMidRailSize) + part.design.H_MULL_ADD;
  const panelsH = parseInt(info.panelsH)
  const panelsW = parseInt(info.panelsW)
  const height = numQty(info.height)
  const width = numQty(info.width)
  const qty = parseInt(info.qty)
  const tenon_factor = part.design.TENON
  const lites = info.lites ? info.lites.option : ""
  const archHeight = part.design.ARCHED_BOT ? (part.arches.ARCHHEIGHT + add_len) * 2 : part.design.ARCHED_TOP ? (part.arches.ARCHHEIGHT + add_len) : 0

  const INSET = part.panels.IN_SET



  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  const unevenSplitArray = Array.from(Array(panelsH).keys()).slice(1).map((i, v) => {
    return numQty(info[`unevenSplitInput${v}`])
  })

  const unevenSplitTotal = unevenSplitArray.length > 0 ? unevenSplitArray.reduce(reducer) : 0;

  let door;

  if (part.design.Construction === "M") {
    door = [
      {
        qty: `(${(panelsH > 1 && panelsW < 2) ? (panelsH * qty) : (panelsW > 1 && panelsH < 2) ? (panelsW * qty) : (panelsW > 1 && panelsH > 1) ? (panelsH * panelsW) * qty : qty})`,
        measurement: `${fraction(
          Math.round((
            (width -
              leftStile -
              rightStile
              - (vertMull * (panelsW - 1))) / panelsW + (INSET * 2)) * 16) / 16
        )} x ${fraction(
          Math.round((
            (height -
              (topRail) -
              (bottomRail)
              - (horizMull * (panelsH - 1))) / panelsH + (INSET * 2))
            * 16) / 16
        )}`,
        pattern: 'PR'
      },
    ]
  } else {
      door = [
        {
          qty: `(${(panelsH > 1 && panelsW < 2) ? (panelsH * qty) : (panelsW > 1 && panelsH < 2) ? (panelsW * qty) : (panelsW > 1 && panelsH > 1) ? (panelsH * panelsW) * qty : qty})`,
          measurement: `${fraction(
            Math.round((
              (width +
                add_len -
                (leftStile) -
                (rightStile)
                - (vertMull * (panelsW - 1))) / panelsW + (INSET * 2)) * 16) / 16
          )} x ${fraction(
            Math.round((
              (height +
                add_len -
                (topRail) -
                (bottomRail)
                - (horizMull * (panelsH - 1))) / panelsH + (INSET * 2) + archHeight)
              * 16) / 16
          )}`,
          pattern: 'PR'
        },
      ]

  }




  const none = [
    {
      qty: ``,
      measurement: `GLASS \n ${lites}`,
      pattern: ``
    },
  ]


  const df = [
    {
      qty: `${info.qty}`,
      measurement: `${fraction(
        height +
        add_len -
        topRail -
        bottomRail +
        (INSET * 2)
      )} x ${fraction(
        width +
        add_len -
        leftStile -
        rightStile +
        (INSET * 2)
      )}`,
      pattern: 'PR'
    },
  ]




  const unevenSplit = [
    ...Array.from(Array(panelsH).keys()).slice(1).map((i, v) => {
      return {
        qty: qty,
        measurement: `${fraction(
          (width +
            add_len -
            leftStile -
            rightStile
            - (vertMull * (panelsW - 1))) / panelsW + (INSET * 2)
        )} x ${fraction(
          (numQty(info[`unevenSplitInput${v}`]) + (INSET * 2))
        )}`,
        pattern: 'PR'
      }
    }),
    {
      qty: qty,
      measurement: `${fraction((width +
        add_len -
        leftStile -
        rightStile
        - (vertMull * (panelsW - 1))) / panelsW + (INSET * 2)
      )} x ${fraction(height
        - unevenSplitTotal
        - (horizMull * (panelsH - 1))
        - bottomRail
        - topRail
        + (INSET * 2)
      )}`,
      pattern: "PR"
    }
  ]

  if (part.orderType.value === 'Door') {
    if (part.panels.PANEL === "GLASS") {
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
