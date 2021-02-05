import numQty from 'numeric-quantity';
import { flatten, values, filterBy, _ } from 'lodash';
import Stiles from '../Stiles/Stiles';


export default (parts, breakdowns,thickness) => {

  console.log({parts});

  const calc = parts.map((part, i) => {
    return part.items.map(j => {
      console.log(_.filter(j, { [filterBy]: thickness }));
      console.log({j});
      console.log({thickness});

      const stiles = Stiles(j, part.part, breakdowns).map((stile) => {
        const height = ((numQty(stile.height)) * 2) * parseInt(j.qty);
        const width = (numQty(stile.width) * 2) * parseInt(j.qty);
        const sum = (height + width) / 12;
        return sum;
      });

      return stiles.reduce((acc, item) => acc + item, 0);;
    });
  });

  console.log({calc});

  const sub_sum = calc.map(i => {
    return i.reduce((acc, item) => acc + item, 0);
  });

  const sum = sub_sum.reduce((acc, item) => acc + item, 0);

  console.log(sum);

  return sum.toFixed(2);
};



