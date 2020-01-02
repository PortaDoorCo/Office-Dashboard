// ((((width + depth) / (height)) / 144) x material) + design + finish + notch

import { createSelector } from "reselect";
import numQty from "numeric-quantity";

const partListSelector = state => {
  const orders = state.form.DrawerOrder;

  if (state.part_list.loadedDrawerFinishes) {
    if (orders) {
      if (!state.form.DrawerOrder.values.part_list) {
        return [];
      } else {
        return state.form.DrawerOrder.values.part_list;
      }
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const taxRate = state => {
  const orders = state.form.DrawerOrder;

  if (state.part_list.loadedDrawerFinishes) {
    if (orders) {
      if (!orders.values.jobInfo) {
        return [];
      } else {
        return state.form.DrawerOrder.values.jobInfo.customer.TaxRate;
      }
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const itemPriceSelector = createSelector(
  [partListSelector],
  (parts) =>
    parts.map((part, index) => {
      console.log(part)
      const wood = part.woodtype.PRICE;
      const assembly = part.assembly.Price;
      const finish = part.drawerFinishes.Price;
      const notchDrill = part.notchDrill.Price;

      // console.log(part.dimensions);

      if (part.dimensions) {
        const linePrice = part.dimensions.map(i => {
          let widths = numQty(i.width);
          let heights = numQty(i.height);
          let depths = numQty(i.depth)

          // console.log(i);

          const price =
            (((((((Math.ceil(widths) + (Math.ceil(depths) * 2)) * heights) / 144) * wood) + (assembly + finish + notchDrill))

            ))

          if (heights > -1) {
            return price;
          } else {
            return 0;
          }
        });
        return linePrice;
      } else {
        return 0;
      }
    })
);

export const linePriceSelector = createSelector(
  [partListSelector],
  (parts) =>
    parts.map((part, index) => {
      console.log(part)
      const wood = part.woodtype.PRICE;
      const assembly = part.assembly.Price;
      const finish = part.drawerFinishes.Price;
      const notchDrill = part.notchDrill.Price;


      if (part.dimensions) {
        const linePrice = part.dimensions.map(i => {
          let widths = numQty(i.width);
          let heights = numQty(i.height);
          let depths = numQty(i.depth)

          // console.log(i);

          const price =
            (((((((Math.ceil(widths) + (Math.ceil(depths) * 2)) * heights) / 144) * wood) + (assembly + finish + notchDrill)) * parseInt(i.qty)

            ))

          if (heights > -1) {
            return price;
          } else {
            return 0;
          }
        });
        return linePrice;
      } else {
        return 0;
      }
    })
);

export const addPriceSelector = createSelector(
  [partListSelector],
  (parts) =>
    parts.map((part, index) => {
      const addPrice = part.addPrice
      if (part.addPrice) {
        return parseFloat(part.addPrice);
      } else {
        return 0;
      }
    })
);

export const subTotalSelector = createSelector(
  [linePriceSelector, addPriceSelector],
  (prices, add) =>
    prices.map((i, index) => {
      if (i) {
        let price = parseFloat(i.reduce((acc, item) => acc + item, 0))
        let sum = price += add[index]
        return sum
      } else {
        return 0;
      }
    })
);

export const taxSelector = createSelector(
  [subTotalSelector, taxRate],
  (subTotal, tax) => subTotal.reduce((acc, item) => acc + item, 0) * tax
);

export const totalSelector = createSelector(
  [subTotalSelector, taxSelector],
  (subTotal, tax) => subTotal.reduce((acc, item) => acc + item, 0) + tax
);


