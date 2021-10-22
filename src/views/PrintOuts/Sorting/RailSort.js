import GlassCheck from './GlassCheck';
import numQty from 'numeric-quantity';

const HeightSort = (part) => {

  console.log({rail_height: part});

  const sort = part.sort((a, b) =>  numQty(b.rail_height) - numQty(a.rail_height));

  return sort;
};

export default HeightSort;
