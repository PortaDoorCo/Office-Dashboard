import numQty from 'numeric-quantity';

const pricing = (parts, pricer) => {
  const item = parts.map((part, index) => {
    const wood = part.woodtype ? part.woodtype.STANDARD_GRADE : 0;
    const finish = part.box_finish ? part.box_finish.UPCHARGE : 0;
    const assembly = part.box_assembly ? part.box_assembly.UPCHARGE : 0;
    const notchDrill = part.box_notch ? part.box_notch.PRICE : 0;

    if (part.dimensions) {
      const linePrice = part.dimensions.map((i) => {
        const width = numQty(i.width);
        const height = numQty(i.height);
        const depth = numQty(i.depth);
        const qty = parseInt(i.qty);
        const extraCost = i.extraCost ? parseFloat(i.extraCost) : 0;
        const scoop = i.scoop.PRICE;

        const price = (eval(pricer.drawer_box_pricing) + extraCost) * qty;

        if (height > -1) {
          return Math.floor(price * 100) / 100;
        } else {
          return 0;
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
