import { createSelector } from 'reselect';
import numQty from 'numeric-quantity';


const discountSelector = state => {
  const orders = state.form.Mouldings;

  if (orders) {
    if ((!state.form.Mouldings.values && !state.form.Mouldings.values.discount)) {
      return 0;
    } else {
      if(state.form.Mouldings.values.discount.length > 0){
        return (numQty(state.form.Mouldings.values.discount) / 100);
      } else {
        return 0;
      }
    }
  } else {
    return 0;
  }
};

const miscItemsSelector = state => {
  const orders = state.form.Mouldings;

  if (orders) {
    if ((!orders.values && !orders.values.mouldings && !orders.values.mouldings.length > 0)) {
      return [];
    } else {
      return state.form.Mouldings.values.mouldings;
    }
  } else {
    return [];
  }
};

export const miscItemPriceSelector = createSelector(
  [miscItemsSelector],
  (misc) => misc.map(i => {
    let price = 0;

    if(i.item){
      console.log({i});

      const { item } = i;

      let feet = (item.MOULDING_WIDTH * 12) / 144;
      let waste = feet * 1.25;
      let thickness = item.MOULDING_THICKNESS;

      let a = waste * thickness;

      console.log({feet});
      console.log({waste});
      console.log({thickness});
      console.log({a});

    }
    
   
    return price;
  })
);



export const miscItemLinePriceSelector = createSelector(
  [miscItemsSelector, miscItemPriceSelector],
  (parts, pricer, item) =>
    parts.map((i, index) => {
      let price = 0;
      if(i.category === 'preselect'){
        if(i.item) {
          if(i.qty){
            price = pricer[index] * parseFloat(i.qty);
          } else {
            price = 0;
          }
        }else{
          price = 0;
        }
      }else {
        if(i.pricePer){
          if(i.qty){
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
  (misc) => (misc.reduce((acc, item) => acc + item, 0))
);

const taxRate = state => {
  const orders = state.form.Mouldings;

  if (orders) {
    if (!orders.values.job_info) {
      return 0;
    } else {
      if(state.form && state.form.Mouldings && state.form.Mouldings.values && state.form.Mouldings.values.Taxable){
        return (state.form.Mouldings.values.job_info.customer.TaxRate / 100);
      } else {
        return 0;
      }
    }
  } else {
    return 0;
  }
};




const totalBalanceDue = state => {
  const orders = state.form.Mouldings;
  if (orders) {
    if (!orders && !orders.values && !orders.values.balance_history) {
      return [];
    } else {
      return state.form.Mouldings.values.balance_history.map(i => {
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