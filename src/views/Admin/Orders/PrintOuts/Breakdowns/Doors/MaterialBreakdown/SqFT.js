  
import numQty from 'numeric-quantity';

export default (v, part) => {
  const calc = v.part_list.map(item => {
    const calc2 = item.dimensions.map(i => {

      console.log(numQty(i.width));
      console.log(numQty(i.height));
      console.log(numQty(i.qty));

      return ((numQty(i.width) * numQty(i.height)) * parseFloat(i.qty)) / 12;
    });


    console.log({calc2});

    const calc_total = calc2.reduce((acc, item) => acc + item);




    return calc_total / 12;
  });


  return calc.reduce((acc, item) => acc + item).toFixed(2);
  // const calc = v.map(item => {
  //   const height = ((numQty(item.height)) * 2) * parseInt(item.qty);
  //   const width = (numQty(item.width) * 2) * parseInt(item.qty);
  //   const sum = (height + width) / 144;
  //   return sum;
  // });
  // const sum = calc.reduce((acc, item) => acc + item, 0);
  // return sum.toFixed(2);
};