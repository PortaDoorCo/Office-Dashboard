import numQty from 'numeric-quantity';
import { flatten, values, uniq, uniqBy, groupBy } from 'lodash';
import Stiles from '../Stiles/Stiles';
import Rails from '../Rails/Rails';
import Ratio from 'lb-ratio';

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (parts, breakdowns,thickness) => {

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

      const stiles = Stiles(stile, part.part, breakdowns).map((stile) => {
        if((numQty(stile.width) > 1) && (numQty(stile.height) > 1)){
          const width = numQty(stile.width) === 2.376 ? 2.375 : numQty(stile.width);
          const height = ((numQty(stile.height)) * stile.multiplier) * parseInt(j.qty);
          const sum = height / 12;
          return {
            sum,
            width,
          }; 
        } else {
          return {
            sum:0,
            width: 0
          };
        }

      });

      const rails = Rails(rail, part.part, breakdowns).map((stile) => {
        if((stile.width > 1) && (stile.height > 1)){
          const width = numQty(stile.width) === 2.376 ? 2.375 : numQty(stile.width);
          const height = ((numQty(stile.height)) * stile.multiplier) * parseInt(j.qty);
          const sum = height / 12;
          return {
            sum,
            width
          };
        } else {
          return {
            sum:0,
            width: 0
          };
        }

      }); 
      

      const s = uniqBy(stiles, 'width');
      const r = uniqBy(rails, 'width');

      return s.concat(r);
    });
  });

  const first_obj = flatten(calc);


  const flatten_obj = flatten(first_obj);
  const groupedObj = groupBy(flatten_obj, 'width');

  

  const newObj = Object.entries(groupedObj).map(([k, v]) => {
    return {width: k, sum: v.reduce((a,b) => a + b.sum, 0)};
  });


  const newObj3 = newObj.map(i => {


    return {
      sum : i.sum.toFixed(2),
      width:  i.width ? i.width : 0
    };
  });

  return newObj3;



};



