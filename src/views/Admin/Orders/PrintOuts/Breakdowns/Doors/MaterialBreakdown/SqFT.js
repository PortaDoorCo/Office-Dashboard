import numQty from 'numeric-quantity';

export default (v, part) => {
  const calc = v.part_list.map(item => {
    const widths = item.dimensions.map(i => {
      console.log('widthhhh',i.width);
      return (numQty(i.width)) * parseInt(i.qty);
    });
    const heights = item.dimensions.map(i => {
      console.log('heighttsssss',numQty(i.height));
      return (numQty(i.height)) * parseInt(i.qty);
    });

    const widthTotal = widths.reduce((acc, item) => acc + item);
    const heightsTotal = heights.reduce((acc, item) => acc + item);



    return ((widthTotal + heightsTotal) / 12);
  });

  console.log('calc',calc);

  // console.log('callllccc',calc);
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
