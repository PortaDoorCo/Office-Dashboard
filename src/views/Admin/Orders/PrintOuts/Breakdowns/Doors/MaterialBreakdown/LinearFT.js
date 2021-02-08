import numQty from 'numeric-quantity';
import { flatten, values } from 'lodash';
import Stiles from '../Stiles/Stiles';
import Rails from '../Rails/Rails';


export default (parts, breakdowns,thickness) => {

  console.log({parts});

  const calc = parts.map((part, i) => {
    return part.items.map(j => {

      // const filtered = Object.keys(j).reduce(function(r, e) {
      //   if (thickness.includes(j[e])) r[e] = j[e];
      //   return r;
      // }, {});

      let stile = {};
      let rail = {};

      const stile_map = Object.keys(j).map(a => {
        if(a === 'leftStile'){
          return j[a] === thickness ? stile[a] = j[a] : stile[a] = 0;
        }
        if(a === 'rightStile'){
          return j[a] === thickness ? stile[a] = j[a] : stile[a] = 0;
        }
        
        if(a === 'horizontalMidRailSize'){
          return j[a] === thickness ? rail[a] = j[a] : rail[a] = 0;
        }

        if(a === 'verticalMidRailSize'){
          return j[a] === thickness ? stile[a] = j[a] : stile[a] = 0;
        }
        else {
          return stile[a] = j[a];
        }
      }, {});

      const rail_map = Object.keys(j).map(a => {
        if(a === 'topRail'){
          return j[a] === thickness ? rail[a] = j[a] : rail[a] = 0;
        }
        if(a === 'bottomRail'){
          return j[a] === thickness ? rail[a] = j[a] : rail[a] = 0;
        }

        if(a === 'horizontalMidRailSize'){
          return j[a] === thickness ? rail[a] = j[a] : rail[a] = 0;
        }

        if(a === 'verticalMidRailSize'){
          return j[a] === thickness ? stile[a] = j[a] : stile[a] = 0;
        }

        else {
          return rail[a] = j[a];
        }
      }, {});


      console.log({stile_map});

      const stiles = Stiles(stile, part.part, breakdowns).map((stile) => {
        console.log({stile});
        console.log(j.qty);
        if((stile.width > 0) && (stile.height > 0)){
          const width = numQty(stile.width);
          const height = ((numQty(stile.height)) * stile.multiplier) * parseInt(j.qty);
          const sum = height / 12;
          return sum; 
        } else {
          return 0;
        }

      });

      const rails = Rails(rail, part.part, breakdowns).map((stile) => {
        console.log({stile});
        if((stile.width > 0) && (stile.height > 0)){
          const height = ((numQty(stile.height)) * stile.multiplier) * parseInt(j.qty);
          const sum = height / 12;
          return sum;
        } else {
          return 0;
        }

      });

      const stiles_total = stiles.reduce((acc, item) => acc + item, 0);
      const rails_total = rails.reduce((acc, item) => acc + item, 0);

      console.log({stiles_total});
      console.log({rails_total});

      return stiles_total + rails_total;
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



