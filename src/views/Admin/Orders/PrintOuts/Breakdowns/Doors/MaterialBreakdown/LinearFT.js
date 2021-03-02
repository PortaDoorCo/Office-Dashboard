import numQty from 'numeric-quantity';
import { flatten, values, uniq, groupBy } from 'lodash';
import Stiles from '../Stiles/Stiles';
import Rails from '../Rails/Rails';


export default (parts, breakdowns,thickness) => {

  console.log({parts});
  console.log({thickness});

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


      console.log({stile});

      const stiles = Stiles(stile, part.part, breakdowns).map((stile) => {
        console.log({stile});
        console.log(j.qty);
        if((stile.width > 1) && (stile.height > 1)){
          const width = numQty(stile.width);
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

      const rails = Rails(rail, part.part, breakdowns).map((stile) => {
        console.log({stile});
        if((stile.width > 1) && (stile.height > 1)){
          const width = numQty(stile.width);
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

      console.log({stiles});
      console.log({rails});

      

      const stiles_total = stiles.reduce((acc, item) => acc + item.sum, 0);
      const rails_total = rails.reduce((acc, item) => acc + item.sum, 0);

      const stile_widths = stiles.map(i => i.width);
      const rail_widths = rails.map(i => i.width);

      console.log(stiles.concat(rails));

      console.log({stile_widths});
      console.log({stiles_total});
      console.log({rails_total});

      return stiles.concat(rails);
    });
  });

  const first_obj = flatten(calc);

  const flatten_obj = flatten(first_obj);
  const groupedObj = groupBy(flatten_obj, 'width');
  const newObj = Object.entries(groupedObj).map(([k, v]) => {
    //console.log('new objjvvv==>>', v);

    return {width: k, sum: v.reduce((a,b) => a + b.sum, 0)};
  });
  console.log('new objj==>>', newObj);

  
  const sub_widths = flatten_obj.map(i => {
    return i.width;
  });

  const sub_sum = calc.map(i => {
    return i.reduce((acc, item) => acc + item.sum, 0);
  });



  console.log({sub_widths});

  const sub_final = uniq(flatten(sub_widths));
  console.log({sub_final});



  // const final = sub_final.filter(i => flatten_obj.includes(i));
  // console.log({final});

  const sum = sub_sum.reduce((acc, item) => acc + item, 0);
  console.log({sum});


  return newObj.map(i => {
    return {
      sum : i.sum.toFixed(2),
      width:  i.width ? i.width : null
    };
  });



};



