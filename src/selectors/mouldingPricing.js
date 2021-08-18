import { createSelector } from 'reselect';
import numQty from 'numeric-quantity';

const discountSelector = (state) => {
  const orders = state?.form?.Mouldings;

  if (orders) {
    if (!state?.form?.Mouldings?.values?.discount) {
      return 0;
    } else {
      if (state.form.Mouldings.values.discount > 0) {
        return numQty(state.form.Mouldings.values.discount) / 100;
      } else {
        return 0;
      }
    }
  } else {
    return 0;
  }
};

const miscItemsSelector = (state) => {
  const orders = state.form.Mouldings;
  if (orders) {
    if (
      state.form.Mouldings.values &&
      state.form.Mouldings.values.misc_items &&
      state.form.Mouldings.values.misc_items.length > 0
    ) {
      return state.form.Mouldings.values.misc_items;
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

const mouldingsSelector = (state) => {
  const orders = state.form.Mouldings;

  if (orders) {
    if (
      orders &&
      orders.values &&
      orders.values.mouldings &&
      orders.values.mouldings.length > 0
    ) {
      return (
        state.form.Mouldings &&
        state.form.Mouldings.values &&
        state.form.Mouldings.values.mouldings
      );
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const mouldingPriceSelector = createSelector(
  [mouldingsSelector],
  (mouldings) =>
    mouldings.map((i) => {
      let price = 0;

      if (i.item) {
        const { item, woodtype, linearFT, grade } = i;

        let feet = (item.MOULDING_WIDTH * 12) / 144;
        let waste = feet * 1.25;
        let multiplier = item.Multiplier;
        let wood = woodtype ? woodtype[grade?.db_name] * 0.25 : 0;
        let premium = 0;

        let newWood = wood;

        if(multiplier <= 1){
          newWood = wood;
        } else {
          newWood = wood * 1.25;
        }

        let a = waste * multiplier;

        if (parseFloat(linearFT) > 0 && parseFloat(linearFT) <= 30) {
          premium = 3 + 1;
        } else if (parseFloat(linearFT) >= 31 && parseFloat(linearFT) <= 50) {
          premium = 2 + 1;
        } else if (parseFloat(linearFT) >= 51 && parseFloat(linearFT) <= 100) {
          premium = 1.75 + 1;
        } else if (parseFloat(linearFT) > 101 && parseFloat(linearFT) <= 250) {
          premium = 1.4 + 1;
        } else if (parseFloat(linearFT) > 251 && parseFloat(linearFT) <= 500) {
          premium = 1.1 + 1;
        } else {
          premium = 1 + 1;
        }

        price = ((a * newWood) * parseFloat(linearFT)) * premium;
      }

      return price;
    })
);

export const mouldingLinePriceSelector = createSelector(
  [mouldingPriceSelector, mouldingsSelector],
  (pricer, parts, item) =>
    pricer.map((i, index) => {
      const price = i ? i : 0;

      return price;
    })
);

export const mouldingTotalSelector = createSelector(
  [mouldingLinePriceSelector],
  (misc) => misc.reduce((acc, item) => acc + item, 0)
);

const taxRate = (state) => {
  const orders = state?.form?.Mouldings;

  if (orders) {
    if (!orders.values?.job_info) {
      return 0;
    } else {
      if (
        state.form &&
        state.form.Mouldings &&
        state.form.Mouldings.values &&
        state.form.Mouldings.values.Taxable
      ) {
        return state.form.Mouldings.values.job_info.customer.TaxRate / 100;
      } else {
        return 0;
      }
    }
  } else {
    return 0;
  }
};

const totalBalanceDue = (state) => {
  const orders = state.form.Mouldings;
  if (orders) {
    if (!orders && !orders.values && !orders.values.balance_history) {
      return [];
    } else {
      return state.form.Mouldings.values.balance_history.map((i) => {
        return i.balance_paid;
      });
    }
  } else {
    return [];
  }
};

export const mouldingLineItemSelector = createSelector(
  [mouldingsSelector],
  (misc) => misc
);

export const subTotalSelector = createSelector(
  [mouldingTotalSelector],
  (misc) => misc
);

export const subTotal_Total = createSelector(
  [mouldingTotalSelector],
  (subTotal, misc) =>
    subTotal.length > 0 ? subTotal.reduce((acc, item) => acc + item, 0) : 0
);



export const totalDiscountSelector = createSelector(
  [mouldingTotalSelector, miscTotalSelector, discountSelector],
  (subTotal, misc, discount) => {
    return (subTotal + misc) * discount;
  }
);

export const taxSelector = createSelector(
  [mouldingTotalSelector, totalDiscountSelector, taxRate],
  (subTotal,discount, tax) => (subTotal - discount) * tax
);

export const totalSelector = createSelector(
  [
    mouldingTotalSelector,
    taxSelector,
    miscTotalSelector,
    totalDiscountSelector,
  ],
  (subTotal, tax, misc, discount) => {
    return subTotal + tax + misc - discount;
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
