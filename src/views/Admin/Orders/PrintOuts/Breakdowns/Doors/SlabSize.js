import Ratio from 'lb-ratio';
import numQty from 'numeric-quantity'

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (item, edge) => {
  return `${fraction(numQty(item.width) + edge)} x ${fraction(numQty(item.height) + edge)}`;
};
