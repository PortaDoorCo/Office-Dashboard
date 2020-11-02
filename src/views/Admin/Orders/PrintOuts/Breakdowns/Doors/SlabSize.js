import Ratio from 'lb-ratio';

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (item, edge) => {
  return `${fraction(item.width + edge)} x ${fraction(item.height + edge)}`;
};
