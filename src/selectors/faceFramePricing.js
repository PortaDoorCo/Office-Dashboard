import { createSelector } from 'reselect';
import numQty from 'numeric-quantity';

const pricingSelector = (state) => {
  const pricing = state.part_list.pricing ? state.part_list.pricing[0] : 0;
  return pricing;
};

const discountSelector = (state) => {
  const orders = state.form.DoorOrder;

  if (orders) {
    if (state.form.DoorOrder.values && state.form.DoorOrder.values.discount) {
      if (state.form.DoorOrder.values.discount > 0) {
        return numQty(state.form.DoorOrder.values.discount) / 100;
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

const stateSelector = (state) => {
  const orders = state.form.DoorOrder;

  if (orders) {
    if (
      state.form.DoorOrder.values &&
      state.form.DoorOrder.values.job_info &&
      state.form.DoorOrder.values.job_info.State
    ) {
      return state.form.DoorOrder.values.job_info.State;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const partListSelector = (state) => {
  const orders = state.form.DoorOrder;

  if (orders) {
    if (orders && orders.values && orders.values.part_list) {
      return state.form.DoorOrder.values.part_list;
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const miscItemsSelector = (state) => {
  const orders = state.form.DoorOrder;
  if (orders) {
    if (
      state.form.DoorOrder.values &&
      state.form.DoorOrder.values.misc_items &&
      state.form.DoorOrder.values.misc_items.length > 0
    ) {
      return state.form.DoorOrder.values.misc_items;
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
  const orders = state.form.DoorOrder;

  if (orders) {
    if (orders.values && orders.values.job_info) {
      if (
        state.form &&
        state.form.DoorOrder &&
        state.form.DoorOrder.values &&
        state.form.DoorOrder.values.Taxable
      ) {
        return state.form.DoorOrder.values.job_info.customer.TaxRate / 100;
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

const totalBalanceDue = (state) => {
  const orders = state.form.DoorOrder;
  if (orders) {
    if (orders && orders.values && orders.values.balance_history) {
      return state.form.DoorOrder.values.balance_history.map((i) => {
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
  [partListSelector, pricingSelector, discountSelector],
  (parts, pricer, discount) =>
    parts.map((part, index) => {
      const design =
        (part.design && part.thickness.value === 1) ||
        (part.design && part.thickness.value === 2)
          ? part.design.UPCHARGE
          : (part.design && part.thickness.value === 3) ||
            (part.design && part.thickness.value === 4) ||
            (part.design && part.thickness.value === 5) ||
            (part.design && part.thickness.value === 6)
            ? part.design.UPCHARGE_THICK
            : 0;

      let wood;

      switch (part?.thickness?.value) {
        case 2:
          wood = part?.woodtype?.SELECT_GRADE;
          break;
        case 3:
          wood = part?.woodtype?.STANDARD_GRADE_THICK;
          break;
        case 4:
          wood = part?.woodtype?.SELECT_GRADE_THICK;
          break;
        case 5:
          wood = part?.woodtype?.SIX_QUARTER;
          break;
        case 6:
          wood = part?.woodtype?.SIX_QUARTER_THICK;
          break;
        default:
          wood = part?.woodtype?.STANDARD_GRADE;
      }

      const edge = part.edge ? part.edge.UPCHARGE : 0;
      const panel = part.panel ? part.panel.UPCHARGE : 0;
      const applied_profile = part.applied_profile
        ? part.applied_profile.UPCHARGE
        : 0;
      const finish = part.finish ? part.finish.UPCHARGE : 0;

      const ff_opening_cost = part.face_frame_design
        ? part.face_frame_design.opening_cost
        : 0;
      const ff_top_rail_design = part.face_frame_top_rail
        ? part.face_frame_top_rail.UPCHARGE
        : 0;
      const furniture_feet = part.furniture_feet
        ? part.furniture_feet.UPCHARGE
        : 0;

      if (part.dimensions) {
        const linePrice = part.dimensions.map((i) => {
          const extraCost = i.extraCost ? parseFloat(i.extraCost) : 0;

          let width =
            numQty(i.width) <= 24
              ? 18
              : numQty(i.width) >= 24 && numQty(i.width) <= 48
                ? 24
                : 36;
          let height = numQty(i.height);

          if (numQty(i.width) > numQty(i.height)) {
            height =
              numQty(i.width) <= 24
                ? 18
                : numQty(i.width) >= 24 && numQty(i.width) <= 48
                  ? 24
                  : 36;
            width = numQty(i.height);
          }

          const width_input = numQty(i.width);
          const openings = parseInt(i.openings);

          let overcharge = 0;

          if (width_input >= 48 || numQty(i.height) >= 96) {
            overcharge = 100;
          }

          const price = eval(pricer && pricer.face_frame_pricing) + extraCost;

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

export const finishingSelector = createSelector(
  [partListSelector, pricingSelector, discountSelector],
  (parts, pricer, discount) =>
    parts.map((part, index) => {
      if (part.dimensions) {
        const linePrice = part.dimensions.map((i) => {
          const width_input = numQty(i.width);
          const height = numQty(i.height);
          const finish = part.face_frame_finishing
            ? part.face_frame_finishing.PRICE
            : 0;

          const width_finish = width_input >= 35 ? finish * 0.25 : 0;
          const height_finish = height >= 97 ? finish * 0.25 : 0;

          const openings = parseInt(i.openings);
          const opening_add =
            openings > 1 && finish > 0 ? (openings - 1) * 5 : 0;

          const finishing =
            finish + (width_finish + height_finish + opening_add);

          if (height > -1) {
            return finishing;
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
  [partListSelector, pricingSelector, itemPriceSelector],
  (parts, pricer, item) =>
    parts.map((part, index) => {
      if (part.dimensions) {
        return part.dimensions.map((i, p) => {
          if (item[index][p]) {
            if (i.qty) {
              return item[index][p] * parseInt(i.qty);
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        });
      } else {
        return 0;
      }
    })
);

export const subTotalSelector = createSelector(
  [linePriceSelector, miscTotalSelector],
  (prices, finish) =>
    prices.map((i, index) => {
      if (i) {
        let price = parseFloat(i.reduce((acc, item) => acc + item, 0));
        let sum = price;
        return sum;
      } else {
        return 0;
      }
    })
);

export const finishItemSelector = createSelector(
  [finishingSelector, miscTotalSelector],
  (finish, misc) =>
    finish.map((i, index) => {
      if (i) {
        let price = parseFloat(i.reduce((acc, item) => acc + item, 0));
        let sum = price;
        return sum;
      } else {
        return 0;
      }
    })
);

export const subTotal_Total = createSelector(
  [subTotalSelector, miscTotalSelector],
  (subTotal, misc) => subTotal.reduce((acc, item) => acc + item, 0)
);

export const totalDiscountSelector = createSelector(
  [subTotalSelector, miscTotalSelector, discountSelector],
  (subTotal, misc, discount) => {
    return subTotal.reduce((acc, item) => acc + item, 0) * discount;
  }
);

export const finishTotalSelector = createSelector(
  [finishItemSelector],
  (finish) => {
    return parseFloat(finish.reduce((acc, item) => acc + item, 0));
  }
);

export const taxSelector = createSelector(
  [
    subTotalSelector,
    taxRate,
    totalDiscountSelector,
    discountSelector,
    miscTotalSelector,
    stateSelector,
    finishTotalSelector,
  ],
  (subTotal, tax, discount, dis, misc, state, finish) => {
    return (
      (subTotal.reduce((acc, item) => acc + item, 0) -
        discount +
        misc +
        finish) *
      tax
    );
  }
);

export const totalSelector = createSelector(
  [
    subTotalSelector,
    taxSelector,
    miscTotalSelector,
    totalDiscountSelector,
    finishTotalSelector,
  ],
  (subTotal, tax, misc, discount, finish) => {
    return (
      subTotal.reduce((acc, item) => acc + item, 0) +
      finish +
      tax +
      misc -
      discount
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
