import GlassCheck from './GlassCheck';
import numQty from 'numeric-quantity';

const HeightSort = (part) => {

  

  const sort = part.sort((a, b) =>  numQty(b.height) - numQty(a.height));

  return sort;
};

export default HeightSort;
