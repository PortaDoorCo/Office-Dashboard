// ((((width + depth) / (height)) / 144) x material) + design + finish + notch

import { createSelector } from 'reselect';
import numQty from 'numeric-quantity';


const pricingSelector = state => {
  const pricing = state.part_list.pricing ? state.part_list.pricing[0] : 0;
  return pricing;
};


const discountSelector = state => {
  const orders = state.form.DrawerOrder;

  if (orders) {
    if ((!state.form.DrawerOrder.values && !state.form.DrawerOrder.values.discount)) {
      return 0;
    } else {
      if(state.form.DrawerOrder.values.discount.length > 0){
        return (numQty(state.form.DrawerOrder.values.discount) / 100);
      } else {
        return 0;
      }
    }
  } else {
    return 0;
  }
};

const partListSelector = state => {
  const orders = state.form.DrawerOrder;
  if (orders) {
    if (!state.form.DrawerOrder && !state.form.DrawerOrder.values && !state.form.DrawerOrder.values.part_list) {
      return [];
    } else {
      return state.form.DrawerOrder.values.part_list;
    }
  } else {
    return [];
  }
};

const miscItemsSelector = state => {
  const orders = state.form.DrawerOrder;
  if (orders) {
    if ((!state.form.DrawerOrder.values && !state.form.DrawerOrder.values.misc_items.length > 0)) {
      return [];
    } else {
      return state.form.DrawerOrder.values.misc_items;
    }
  } else {
    return [];
  }
};

export const miscItemPriceSelector = createSelector(
  [miscItemsSelector],
  (misc ) => misc.map(i => {
    let price = 0;
    console.log(i);
    if(i.category === 'preselect'){
      if(i.item) {
        price = i.item.Price;
      }else{
        price = 0;
      }
    }else {
      if(i.pricePer){
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
  const orders = state.form.DrawerOrder;
  if (orders) {
    if (!orders.values.job_info) {
      return [];
    } else {
      if(state.form && state.form.DrawerOrder && state.form.DrawerOrder.values && state.form.DrawerOrder.values.Taxable){
        return (state.form.DrawerOrder.values.job_info.customer.TaxRate / 100);
      } else {
        return 0;
      }
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
        return i.balance_paid;
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
          const depth = Math.ceil(numQty(i.depth));

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

    

      const wood = part.box_woodtype ? part.box_woodtype.STANDARD_GRADE : 0;
      const finish = part.box_finish ? part.box_finish.UPCHARGE : 0;
      const notchDrill = part.box_notch ? part.box_notch.PRICE : 0;



      if (part.dimensions) {
        const linePrice = part.dimensions.map(i => {
          const width = Math.ceil(numQty(i.width));
          const height = Math.ceil(numQty(i.height));
          const depth = Math.ceil(numQty(i.depth));
          const qty = parseInt(i.qty); 
          const extraCost = i.extraCost ? parseFloat(i.extraCost) : 0;

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
        let price = parseFloat(i.reduce((acc, item) => acc + item, 0));
        let sum = price += add[index];
        return sum;
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

export const totalDiscountSelector = createSelector(
  [subTotalSelector, miscTotalSelector, discountSelector],
  (subTotal, misc, discount) => {
    return (subTotal.reduce((acc, item) => acc + item, 0)) * discount;
  }
);


export const totalSelector = createSelector(
  [subTotalSelector, taxSelector, miscTotalSelector, totalDiscountSelector],
  (subTotal, tax, misc, discount) => {
    return subTotal.reduce((acc, item) => acc + item, 0) + tax + misc - discount;
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