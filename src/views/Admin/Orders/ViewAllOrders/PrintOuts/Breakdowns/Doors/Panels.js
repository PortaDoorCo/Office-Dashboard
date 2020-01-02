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

  console.log(part)
  const add_len = part.design.S_ADD_LEN;
  const door = `( ${(info.panelsH > 1 && info.panelsW < 2) ? (parseInt(info.panelsH) * parseInt(info.qty)) : (info.panelsW > 1 && info.panelsH < 2) ? (parseInt(info.panelsW) * parseInt(info.qty)) : (parseInt(info.panelsW) > 1 && parseInt(info.panelsH) > 1) ? (parseInt(info.panelsH) * parseInt(info.panelsW)) * parseInt(info.qty) : info.qty} ) ${fraction(
    (numQty(info.width) +
      add_len -
      numQty(leftStile) -
      numQty(rightStile)
      - (numQty(info.verticalMidRailSize) * (parseInt(info.panelsW) - 1))) / parseInt(info.panelsW) + 0.75
  )
    } x ${
    fraction(
      (numQty(info.height) +
        add_len -
        numQty(topRail) -
        numQty(bottomRail)
        - (numQty(info.horizontalMidRailSize) * (parseInt(info.panelsH) - 1))) / parseInt(info.panelsH) + 0.75
    )
    } `;

  const df = `( ${info.qty} ) ${
    fraction(
      numQty(info.height) +
      add_len -
      numQty(topRail) -
      numQty(bottomRail) +
      0.75
    )
    } x ${
    fraction(
      numQty(info.width) +
      add_len -
      numQty(leftStile) -
      numQty(rightStile) +
      0.75
    )
    } `;

  if (part.orderType.value === 'Door') {
    if (part.panels.PANEL === "NONE") {
      return 'GLASS'
    } else {
      return door;
    }
  } else {
    return df;
  }
};
