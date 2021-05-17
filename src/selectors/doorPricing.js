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
    console.log({ orders });
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
      let design = 0;

      if (part.cope_design) {
        design =
          part.cope_design && part.thickness.value === 0.75
            ? part.cope_design.UPCHARGE
            : part.cope_design && part.thickness.value === 1
              ? part.cope_design.UPCHARGE_THICK
              : 0;
      }

      if (part.cope_df_design) {
        design =
          part.cope_df_design && part.thickness.value === 0.75
            ? part.cope_df_design.UPCHARGE
            : part.cope_df_design && part.thickness.value === 1
              ? part.cope_df_design.UPCHARGE_THICK
              : 0;
      }

      if (part.miter_design) {
        design =
          part.miter_design && part.thickness.value === 0.75
            ? part.miter_design.UPCHARGE
            : part.miter_design && part.thickness.value === 1
              ? part.miter_design.UPCHARGE_THICK
              : 0;
      }

      if (part.mt_design) {
        design =
          part.mt_design && part.thickness.value === 0.75
            ? part.mt_design.UPCHARGE
            : part.mt_design && part.thickness.value === 1
              ? part.mt_design.UPCHARGE_THICK
              : 0;
      }

      if (part.miter_df_design) {
        design =
          part.miter_df_design && part.thickness.value === 0.75
            ? part.miter_df_design.UPCHARGE
            : part.miter_df_design && part.thickness.value === 1
              ? part.miter_df_design.UPCHARGE_THICK
              : 0;
      }

      if (part.mt_df_design) {
        design =
          part.mt_df_design && part.thickness.value === 0.75
            ? part.mt_df_design.UPCHARGE
            : part.mt_df_design && part.thickness.value === 1
              ? part.mt_df_design.UPCHARGE_THICK
              : 0;
      }

      const wood =
        part.woodtype && part.thickness.value === 0.75
          ? part.woodtype.STANDARD_GRADE
          : part.woodtype && part.thickness.value === 1
            ? part.woodtype.STANDARD_GRADE_THICK
            : 0;
      // const design = part.design && part.thickness.value === 0.75 ? part.design.UPCHARGE : (part.design && part.thickness.value === 1) ? part.design.UPCHARGE_THICK :  0;
      const edge = part.edge ? part.edge.UPCHARGE : 0;
      const panel = part.panel ? part.panel.UPCHARGE : 0;
      const applied_profile = part.applied_profile
        ? part.applied_profile.UPCHARGE
        : 0;
      const finish = part.finish ? part.finish.UPCHARGE : 0;

      const ff_opening_cost =
        part.design && part.orderType.value === 'Face_Frame'
          ? part.design.opening_cost
          : 0;
      const ff_top_rail_design = part.face_frame_top_rail
        ? part.face_frame_top_rail.UPCHARGE
        : 0;
      const furniture_feet = part.furniture_feet
        ? part.furniture_feet.UPCHARGE
        : 0;

      if (part.orderType.value === 'Face_Frame') {
        if (part.dimensions) {


          console.log('HEREJKLSDJFDSKLFJSDFLKJ');

          const linePrice = part.dimensions.map((i) => {


            console.log({i});

            const width = Math.ceil(numQty(i.width));
            const height = Math.ceil(numQty(i.height));
            const openings = parseInt(i.openings);
            const qty = parseInt(i.qty);
            const extraCost = i.extraCost ? parseFloat(i.extraCost) : 0;
            const panelsH = parseInt(i.panelsH) > 1 ? parseInt(i.panelsH) : 1;
            const panelsW = parseInt(i.panelsW) > 1 ? parseInt(i.panelsW) : 1;

            const price = eval(pricer && pricer.face_frame_pricing);

            if (height > -1) {
              return price;
            } else {
              return 0;
            }
          });

          console.log({linePrice});

          return linePrice;
        } else {
          return 0;
        }
      } else {
        if (part.dimensions) {
          const linePrice = part.dimensions.map((i) => {


            console.log({i});


            const width = Math.ceil(numQty(i.width));
            const height = Math.ceil(numQty(i.height));
            const qty = parseInt(i.qty);
            const extraCost = i.extraCost ? parseFloat(i.extraCost) : 0;
            const panelsH = parseInt(i.panelsH);
            const panelsW = parseInt(i.panelsW);

            //add lite pricing here
            // const lites = i.lite ? i.lite.UPCHARGE : 0;

            const litePriceArray = Array.from(
              panelsH ? Array(
                parseInt(panelsH)
              ).keys() : 0
            )
              .map((j, index) => {
                return eval(`i.lite_${index}`) ? eval(`i.lite_${index}.UPCHARGE`) : 0;
              });


            const lites = litePriceArray.reduce((acc, item) => acc + item, 0);



              



            let leftStileAdd = 0;
            let rightStileAdd = 0;
            let topRailAdd = 0;
            let bottomRailAdd = 0;

            const calcPrice = (add, part, price, w) => {
              const width = w;
              const difference = numQty(part) - width;
              const calc = (difference * 10) + price;
              const priceDifference = calc - price;

              switch (add) {
                case 'leftStileAdd':
                  leftStileAdd = priceDifference / 4;
                  break;
                case 'rightStileAdd':
                  rightStileAdd = priceDifference / 4;
                  break;
                case 'topRailAdd':
                  topRailAdd = priceDifference / 4;
                  break;
                case 'bottomRailAdd':
                  bottomRailAdd = priceDifference / 4;
                  break;
                default:
                  // code block
                  break;
              }
            };

            const leftStileCalc = (p, price) => {
              return calcPrice('leftStileAdd', eval('i.leftStile'), price, p);
            };

            const rightStileCalc = (p, price) => {
              return calcPrice('rightStileAdd', eval('i.rightStile'), price, p);
            };

            const topRailCalc = (p, price) => {
              return calcPrice('topRailAdd', eval('i.topRail'), price, p);
            };

            const bottomRailCalc = (p, price) => {
              return calcPrice('bottomRailAdd', eval('i.bottomRail'), price, p);
            };

            const calc = (part, design, price) => {
              switch (part) {
                case 'leftStile':
                  leftStileCalc(design, price);
                  break;
                case 'rightStile':
                  rightStileCalc(design, price);
                  break;
                case 'topRail':
                  topRailCalc(design, price);
                  break;
                case 'bottomRail':
                  bottomRailCalc(design, price);
                  break;
                default:
                  return 0;
              }
            };

            if (part.construction.value === 'Cope') {
              if (
                part.orderType.value === 'DF' ||
                part.orderType.value === 'One_Piece_DF' ||
                part.orderType.value === 'Two_Piece_DF' ||
                part.orderType.value === 'Glass_DF'
              ) {
                let price = 0;

                if (part.thickness.value === 0.75) {
                  if (part.cope_df_design) {
                    price = part.cope_df_design && part.cope_df_design.UPCHARGE;
                  } else {
                    price = 0;
                  }
                }

                if (part.thickness.value === 1) {
                  if (part.cope_df_design) {
                    price = part.cope_df_design && part.cope_df_design.UPCHARGE_THICK;
                  } else {
                    price = 0;
                  }
                }

                //leftStile
                if (
                  part.profile &&
                  part.profile.MINIMUM_STILE_WIDTH !== numQty(i.leftStile)
                ) {
                  calc('leftStile', part.profile.MINIMUM_STILE_WIDTH, price);
                }
                //rightStile
                if (
                  part.profile &&
                  part.profile.MINIMUM_STILE_WIDTH !== numQty(i.rightStile)
                ) {
                  calc('rightStile', part.profile.MINIMUM_STILE_WIDTH, price);
                }
                //topRail
                if (
                  part.profile &&
                  part.profile.MINIMUM_STILE_WIDTH !== numQty(i.topRail)
                ) {
                  calc(
                    'topRail',
                    part.profile.DF_Reduction ? part.profile.DF_Reduction : 1.5,
                    price
                  );
                }
                //bottomRail
                if (
                  part.profile &&
                  part.profile.MINIMUM_STILE_WIDTH !== numQty(i.bottomRail)
                ) {
                  calc(
                    'bottomRail',
                    part.profile.DF_Reduction ? part.profile.DF_Reduction : 1.5,
                    price
                  );
                }
              } else {
                let price = 0;

                if (part.thickness.value === 0.75) {
                  if (part.cope_design) {
                    price = part.cope_design && part.cope_design.UPCHARGE;
                  } else {
                    price = 0;
                  }
                }
                if (part.thickness.value === 1) {
                  if (part.cope_design) {
                    price = part.cope_design && part.cope_design.UPCHARGE_THICK;
                  } else {
                    price = 0;
                  }
                }

                if (part.profile) {
                  //leftStile
                  if (
                    (part.profile && part.profile.MINIMUM_STILE_WIDTH) !==
                    numQty(i.leftStile)
                  ) {
                    calc('leftStile', part.profile.MINIMUM_STILE_WIDTH, price);
                  }
                  //rightStile
                  if (
                    (part.profile && part.profile.MINIMUM_STILE_WIDTH) !==
                    numQty(i.rightStile)
                  ) {
                    calc('rightStile', part.profile.MINIMUM_STILE_WIDTH, price);
                  }
                  //topRail
                  if (
                    (part.profile && part.profile.MINIMUM_STILE_WIDTH) !==
                    numQty(i.topRail)
                  ) {
                    calc('topRail', part.profile.MINIMUM_STILE_WIDTH, price);
                  }
                  //bottomRail
                  if (
                    (part.profile && part.profile.MINIMUM_STILE_WIDTH) !==
                    numQty(i.bottomRail)
                  ) {
                    calc('bottomRail', part.profile.MINIMUM_STILE_WIDTH, price);
                  }
                } else {
                  calc('leftStile', 2.3125, price);
                  calc('rightStile', 2.3125, price);
                  calc('topRail', 2.3125, price);
                  calc('bottomRail', 2.3125, price);
                }
              }
            }

            if (part.construction.value === 'M') {
              if (
                part.orderType.value === 'DF' ||
                part.orderType.value === 'One_Piece_DF' ||
                part.orderType.value === 'Two_Piece_DF' ||
                part.orderType.value === 'Glass_DF'
              ) {
                let price = 0;

                if (part.thickness.value === 0.75) {
                  price = part.miter_df_design && part.miter_df_design.UPCHARGE;
                }
                if (part.thickness.value === 1) {
                  price = part.miter_df_design && part.miter_df_design.UPCHARGE_THICK;
                }

                //leftStile
                if (
                  part.miter_df_design &&
                  part.miter_df_design.PROFILE_WIDTH !== numQty(i.leftStile)
                ) {
                  calc('leftStile', part.miter_df_design.PROFILE_WIDTH, price);
                }
                //rightStile
                if (
                  part.miter_df_design &&
                  part.miter_df_design.PROFILE_WIDTH !== numQty(i.rightStile)
                ) {
                  calc('rightStile', part.miter_df_design.PROFILE_WIDTH, price);
                }
                //topRail
                if (
                  part.miter_df_design &&
                  part.miter_df_design.PROFILE_WIDTH !== numQty(i.topRail)
                ) {
                  calc('topRail', part.miter_df_design.PROFILE_WIDTH, price);
                }
                //bottomRail
                if (
                  part.miter_df_design &&
                  part.miter_df_design.PROFILE_WIDTH !== numQty(i.bottomRail)
                ) {
                  calc('bottomRail', part.miter_df_design.PROFILE_WIDTH, price);
                }
              } else {
                let price = 0;

                if (part.thickness.value === 0.75) {
                  price = part.miter_design && part.miter_design.UPCHARGE;
                }
                if (part.thickness.value === 1) {
                  price = part.miter_design && part.miter_design.UPCHARGE_THICK;
                }

                //leftStile
                if (
                  part.miter_design &&
                  part.miter_design.PROFILE_WIDTH !== numQty(i.leftStile)
                ) {
                  calc('leftStile', part.miter_design.PROFILE_WIDTH, price);
                }
                //rightStile
                if (
                  part.miter_design &&
                  part.miter_design.PROFILE_WIDTH !== numQty(i.rightStile)
                ) {
                  calc('rightStile', part.miter_design.PROFILE_WIDTH, price);
                }
                //topRail
                if (
                  part.miter_design &&
                  part.miter_design.PROFILE_WIDTH !== numQty(i.topRail)
                ) {
                  calc('topRail', part.miter_design.PROFILE_WIDTH, price);
                }
                //bottomRail
                if (
                  part.miter_design &&
                  part.miter_design.PROFILE_WIDTH !== numQty(i.bottomRail)
                ) {
                  calc('bottomRail', part.miter_design.PROFILE_WIDTH, price);
                }
              }
            }

            if (part.construction.value === 'MT') {
              let price = 0;

              if (
                part.orderType.value === 'DF' ||
                part.orderType.value === 'One_Piece_DF' ||
                part.orderType.value === 'Two_Piece_DF' ||
                part.orderType.value === 'Glass_DF'
              ) {
                if (part.thickness.value === 0.75) {
                  price = part.mt_df_design && part.mt_df_design.UPCHARGE;
                }
                if (part.thickness.value === 1) {
                  price = part.mt_df_design && part.mt_df_design.UPCHARGE_THICK;
                }

                //leftStile
                if (
                  part.mt_df_design &&
                  part.mt_df_design.MID_RAIL_MINIMUMS !== numQty(i.leftStile)
                ) {
                  calc('leftStile', part.mt_df_design.MID_RAIL_MINIMUMS, price);
                }
                //rightStile
                if (
                  part.mt_df_design &&
                  part.mt_df_design.MID_RAIL_MINIMUMS !== numQty(i.rightStile)
                ) {
                  calc(
                    'rightStile',
                    part.mt_df_design.MID_RAIL_MINIMUMS,
                    price
                  );
                }
                //topRail
                if (
                  part.mt_df_design &&
                  part.mt_df_design.MID_RAIL_MINIMUMS !== numQty(i.topRail)
                ) {
                  calc('topRail', part.mt_df_design.MID_RAIL_MINIMUMS, price);
                }
                //bottomRail
                if (
                  part.mt_df_design &&
                  part.mt_df_design.MID_RAIL_MINIMUMS !== numQty(i.bottomRail)
                ) {
                  calc(
                    'bottomRail',
                    part.mt_df_design.MID_RAIL_MINIMUMS,
                    price
                  );
                }
              } else {
                if (part.thickness.value === 0.75) {
                  price = part.mt_design && part.mt_design.UPCHARGE;
                }
                if (part.thickness.value === 1) {
                  price = part.mt_design && part.mt_design.UPCHARGE_THICK;
                }

                //leftStile
                if (
                  part.mt_design &&
                  part.mt_design.MID_RAIL_MINIMUMS !== numQty(i.leftStile)
                ) {
                  calc('leftStile', part.mt_design.MID_RAIL_MINIMUMS, price);
                }
                //rightStile
                if (
                  part.mt_design &&
                  part.mt_design.MID_RAIL_MINIMUMS !== numQty(i.rightStile)
                ) {
                  calc('rightStile', part.mt_design.MID_RAIL_MINIMUMS, price);
                }
                //topRail
                if (
                  part.mt_design &&
                  part.mt_design.MID_RAIL_MINIMUMS !== numQty(i.topRail)
                ) {
                  calc('topRail', part.mt_design.MID_RAIL_MINIMUMS, price);
                }
                //bottomRail
                if (
                  part.mt_design &&
                  part.mt_design.MID_RAIL_MINIMUMS !== numQty(i.bottomRail)
                ) {
                  calc('bottomRail', part.mt_design.MID_RAIL_MINIMUMS, price);
                }
              }
            }

            let price = 0;

            //Slab Doors here 

            if (
              part.orderType.value === 'DF' ||
              part.orderType.value === 'One_Piece_DF' ||
              part.orderType.value === 'Two_Piece_DF' ||
              part.orderType.value === 'Glass_DF'
            ) {
              price =
                eval(pricer.df_pricing) +
                leftStileAdd +
                rightStileAdd +
                topRailAdd +
                bottomRailAdd +
                extraCost
                  ? eval(pricer.df_pricing) +
                    leftStileAdd +
                    rightStileAdd +
                    topRailAdd +
                    bottomRailAdd +
                    extraCost
                  : 0;
            } else if ((part.orderType.value === 'Slab_Door') || ((part.orderType.value === 'Door') && (part.construction.value === 'Slab'))  ) {
              price =
                (width * height) / 144 > 2
                  ? ((width * height) / 144) * wood + (6.5 + edge) + extraCost
                  : 2 * wood + (6.5 + edge) + extraCost;
            } else if ((part.orderType.value === 'Slab_Door') || ( (part.orderType.value === 'DF') && (part.construction.value === 'Slab')  )) {
              price =
                (width * height) / 144 > 1
                  ? ((width * height) / 144) * wood + (6.5 + edge) + extraCost
                  : 1 * wood + (6.5 + edge) + extraCost;
            } else {
              price =
                eval(pricer && pricer.door_pricing) +
                leftStileAdd +
                rightStileAdd +
                topRailAdd +
                bottomRailAdd +
                extraCost
                  ? eval(pricer && pricer.door_pricing) +
                    leftStileAdd +
                    rightStileAdd +
                    topRailAdd +
                    bottomRailAdd +
                    extraCost
                  : 0;
            }

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
  [partListSelector, pricingSelector, itemPriceSelector],
  (parts, pricer, item) =>
    parts.map((part, index) => {
      console.log({ part });

      if (part.dimensions) {
        return part.dimensions.map((i, p) => {
          if (item[index][p]) {
            if (i.qty) {
              if (
                (part.orderType.value === 'Door' ||
                  part.orderType.value === 'Glass' ||
                  part.orderType.value === 'One_Piece' ||
                  part.orderType.value === 'Two_Piece' ||
                  part.orderType.value === 'Slab_Door') &&
                ((parseInt(i.panelsH) === 1 && numQty(i.height) >= 48) ||
                  (parseInt(i.panelsW) === 1 && numQty(i.width) >= 24))
              ) {
                console.log('hereeeeee');

                const base = item[index][p] * parseInt(i.qty);
                const add = base * 0.2;
                const price = base + add;
                console.log({ base });
                return price;
              } else {
                return item[index][p] * parseInt(i.qty);
              }
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

export const addPriceSelector = createSelector(
  [partListSelector, pricingSelector, itemPriceSelector],
  (parts, pricer, item) =>
    parts.map((part, index) => {
      if (part.dimensions) {
        return part.dimensions.map((i, p) => {
          if (item[index][p]) {
            if (i.qty) {
              if (
                (parseInt(i.panelsH) === 1 && numQty(i.height) >= 48) ||
                (parseInt(i.panelsW) === 1 && numQty(i.width) >= 24)
              ) {
                const base = item[index][p] * parseInt(i.qty);
                const add = base * 0.2;
                return add;
              } else {
                return 0;
              }
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
  (prices, misc) =>
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

export const taxSelector = createSelector(
  [
    subTotalSelector,
    taxRate,
    totalDiscountSelector,
    discountSelector,
    miscTotalSelector,
    stateSelector,
  ],
  (subTotal, tax, discount, dis, misc, state) => {
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
