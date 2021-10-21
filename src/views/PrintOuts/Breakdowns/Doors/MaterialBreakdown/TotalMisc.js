import numQty from 'numeric-quantity';

export default (v, part) => {
  const calc = v.misc_items.map(i => {
    return parseInt(i.qty);
  });

  console.log({calc});


  const sum = calc.reduce((acc, item) => acc + item);

  console.log({sum});

 

  // const sum = a.reduce((acc, item) => acc + item);
  // return sum;

  return sum;
};
