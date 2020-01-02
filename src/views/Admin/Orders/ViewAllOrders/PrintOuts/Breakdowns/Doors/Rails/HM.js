import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part) => {

  const HM = {
    qty: `${(info.panelsW > 1 && info.panelsH < 2) ? ((info.panelsW - 1) * info.qty) : (info.panelsH > 1 && info.panelsW < 2) ? ((info.panelsH - 1) * info.qty) : (parseInt(info.panelsH) - 1) * info.qty}`,
    measurement: `${fraction(info.leftStile)} x ${fraction(
      numQty(info.width) +
      0.125 -
      numQty(info.leftStile) -
      numQty(info.rightStile) +
      part.design.TENON
    )}`,
    pattern: "HM"

  }
  return HM;
};
