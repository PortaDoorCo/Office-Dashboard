// ((((width + depth) / (height)) / 144) x material) + design + finish + notch

import { createSelector } from "reselect";
import numQty from "numeric-quantity";


const pricingSelector = state => {
  const pricing = state.part_list.pricing ? state.part_list.pricing[0] : 0;
  return pricing
}

const partListSelector = state => {
  const orders = state.form.DrawerOrder;

  if (state.part_list.loadedBoxWoodtypes) {
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

  if (state.part_list.loadedBoxWoodtypes) {
    if (orders) {
      if (!orders.values.job_info) {
        return [];
      } else {
        return state.form.DrawerOrder.values.job_info.customer.TaxRate;
      }
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const totalBalanceDue = state => {
  const orders = state.form.DrawerOrder;
    if (orders) {
      if (!orders.values.balance_history) {
        return [];
      } else {
        return state.form.DrawerOrder.values.balance_history.map(i => {
          return i.balance_paid
        });
      }
    } else {
      return [];
    }
};

export const itemPriceSelector = createSelector(
  [partListSelector, pricingSelector],
  (parts, pricer) =>
    parts.map((part, index) => {

    

      const wood = part.box_woodtype ? part.box_woodtype.STANDARD_GRADE : 0;
      const finish = part.box_finish ? part.box_finish.UPCHARGE : 0;
      const notchDrill = part.box_notch ? part.box_notch.PRICE : 0;

    

      if (part.dimensions) {
        const linePrice = part.dimensions.map(i => {
          const width = Math.ceil(numQty(i.width));
          const height = Math.ceil(numQty(i.height));
          const depth = Math.ceil(numQty(i.depth))

          const price = eval(pricer.drawer_box_pricing)

          if (height > -1) {
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
  [partListSelector, pricingSelector],
  (parts, pricer) =>
    parts.map((part, index) => {

    

      const wood = part.box_woodtype ? part.box_woodtype.STANDARD_GRADE : 0;
      const finish = part.box_finish ? part.box_finish.UPCHARGE : 0;
      const notchDrill = part.box_notch ? part.box_notch.PRICE : 0;



      if (part.dimensions) {
        const linePrice = part.dimensions.map(i => {
          const width = Math.ceil(numQty(i.width));
          const height = Math.ceil(numQty(i.height));
          const depth = Math.ceil(numQty(i.depth))

          const price = eval(pricer.drawer_box_pricing)

          if (height > -1) {
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

export const subTotal_Total = createSelector(
  [subTotalSelector],
  (subTotal) =>subTotal.reduce((acc, item) => acc + item, 0)
);

export const taxSelector = createSelector(
  [subTotalSelector, taxRate],
  (subTotal, tax) => subTotal.reduce((acc, item) => acc + item, 0) * tax
);

export const totalSelector = createSelector(
  [subTotalSelector, taxSelector],
  (subTotal, tax) => subTotal.reduce((acc, item) => acc + item, 0) + tax
);



export const balanceTotalSelector = createSelector(
  [totalBalanceDue],
  (balance) => balance.reduce((acc, item) => acc + item, 0)
);

export const balanceSelector = createSelector(
  [totalSelector, balanceTotalSelector],
  (total, balance) => total - balance
);