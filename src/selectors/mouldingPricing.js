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

      const { item, moulding_material, linearFT, thickness } = i;

      let material_thickness = 0.75;
      let feet = (item.MOULDING_WIDTH * 12) / 144;
      let waste = feet * 1.25;
      let multiplier = item.Multiplier;
      let wood = 0;
      let premium = 0;

      let a = waste * multiplier;

      if(thickness.value === 0.75){
        wood = moulding_material ? moulding_material.STANDARD_GRADE : 0;
      } else if (thickness.value === 1) {
        wood = moulding_material ? moulding_material.STANDARD_GRADE_THICK : 0;
      } else {
        wood = 0;
      }
      
      if(parseFloat(linearFT) > 0 && parseFloat(linearFT) <= 30) {
        premium = 3 + 1;
      } else if (parseFloat(linearFT) >= 31 && parseFloat(linearFT) <= 50) {
        premium = 2 + 1;
      } else if (parseFloat(linearFT) >= 51 && parseFloat(linearFT) <= 100) {
        premium = 1.75 + 1;
      } else if(parseFloat(linearFT) > 101 && parseFloat(linearFT) <= 250) {
        premium = 1.4 + 1;
      } else if (parseFloat(linearFT) > 251 && parseFloat(linearFT) <= 500) {
        premium = 1.1 + 1;
      } else {
        premium = 1 + 1;
      }

      price = ((a * wood) * parseFloat(linearFT)) * premium;

    }
    
   
    return price;
  })
);



export const miscItemLinePriceSelector = createSelector(
  [miscItemPriceSelector, miscItemsSelector],
  (pricer, parts, item) =>
    pricer.map((i, index) => {
    
      const qty = parts[index].qty ? parts[index].qty : 0;
      const price = i ? i : 0;

      return price * parseInt(qty);
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