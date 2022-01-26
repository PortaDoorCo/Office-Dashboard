import numQty from 'numeric-quantity';

const pricing = (parts, pricer) => {
  const item = parts.map((i, index) => {
    let price = 0;
    if (i.category === 'preselect') {
      if (i.item) {
        if (i.qty) {
          price = Math.floor((pricer[index] * parseFloat(i.qty)) * 100) / 100; 
        } else {
          price = 0;
        }
      } else {
        price = 0;
      }
    } else {
      if (i.pricePer) {
        if (i.qty) {
          price = Math.floor((pricer[index] * parseFloat(i.qty)) * 100) / 100;
        } else {
          price = 0;
        }
      } else {
        price = 0;
      }
    }
    return price;
  });

  return item;
};

export default pricing;
