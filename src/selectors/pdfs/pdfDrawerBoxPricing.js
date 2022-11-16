import numQty from 'numeric-quantity';
import currency from 'currency.js';
import moment from 'moment';

const pricing = (parts, pricer, itemPrice, order) => {
  const item = parts.map((part, index) => {
    const wood = part.woodtype ? part.woodtype.STANDARD_GRADE : 0;
    const finish = part.box_finish ? part.box_finish.UPCHARGE : 0;
    const assembly = part.box_assembly ? part.box_assembly.UPCHARGE : 0;
    const notchDrill = part.box_notch ? part.box_notch.PRICE : 0;

    if (part.dimensions) {
      const linePrice = part.dimensions.map((i, p) => {
        const width = numQty(i.width);
        const height = numQty(i.height);
        const depth = numQty(i.depth);
        const qty = parseInt(i.qty);
        const extraCost = i.extraCost ? parseFloat(i.extraCost) : 0;
        const scoop = i.scoop.PRICE;

        if (
          !order?.oldPricing &&
          moment(order?.created_at) > moment('11-14-2022')
        ) {
          const price1 = eval(pricer.drawer_box_pricing) + extraCost;

          const price =
            itemPrice?.length > 0 && itemPrice[index]?.length > 0
              ? itemPrice[index][p]
              : currency(price1).multiply(1.035).value;

          const addQty = currency(price).multiply(qty).value;

          if (height > -1) {
            return addQty;
          } else {
            return 0;
          }
        } else {
          const price1 = eval(pricer.drawer_box_pricing) + extraCost;

          const price =
            itemPrice?.length > 0 && itemPrice[index]?.length > 0
              ? itemPrice[index][p]
              : Math.floor(price1 * 100) / 100;

          const addQty = Math.round(price * qty * 100) / 100;

          if (height > -1) {
            return addQty;
          } else {
            return 0;
          }
        }
      });
      return linePrice;
    } else {
      return 0;
    }
  });

  return item;
};

export default pricing;
