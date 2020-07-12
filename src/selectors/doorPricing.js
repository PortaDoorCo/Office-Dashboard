import { createSelector } from "reselect";
import numQty from "numeric-quantity";


const pricingSelector = state => {
  const pricing = state.part_list.pricing ? state.part_list.pricing[0] : 0;
  return pricing
}

const partListSelector = state => {
  const orders = state.form.DoorOrder;

  if (orders) {
    if ((!state.form.DoorOrder.values && !state.form.DoorOrder.values.part_list)) {
      return [];
    } else {
      return state.form.DoorOrder.values.part_list;
    }
  } else {
    return [];
  }

};

const taxRate = state => {
  const orders = state.form.DoorOrder;
    if (orders) {
      if (!orders.values.job_info) {
        return [];
      } else {
        return state.form.DoorOrder.values.job_info.customer.TaxRate;
      }
    } else {
      return [];
    }
};

const balance = state => {
  const orders = state.form.DoorOrder;
    if (orders) {
      if (!orders.values.pay_balance) {
        return 0;
      } else {
        return parseFloat(state.form.DoorOrder.values.pay_balance);
      }
    } else {
      return 0;
    }
};

const balanceDue = state => {
  const orders = state.form.DoorOrder;
    if (orders) {
      if (!orders.values.balance_due) {
        return 0;
      } else {
        return parseFloat(state.form.DoorOrder.values.balance_due);
      }
    } else {
      return 0;
    }
};


const totalBalanceDue = state => {
  const orders = state.form.DoorOrder;
    if (orders) {
      if (!orders.values.balance_history) {
        return [];
      } else {
        return state.form.DoorOrder.values.balance_history.map(i => {
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
     
      const wood = part.woodtype && part.thickness.value === 0.75 ? part.woodtype.STANDARD_GRADE : (part.woodtype && part.thickness.value === 1) ? part.woodtype.STANDARD_GRADE_THICK :  0;
      const design = part.design && part.thickness.value === 0.75 ? part.design.UPCHARGE : (part.design && part.thickness.value === 1) ? part.design.UPCHARGE_THICK :  0;
      const edge = part.edge ? part.edge.UPCHARGE : 0;
      const panel = part.panel ? part.panel.UPCHARGE : 0;
      const applied_profile = part.applied_profile ? part.applied_profile.UPCHARGE : 0;
      const finish = part.finish ? part.finish.UPCHARGE : 0;
      const lites = part.lites ? part.lites.UPCHARGE : 0
      const ff_opening_cost = part.design && part.orderType.value === "Face_Frame" ? part.design.opening_cost : 0
      const ff_top_rail_design = part.face_frame_top_rail ? part.face_frame_top_rail.UPCHARGE : 0
      const furniture_feet = part.furniture_feet ? part.furniture_feet.UPCHARGE : 0

      

      if (part.orderType.value === "Face_Frame") {
        if (part.dimensions) {
          const linePrice = part.dimensions.map(i => {
        
            const width = Math.ceil(numQty(i.width));
            const height = Math.ceil(numQty(i.height));
            const openings = parseInt(i.openings)
            const qty = parseInt(i.qty) 

            const price = eval(pricer.face_frame_pricing)
              || 0;

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
      } else {
        if (part.dimensions) {
          const linePrice = part.dimensions.map(i => {
            const width = Math.ceil(numQty(i.width));
            const height = Math.ceil(numQty(i.height));
            const qty = parseInt(i.qty)

            const price = eval(pricer.door_pricing)
            || 0

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
      }
    })
);


export const linePriceSelector = createSelector(
  [partListSelector, pricingSelector],
  (parts, pricer) =>
    parts.map((part, index) => {

      const wood = part.woodtype && part.thickness.value === 0.75 ? part.woodtype.STANDARD_GRADE : part.woodtype && part.thickness.value === 1 ? part.woodtype.STANDARD_GRADE_THICK :  0;
      const design = part.design && part.thickness.value === 0.75 ? part.design.UPCHARGE : part.design && part.thickness.value === 1 ? part.design.UPCHARGE_THICK :  0;
      const edge = part.edge ? part.edge.UPCHARGE : 0;
      const panel = part.panel ? part.panel.UPCHARGE : 0;
      const applied_profile = part.applied_profile ? part.applied_profile.UPCHARGE : 0;
      const finish = part.finish ? part.finish.UPCHARGE : 0;
      const lites = part.lites ? part.lites.UPCHARGE : 0
      const ff_opening_cost = part.design ? part.design.opening_cost : 0
      const ff_top_rail_design = part.face_frame_top_rail ? part.face_frame_top_rail.UPCHARGE : 0
      const furniture_feet = part.furniture_feet ? part.furniture_feet.UPCHARGE : 0




      if (part.orderType.value === "Face_Frame") {
        if (part.dimensions) {
          const linePrice = part.dimensions.map(i => {
           
            const width = Math.ceil(numQty(i.width));
            const height = Math.ceil(numQty(i.height));
            const openings = parseInt(i.openings)
            const qty = parseInt(i.qty) 

            const price = eval(pricer.face_frame_pricing)
              || 0;

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
      } else {
        if (part.dimensions) {
          const linePrice = part.dimensions.map(i => {
            const width = Math.ceil(numQty(i.width));
            const height = Math.ceil(numQty(i.height));
            const qty = parseInt(i.qty)

            const price = eval(pricer.door_pricing)
              || 0;

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

  (subTotal, tax) =>(subTotal.reduce((acc, item) => acc + item, 0) * tax)
);

export const totalSelector = createSelector(
  [subTotalSelector, taxSelector],
  (subTotal, tax) => (subTotal.reduce((acc, item) => acc + item, 0) + tax)
);


export const balanceTotalSelector = createSelector(
  [totalBalanceDue],
  (balance) => balance.reduce((acc, item) => acc + item, 0)
);

export const balanceSelector = createSelector(
  [totalSelector, balanceTotalSelector],
  (total, balance) => total - balance
);