import { createSelector } from 'reselect';
import numQty from 'numeric-quantity';


const discountSelector = state => {
  const orders = state.form.MiscItems;

  if (orders) {
    if ((!state.form.MiscItems.values && !state.form.MiscItems.values.discount)) {
      return 0;
    } else {
      if(state.form.MiscItems.values.discount.length > 0){
        return (numQty(state.form.MiscItems.values.discount) / 100);
      } else {
        return 0;
      }
    }
  } else {
    return 0;
  }
};

const miscItemsSelector = state => {
  const orders = state.form.MiscItems;
  if (orders) {

    if(state.form && state.form.MiscItems && state.form.MiscItems.values && state.form.MiscItems.values.misc_items && state.form.MiscItems.values.misc_items.length > 0) {
      return state.form.MiscItems.values.misc_items.map(i => {
        if(i.price) {
          return parseFloat(i.price2);
        }
        if(i.price2){
          return parseFloat(i.price2) * parseInt(i.qty);
        }
        else {
          return 0;
        }
      });
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const taxRate = state => {
  const orders = state.form.MiscItems;

  if (orders) {
    if (!orders.values.job_info) {
      return 0;
    } else {
      if(state.form && state.form.MiscItems && state.form.MiscItems.values && state.form.MiscItems.values.Taxable){
        return (state.form.MiscItems.values.job_info.customer.TaxRate / 100);
      } else {
        return 0;
      }
    }
  } else {
    return 0;
  }
};




const totalBalanceDue = state => {
  const orders = state.form.MiscItems;
  if (orders) {
    if (!orders && !orders.values && !orders.values.balance_history) {
      return [];
    } else {
      return state.form.MiscItems.values.balance_history.map(i => {
        return i.balance_paid;
      });
    }
  } else {
    return [];
  }
};

export const miscLineItemSelector = createSelector(
  [miscItemsSelector],
  (misc) => misc
);

export const miscTotalSelector = createSelector(
  [miscItemsSelector],
  (misc) => (misc.reduce((acc, item) => acc + item, 0))
);



export const subTotalSelector = createSelector(
  [miscTotalSelector],
  (misc) =>
    misc
);

export const subTotal_Total = createSelector(
  [subTotalSelector, miscTotalSelector],
  (subTotal, misc) => subTotal.reduce((acc, item) => acc + item, 0)
);

export const taxSelector = createSelector(
  [subTotalSelector, taxRate],
  (subTotal, tax) => (subTotal * tax)
);

export const totalDiscountSelector = createSelector(
  [subTotalSelector, miscTotalSelector, discountSelector],
  (subTotal, misc, discount) => {
    return (subTotal + misc) * discount;
  }
);

export const totalSelector = createSelector(
  [subTotalSelector, taxSelector, miscTotalSelector, totalDiscountSelector],
  (subTotal, tax, misc, discount) => {
    return tax + misc - discount;
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