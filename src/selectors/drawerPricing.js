// ((((width + depth) / (height)) / 144) x material) + design + finish + notch

import { createSelector } from 'reselect';
import numQty from 'numeric-quantity';

const pricingSelector = (state) => {
  const pricing = state.part_list.pricing ? state.part_list.pricing[0] : 0;
  return pricing;
};

const discountSelector = (state) => {
  const orders = state.form.Order;

  if (orders) {
    if (
      state.form.Order.values &&
      state.form.Order.values.discount
    ) {
      if (state.form.Order.values.discount > 0) {
        return numQty(state.form.Order.values.discount) / 100;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

const partListSelector = (state) => {
  const orders = state.form.Order;
  if (orders) {
    if (
      state.form.Order &&
      state.form.Order.values &&
      state.form.Order.values.part_list
    ) {
      return state.form.Order.values.part_list;
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const miscItemsSelector = (state) => {
  const orders = state.form.Order;
  if (orders) {
    if (
      state.form.Order.values &&
      state.form.Order.values.misc_items &&
      state.form.Order.values.misc_items.length > 0
    ) {
      return state.form.Order.values.misc_items;
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const miscItemPriceSelector = createSelector(
  [miscItemsSelector],
  (misc) =>
    misc.map((i) => {
      let price = 0;

      if (i.category === 'preselect') {
        if (i.price) {
          price = parseFloat(i.price);
        } else {
          price = 0;
        }
      } else {
        if (i.pricePer) {
          price = parseFloat(i.pricePer);
        } else {
          price = 0;
        }
      }
      return price;
    })
);

export const miscItemLinePriceSelector = createSelector(
  [miscItemsSelector, miscItemPriceSelector],
  (parts, pricer, item) =>
    parts.map((i, index) => {
      let price = 0;
      if (i.category === 'preselect') {
        if (i.item) {
          if (i.qty) {
            price = pricer[index] * parseFloat(i.qty);
          } else {
            price = 0;
          }
        } else {
          price = 0;
        }
      } else {
        if (i.pricePer) {
          if (i.qty) {
            price = pricer[index] * parseFloat(i.qty);
          } else {
            price = 0;
          }
        } else {
          price = 0;
        }
      }
      return price;
    })
);

export const miscTotalSelector = createSelector(
  [miscItemLinePriceSelector],
  (misc) => misc.reduce((acc, item) => acc + item, 0)
);

const taxRate = (state) => {
  const orders = state.form.Order;
  if (orders) {
    if (orders.values && orders.values.job_info) {
      if (
        state.form &&
        state.form.Order &&
        state.form.Order.values &&
        state.form.Order.values.Taxable
      ) {
        return state.form.Order.values.job_info.customer.TaxRate / 100;
      } else {
        return 0;
      }
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const totalBalanceDue = (state) => {
  const orders = state.form.Order;
  if (orders) {
    if (orders.values && orders.values.balance_history) {
      return state.form.Order.values.balance_history.map((i) => {
        return i.balance_paid;
      });
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const itemPriceSelector = createSelector(
  [partListSelector, pricingSelector],
  (parts, pricer) =>
    parts.map((part, index) => {
      const wood = part.woodtype ? part.woodtype.STANDARD_GRADE : 0;
      const finish = part.box_finish ? part.box_finish.UPCHARGE : 0;
      const assembly = part.box_assembly ? part.box_assembly.UPCHARGE : 0;
      const notchDrill = part.box_notch ? part.box_notch.PRICE : 0;

      if (part.dimensions) {
        const linePrice = part.dimensions.map((i) => {
          const width = numQty(i.width);
          const height = numQty(i.height);
          const depth = numQty(i.depth);

          const scoop = i.scoop.PRICE;

          const price = eval(pricer.drawer_box_pricing);

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

export const addPriceSelector = createSelector([partListSelector], (parts) =>
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
        let price = parseFloat(i.reduce((acc, item) => acc + item, 0));
        let sum = (price += add[index]);
        return sum;
      } else {
        return 0;
      }
    })
);

export const subTotal_Total = createSelector([subTotalSelector], (subTotal) =>
  subTotal.reduce((acc, item) => acc + item, 0)
);

export const totalDiscountSelector = createSelector(
  [subTotalSelector, miscTotalSelector, discountSelector],
  (subTotal, misc, discount) => {
    return subTotal.reduce((acc, item) => acc + item, 0) * discount;
  }
);

export const taxSelector = createSelector(
  [subTotalSelector, taxRate, totalDiscountSelector, miscTotalSelector],
  (subTotal, tax, discount, misc) => {
    return (
      (subTotal.reduce((acc, item) => acc + item, 0) - discount + misc) * tax
    );
  }
);

export const totalSelector = createSelector(
  [subTotalSelector, taxSelector, miscTotalSelector, totalDiscountSelector],
  (subTotal, tax, misc, discount) => {
    return (
      subTotal.reduce((acc, item) => acc + item, 0) + tax + misc - discount
    );
  }
);

export const balanceTotalSelector = createSelector(
  [totalBalanceDue],
  (balance) => balance.reduce((acc, item) => acc + item, 0)
);

export const balanceSelector = createSelector(
  [totalSelector, balanceTotalSelector],
  (total, balance) => total - balance
);
