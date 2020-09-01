import numQty from 'numeric-quantity';

export default (v, part) => {
  console.log('vvvvvvvv',v);
  const calc = v.part_list.map(item => {
    const sum = item.dimensions.map(i => {
      console.log(i.qty);
      return parseInt(i.qty);
    });
    console.log(sum);
    return sum;
  });
  const a = calc.map(i => (
    i.reduce((acc, item) => acc + item)
  ));
  //   return sum.toFixed(2);

  const sum = a.reduce((acc, item) => acc + item);
  console.log('sum',sum);
  return sum;
};
