import { createSelector } from 'reselect';
import numQty from 'numeric-quantity';
import moment from 'moment';

const pricingSelector = (state) => {
  const pricing = state.part_list.pricing ? state.part_list.pricing[0] : 0;
  return pricing;
};

const discountSelector = (state) => {
  const orders = state.form.Order;

  if (orders) {
    if (state.form.Order.values && state.form.Order.values.discount) {
      if (state.form.Order.values.discount > 0) {
        return (
          Math.floor((numQty(state.form.Order.values.discount) / 100) * 100) /
          100
        );
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
  const orders = state.form.Order;

  if (orders) {
    if (
      state.form.Order.values &&
      state.form.Order.values.job_info &&
      state.form.Order.values.job_info.State
    ) {
      return state.form.Order.values.job_info.State;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const orderTypeSelector = (state) => state?.Orders?.orderType;

const OrderSelector = (state) => {
  const orders = state.form.Order;

  if (orders) {
    if (
      orders &&
      orders.values &&
      orders.values.mouldings &&
      orders.values.mouldings.length > 0
    ) {
      return (
        state.form.Order &&
        state.form.Order.values &&
        state.form.Order.values.mouldings
      );
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const partListSelector = (state) => {
  const orders = state.form.Order;

  if (orders) {
    if (orders && orders.values && orders.values.part_list) {
      return state.form.Order.values.part_list;
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const linePrices = (state) => {
  const orders = state.form.Order;
  if (orders) {
    if (orders && orders.values && orders.values.linePrice) {
      return state.form.Order.values.linePrice;
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const itemPrices = (state) => {
  const orders = state.form.Order;
  if (orders) {
    if (orders && orders.values && orders.values.itemPrice) {
      return state.form.Order.values.itemPrice;
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const formStateSelector = (state) => {
  return state.form?.Order;
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
          price = Math.floor(parseFloat(i.price) * 100) / 100;
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
            price = pricer[index] * parseInt(i.qty);
          } else {
            price = 0;
          }
        } else {
          price = 0;
        }
      } else {
        if (i.pricePer) {
          if (i.qty) {
            price = pricer[index] * parseInt(i.qty);
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
      return 0;
    }
  } else {
    return 0;
  }
};

const totalBalanceDue = (state) => {
  const orders = state.form.Order;
  if (orders) {
    if (orders && orders.values && orders.values.balance_history) {
      return state.form.Order.values.balance_history.map((i) => {
        if (parseFloat(i.balance_paid) > 0) {
          return i.balance_paid;
        } else if (parseFloat(i.deposit_paid) > 0) {
          return i.deposit_paid;
        } else {
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

export const qtySelector = createSelector([partListSelector], (parts) =>
  parts.map((part) => {
    return (part.dimensions || []).map((i) => {
      return parseInt(i.qty);
    });
  })
);

export const itemPriceSelector = createSelector(
  [
    partListSelector,
    pricingSelector,
    orderTypeSelector,
    itemPrices,
    formStateSelector,
  ],
  (parts, pricer, orderType, itemPrice, formState) => {
    if (orderType === 'Door Order' || orderType === 'Face Frame') {
      return parts.map((part, index) => {
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
            // code block
            wood = part?.woodtype?.SELECT_GRADE;
            break;
          case 3:
            // code block
            wood = part?.woodtype?.STANDARD_GRADE_THICK;
            break;
          case 4:
            // code block
            wood = part?.woodtype?.SELECT_GRADE_THICK;
            break;
          case 5:
            // code block
            wood = part?.woodtype?.SIX_QUARTER;
            break;
          case 6:
            // code block
            wood = part?.woodtype?.SIX_QUARTER_THICK;
            break;
          default:
            // code block
            wood = part?.woodtype?.STANDARD_GRADE;
        }

        const profile_cost = part.profile?.Extra_Charge
          ? part.profile?.Extra_Charge
          : 0;
        const edge = part.edge ? part.edge.UPCHARGE : 0;
        const panel = part.panel ? part.panel.UPCHARGE : 0;
        const applied_profile = 0;
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

        if (part?.orderType?.value === 'Face_Frame') {
          if (part.dimensions) {
            const linePrice = part.dimensions.map((i, j) => {
              const extraCost = i.extraCost ? parseFloat(i.extraCost) : 0;

              let width_input = numQty(i.width);

              let width =
                numQty(i.width) <= 24
                  ? 18
                  : numQty(i.width) >= 24 && numQty(i.width) <= 48
                  ? 24
                  : 36;
              let height = numQty(i.height);

              if (numQty(i.width) > numQty(i.height)) {
                height = numQty(i.width);

                width =
                  numQty(i.height) <= 24
                    ? 18
                    : numQty(i.height) >= 24 && numQty(i.height) <= 48
                    ? 24
                    : 36;

                width_input = numQty(i.height);
              }

              const openings = parseInt(i.openings);
              // const openings = parseInt(i.openings) > 1 ? parseInt(i.openings) : 0;

              let overcharge = 0;

              if (width_input >= 48 || height >= 96) {
                overcharge = 100;
              }

              const price =
                eval(pricer && pricer.face_frame_pricing) + extraCost;

              if (height > -1) {
                if (itemPrice.length > 0) {
                  if (
                    (formState?.values?.part_list[index]?.dimensions.length >
                      0 &&
                      formState?.values?.part_list[index]?.dimensions[j] !==
                        formState?.initial.part_list[index]?.dimensions[j]) ||
                    formState?.values?.part_list[index]?.woodtype !==
                      formState?.initial.part_list[index]?.woodtype ||
                    formState?.values?.part_list[index]?.face_frame_design !==
                      formState?.initial.part_list[index]?.face_frame_design ||
                    formState?.values?.part_list[index]
                      ?.face_frame_finishing !==
                      formState?.initial.part_list[index]?.face_frame_finishing
                  ) {
                    return Math.floor(price * 100) / 100;
                  } else {
                    return Math.round(itemPrice[index][j] * 100) / 100;
                  }
                } else {
                  return Math.floor(price * 100) / 100;
                }
              } else {
                return 0;
              }
            });

            return linePrice;
          } else {
            return 0;
          }
        } else if (part?.orderType?.value === 'Custom') {
          if (part.dimensions) {
            const linePrice = part.dimensions.map((i, index) => {
              return Math.floor(parseFloat(i.price) * 100) / 100;
            });

            return linePrice;
          } else {
            return 0;
          }
        } else {
          if (part.dimensions) {
            const linePrice = part.dimensions.map((i, j) => {
              const width = Math.ceil(numQty(i.width));
              const height = Math.ceil(numQty(i.height));
              const qty = parseInt(i.qty);
              const extraCost = i.extraCost ? parseFloat(i.extraCost) : 0;
              const panelsH = parseInt(i.panelsH);
              const panelsW = parseInt(i.panelsW);

              //add lite pricing here
              // const lites = i.lite ? i.lite.UPCHARGE : 0;

              const litePriceArray = Array.from(
                panelsH ? Array(parseInt(panelsH)).keys() : 0
              ).map((j, index) => {
                return eval(`i.lite_${index}`)
                  ? eval(`i.lite_${index}.UPCHARGE`)
                  : 0;
              });

              const lites = litePriceArray.reduce((acc, item) => acc + item, 0);

              let leftStileAdd = 0;
              let rightStileAdd = 0;
              let topRailAdd = 0;
              let bottomRailAdd = 0;

              const calcPrice = (add, part, price, w) => {
                const width = w;
                const difference = numQty(part) - width;
                const calc = difference * 10 + price;
                const priceDifference = calc - price;

                switch (add) {
                  case 'leftStileAdd':
                    leftStileAdd = !isNaN(priceDifference / 4)
                      ? priceDifference / 4
                      : 0;
                    break;
                  case 'rightStileAdd':
                    rightStileAdd = !isNaN(priceDifference / 4)
                      ? priceDifference / 4
                      : 0;
                    break;
                  case 'topRailAdd':
                    topRailAdd = !isNaN(priceDifference / 4)
                      ? priceDifference / 4
                      : 0;
                    break;
                  case 'bottomRailAdd':
                    bottomRailAdd = !isNaN(priceDifference / 4)
                      ? priceDifference / 4
                      : 0;
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
                return calcPrice(
                  'rightStileAdd',
                  eval('i.rightStile'),
                  price,
                  p
                );
              };

              const topRailCalc = (p, price) => {
                return calcPrice('topRailAdd', eval('i.topRail'), price, p);
              };

              const bottomRailCalc = (p, price) => {
                return calcPrice(
                  'bottomRailAdd',
                  eval('i.bottomRail'),
                  price,
                  p
                );
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

              let price = 0;

              if (part.thickness.value === 1 || part.thickness.value === 2) {
                if (part.design) {
                  price = part.design && part.design.UPCHARGE;
                } else {
                  price = 0;
                }
              }
              if (
                part.thickness.value === 3 ||
                part.thickness.value === 4 ||
                part.thickness.value === 5 ||
                part.thickness.value === 6
              ) {
                if (part.design) {
                  price = part.design && part.design.UPCHARGE_THICK;
                } else {
                  price = 0;
                }
              }

              if (part.profile) {
                //leftStile
                if (
                  (part.profile && part.profile.PROFILE_WIDTH) !==
                  numQty(i.leftStile)
                ) {
                  calc('leftStile', part.profile?.PROFILE_WIDTH, price);
                }
                //rightStile
                if (
                  (part.profile && part.profile.PROFILE_WIDTH) !==
                  numQty(i.rightStile)
                ) {
                  calc('rightStile', part.profile?.PROFILE_WIDTH, price);
                }
                //topRail
                if (
                  (part.profile && part.profile.PROFILE_WIDTH) !==
                  numQty(i.topRail)
                ) {
                  calc('topRail', part.profile?.PROFILE_WIDTH, price);
                }
                //bottomRail
                if (
                  (part.profile && part.profile.PROFILE_WIDTH) !==
                  numQty(i.bottomRail)
                ) {
                  calc('bottomRail', part.profile?.PROFILE_WIDTH, price);
                }
              } else {
                //leftStile
                if (
                  (part.design && part.design.PROFILE_WIDTH) !==
                  numQty(i.leftStile)
                ) {
                  calc('leftStile', part.design?.PROFILE_WIDTH, price);
                }
                //rightStile
                if (
                  (part.design && part.design.PROFILE_WIDTH) !==
                  numQty(i.rightStile)
                ) {
                  calc('rightStile', part.design?.PROFILE_WIDTH, price);
                }
                //topRail
                if (
                  (part.design && part.design.PROFILE_WIDTH) !==
                  numQty(i.topRail)
                ) {
                  calc('topRail', part.design?.PROFILE_WIDTH, price);
                }
                //bottomRail
                if (
                  (part.design && part.design.PROFILE_WIDTH) !==
                  numQty(i.bottomRail)
                ) {
                  calc('bottomRail', part.design?.PROFILE_WIDTH, price);
                }
              }

              // if(part.orderType?.value === 'DF') {
              //   if (part.profile) {
              //     //leftStile
              //     if (
              //       (part.profile && part.profile.PROFILE_WIDTH) !==
              //       numQty(i.leftStile)
              //     ) {
              //       calc('leftStile', part.profile?.PROFILE_WIDTH, price);
              //     }
              //     //rightStile
              //     if (
              //       (part.profile && part.profile.PROFILE_WIDTH) !==
              //       numQty(i.rightStile)
              //     ) {
              //       calc('rightStile', part.profile?.PROFILE_WIDTH, price);
              //     }
              //     //topRail
              //     if (
              //       (part.profile && part.profile.DF_Reduction) !==
              //       numQty(i.topRail)
              //     ) {
              //       calc('topRail', part.profile?.DF_Reduction, price);
              //     }
              //     //bottomRail
              //     if (
              //       (part.profile && part.profile.DF_Reduction) !==
              //       numQty(i.bottomRail)
              //     ) {
              //       calc('bottomRail', part.profile?.DF_Reduction, price);
              //     }
              //   } else {
              //     //leftStile
              //     if (
              //       (part.design && part.design.PROFILE_WIDTH) !==
              //       numQty(i.leftStile)
              //     ) {
              //       calc('leftStile', part.design?.PROFILE_WIDTH, price);
              //     }
              //     //rightStile
              //     if (
              //       (part.design && part.design.PROFILE_WIDTH) !==
              //       numQty(i.rightStile)
              //     ) {
              //       calc('rightStile', part.design?.PROFILE_WIDTH, price);
              //     }
              //     //topRail
              //     if (
              //       (part.design && part.design.DF_Reduction) !==
              //       numQty(i.topRail)
              //     ) {
              //       calc('topRail', part.design?.DF_Reduction, price);
              //     }
              //     //bottomRail
              //     if (
              //       (part.design && part.design.DF_Reduction) !==
              //       numQty(i.bottomRail)
              //     ) {
              //       calc('bottomRail', part.design?.DF_Reduction, price);
              //     }
              //   }
              // } else {
              //   if (part.profile) {
              //     //leftStile
              //     if (
              //       (part.profile && part.profile.PROFILE_WIDTH) !==
              //       numQty(i.leftStile)
              //     ) {
              //       calc('leftStile', part.profile?.PROFILE_WIDTH, price);
              //     }
              //     //rightStile
              //     if (
              //       (part.profile && part.profile.PROFILE_WIDTH) !==
              //       numQty(i.rightStile)
              //     ) {
              //       calc('rightStile', part.profile?.PROFILE_WIDTH, price);
              //     }
              //     //topRail
              //     if (
              //       (part.profile && part.profile.PROFILE_WIDTH) !==
              //       numQty(i.topRail)
              //     ) {
              //       calc('topRail', part.profile?.PROFILE_WIDTH, price);
              //     }
              //     //bottomRail
              //     if (
              //       (part.profile && part.profile.PROFILE_WIDTH) !==
              //       numQty(i.bottomRail)
              //     ) {
              //       calc('bottomRail', part.profile?.PROFILE_WIDTH, price);
              //     }
              //   } else {
              //     //leftStile
              //     if (
              //       (part.design && part.design.PROFILE_WIDTH) !==
              //       numQty(i.leftStile)
              //     ) {
              //       calc('leftStile', part.design?.PROFILE_WIDTH, price);
              //     }
              //     //rightStile
              //     if (
              //       (part.design && part.design.PROFILE_WIDTH) !==
              //       numQty(i.rightStile)
              //     ) {
              //       calc('rightStile', part.design?.PROFILE_WIDTH, price);
              //     }
              //     //topRail
              //     if (
              //       (part.design && part.design.PROFILE_WIDTH) !==
              //       numQty(i.topRail)
              //     ) {
              //       calc('topRail', part.design?.PROFILE_WIDTH, price);
              //     }
              //     //bottomRail
              //     if (
              //       (part.design && part.design.PROFILE_WIDTH) !==
              //       numQty(i.bottomRail)
              //     ) {
              //       calc('bottomRail', part.design?.PROFILE_WIDTH, price);
              //     }
              //   }
              // }

              //test
              //Slab Doors here

              if (
                part?.orderType?.value === 'Door' &&
                (part?.construction?.value === 'Slab' ||
                  part?.construction?.value === 'Wrapped')
              ) {
                price =
                  (width * height) / 144 > 2
                    ? ((width * height) / 144) * wood + (6.5 + edge) + extraCost
                    : 2 * wood + (6.5 + edge) + extraCost;
              } else if (
                part?.orderType?.value === 'DF' &&
                (part?.construction?.value === 'Slab' ||
                  part?.construction?.value === 'Wrapped')
              ) {
                price =
                  (width * height) / 144 > 1
                    ? ((width * height) / 144) * wood + (6.5 + edge) + extraCost
                    : 1 * wood + (6.5 + edge) + extraCost;
              } else if (part?.orderType?.value === 'DF') {
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

              let A = moment(formState?.values?.created_at);
              let B = moment();
              let C = B.diff(A, 'days');

              if (height > -1) {
                if (itemPrice.length > 0) {
                  if (
                    formState?.values?.Order_Lock === false &&
                    (formState?.values?.part_list[index]?.dimensions[j]
                      ?.width !==
                      formState?.initial.part_list[index]?.dimensions[j]
                        ?.width ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.height !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.height ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.panelsH !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.panelsH ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.panelsW !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.panelsW ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.topRail !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.topRail ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.bottomRail !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.bottomRail ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.leftStile !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.leftStile ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.rightStile !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.rightStile ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.qty !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.qty ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.verticalMidRailSize !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.verticalMidRailSize ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.horizontalMidRailSize !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.horizontalMidRailSize ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.extraCost !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.extraCost ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.lite_0 !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.lite_0 ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.lite_1 !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.lite_1 ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.lite_2 !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.lite_2 ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.lite_3 !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.lite_3 ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.lite_4 !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.lite_4 ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.lite_5 !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.lite_5 ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.lite_6 !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.lite_6 ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.lite_7 !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.lite_7 ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.lite_8 !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.lite_8 ||
                      formState?.values?.part_list[index]?.dimensions[j]
                        ?.lite_9 !==
                        formState?.initial.part_list[index]?.dimensions[j]
                          ?.lite_9 ||
                      formState?.values?.part_list[index]?.woodtype !==
                        formState?.initial.part_list[index]?.woodtype ||
                      formState?.values?.part_list[index]?.design !==
                        formState?.initial.part_list[index]?.design ||
                      formState?.values?.part_list[index]?.edge !==
                        formState?.initial.part_list[index]?.edge ||
                      formState?.values?.part_list[index]?.profile !==
                        formState?.initial.part_list[index]?.profile ||
                      formState?.values?.part_list[index]?.panel !==
                        formState?.initial.part_list[index]?.panel ||
                      formState?.values?.part_list[index]?.applied_profile !==
                        formState?.initial.part_list[index]?.applied_profile ||
                      formState?.values?.part_list[index]?.thickness !==
                        formState?.initial.part_list[index]?.thickness ||
                      formState?.values?.part_list[index]?.orderType !==
                        formState?.initial.part_list[index]?.orderType ||
                      formState?.values?.part_list[index]?.construction !==
                        formState?.initial.part_list[index]?.construction)
                  ) {
                    return Math.floor(price * 100) / 100;
                  } else {
                    return Math.round(itemPrice[index][j] * 100) / 100;
                  }
                } else {
                  return Math.floor(price * 100) / 100;
                }
              } else {
                return 0;
              }
            });

            return linePrice;
          } else {
            return 0;
          }
        }
      });
    }

    if (orderType === 'Drawer Order') {
      return parts.map((part, index) => {
        const wood = part.woodtype ? part.woodtype.STANDARD_GRADE : 0;
        const finish = part.box_finish ? part.box_finish.UPCHARGE : 0;
        const assembly = part.box_assembly ? part.box_assembly.UPCHARGE : 0;
        const notchDrill = part.box_notch ? part.box_notch.PRICE : 0;

        if (part.dimensions) {
          const linePrice = part.dimensions.map((i, j) => {
            const width = numQty(i.width);
            const height = numQty(i.height);
            const depth = numQty(i.depth);
            const qty = parseInt(i.qty);
            const extraCost = i.extraCost ? parseFloat(i.extraCost) : 0;
            const scoop = i.scoop.PRICE;

            const price = eval(pricer.drawer_box_pricing) + extraCost;

            if (height > -1) {
              if (itemPrice.length > 0) {
                if (
                  formState?.values?.Order_Lock === false &&
                  (formState?.values?.part_list[index]?.dimensions[j]?.qty !==
                    formState?.initial.part_list[index]?.dimensions[j]?.qty ||
                    formState?.values?.part_list[index]?.dimensions[j]
                      ?.width !==
                      formState?.initial.part_list[index]?.dimensions[j]
                        ?.width ||
                    formState?.values?.part_list[index]?.dimensions[j]
                      ?.depth !==
                      formState?.initial.part_list[index]?.dimensions[j]
                        ?.depth ||
                    formState?.values?.part_list[index]?.dimensions[j]
                      ?.height !==
                      formState?.initial.part_list[index]?.dimensions[j]
                        ?.height ||
                    formState?.values?.part_list[index]?.dimensions[j]
                      ?.scoop !==
                      formState?.initial.part_list[index]?.dimensions[j]
                        ?.scoop ||
                    formState?.values?.part_list[index]?.woodtype !==
                      formState?.initial.part_list[index]?.woodtype ||
                    formState?.values?.part_list[index]
                      ?.box_bottom_thickness !==
                      formState?.initial.part_list[index]
                        ?.box_bottom_thickness ||
                    formState?.values?.part_list[index]?.box_finish !==
                      formState?.initial.part_list[index]?.box_finish ||
                    formState?.values?.part_list[index]?.box_notch !==
                      formState?.initial.part_list[index]?.box_notch ||
                    formState?.values?.part_list[index]?.box_bottom_woodtype !==
                      formState?.initial.part_list[index]
                        ?.box_bottom_woodtype ||
                    formState?.values?.part_list[index]?.box_assembly !==
                      formState?.initial.part_list[index]?.box_assembly ||
                    formState?.values?.part_list[index]?.box_thickness !==
                      formState?.initial.part_list[index]?.box_thickness)
                ) {
                  return Math.floor(price * 100) / 100;
                } else {
                  return Math.round(itemPrice[index][j] * 100) / 100;
                }
              } else {
                return Math.floor(price * 100) / 100;
              }
            } else {
              return 0;
            }
          });
          return linePrice;
        } else {
          return 0;
        }
      });
    }
  }
);

export const finishingSelector = createSelector(
  [partListSelector, pricingSelector, discountSelector],
  (parts, pricer, discount) =>
    parts.map((part, index) => {
      if (part.dimensions) {
        const linePrice = part.dimensions.map((i) => {
          const finish = part.face_frame_finishing
            ? part.face_frame_finishing.PRICE
            : 0;

          let width_input = numQty(i.width);

          let width =
            numQty(i.width) <= 24
              ? 18
              : numQty(i.width) >= 24 && numQty(i.width) <= 48
              ? 24
              : 36;
          let height = numQty(i.height);

          if (numQty(i.width) > numQty(i.height)) {
            height = numQty(i.width);

            width =
              numQty(i.height) <= 24
                ? 18
                : numQty(i.height) >= 24 && numQty(i.height) <= 48
                ? 24
                : 36;

            width_input = numQty(i.height);
          }

          const width_finish = width_input >= 35 ? finish * 0.25 : 0;
          const height_finish = height >= 97 ? finish * 0.25 : 0;

          const openings = parseInt(i.openings);
          const opening_add =
            openings > 1 && finish > 0 ? (openings - 1) * 5 : 0;

          const finishing =
            finish + (width_finish + height_finish + opening_add);

          if (height > -1) {
            return Math.floor(finishing * 100) / 100;
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

export const finishTotalSelector = createSelector(
  [finishItemSelector],
  (finish) => {
    return parseFloat(finish.reduce((acc, item) => acc + item, 0));
  }
);

export const linePriceSelector = createSelector(
  [partListSelector, finishingSelector, itemPriceSelector],
  (parts, finish, item) =>
    parts.map((part, index) => {
      if (part.dimensions) {
        return part?.dimensions?.map((i, p) => {
          if (item[index][p]) {
            if (i.qty) {
              if (
                (part?.orderType?.value === 'Door' ||
                  part?.orderType?.value === 'DF' ||
                  part?.orderType?.value === 'Glass' ||
                  part?.orderType?.value === 'One_Piece' ||
                  part?.orderType?.value === 'Two_Piece') &&
                ((parseInt(i.panelsH) === 1 && numQty(i.height) >= 48) ||
                  (parseInt(i.panelsW) === 1 && numQty(i.width) >= 24))
              ) {
                const base =
                  Math.round(item[index][p] * parseInt(i.qty) * 100) / 100;
                const add = base * 0.2;
                const price = base + add;
                return Math.round(price * 100) / 100;
              } else {
                if (part?.orderType?.value === 'Face_Frame') {
                  return (
                    Math.round(
                      (item[index][p] + finish[index][p]) *
                        parseInt(i.qty) *
                        100
                    ) / 100
                  );
                } else {
                  return (
                    Math.round(item[index][p] * parseInt(i.qty) * 100) / 100
                  );
                }
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

export const nonDiscountedItems = createSelector([partListSelector], (parts) =>
  parts
    .map((i) => {
      return 0;
    })
    .reduce((acc, item) => acc + item, 0)
);

export const addPriceSelector = createSelector(
  [partListSelector, pricingSelector, itemPriceSelector, orderTypeSelector],
  (parts, pricer, item, orderType) => {
    if (orderType === 'Door Order') {
      return parts.map((part, index) => {
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
      });
    } else {
      return 0;
    }
  }
);

export const mouldingPriceSelector = createSelector([OrderSelector], (Order) =>
  Order.map((i) => {
    let price = 0;

    const { item, woodtype, linearFT, grade, extraCost } = i;

    if (i.style?.value === 'custom') {
      price = 0;

      const width = i.width ? numQty(i.width) : 0;
      const thickness = i.thickness ? numQty(i.thickness) : 0;
      const linFt = numQty(linearFT);

      let wood = 0;

      let feet = Math.floor(((width * 12) / 144) * 100) / 100;
      let waste = feet * 1.25;

      let premium = 1;

      if (thickness <= 0.8125) {
        premium = 1;
      } else if (thickness <= 1.125) {
        premium = 1.25;
      } else if (thickness <= 1.31) {
        premium = 1.5;
      } else if (thickness <= 1.8125) {
        premium = 2;
      } else if (thickness <= 2.31) {
        premium = 2.5;
      } else {
        premium = 3;
      }

      if (thickness <= 1) {
        if (grade?.name === 'Standard Grade') {
          wood = woodtype?.STANDARD_GRADE ? woodtype?.STANDARD_GRADE / 4 : 0;
        } else if (grade?.name === 'Select Grade') {
          wood = woodtype?.SELECT_GRADE ? woodtype?.SELECT_GRADE / 4 : 0;
        }
      } else {
        if (grade?.name === 'Standard Grade') {
          wood = woodtype?.STANDARD_GRADE_THICK
            ? woodtype?.STANDARD_GRADE_THICK / 4
            : 0;
        } else if (grade?.name === 'Select Grade') {
          wood = woodtype?.SELECT_GRADE_THICK
            ? woodtype?.SELECT_GRADE_THICK / 4
            : 0;
        }
      }

      const bd_ft = waste * premium;
      const adjust_price = extraCost ? Math.round(extraCost * 100) / 100 : 0;

      price = bd_ft * wood * linFt * 4 + adjust_price;
    } else {
      if (i.item) {
        let feet = Math.floor(((item.MOULDING_WIDTH * 12) / 144) * 100) / 100;
        let waste = feet * 1.25;
        let multiplier = item.Multiplier;
        let wood = woodtype ? woodtype[grade?.db_name] * 0.25 : 0;
        let premium = 0;

        let newWood = wood;

        if (multiplier <= 1) {
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

        price = a * newWood * parseFloat(linearFT) * premium;
      }
    }

    return Math.floor(price * 100) / 100;
  })
);

export const mouldingLinePriceSelector = createSelector(
  [mouldingPriceSelector, OrderSelector],
  (pricer, parts, item) =>
    pricer.map((i, index) => {
      const price = i ? i : 0;

      return Math.floor(price * 100) / 100;
    })
);

export const mouldingTotalSelector = createSelector(
  [mouldingLinePriceSelector],
  (misc) => misc.reduce((acc, item) => acc + item, 0)
);

export const miscLineItemSelector = createSelector(
  [miscItemsSelector],
  (misc) => misc
);

export const subTotalSelector = createSelector(
  [
    linePriceSelector,
    miscTotalSelector,
    orderTypeSelector,
    mouldingTotalSelector,
  ],
  (prices, misc, orderType, moulding) => {
    if (orderType) {
      if (orderType === 'Mouldings') {
        return [moulding];
      }
      if (orderType === 'Misc Items') {
        return [misc];
      } else {
        return prices.map((i, index) => {
          if (i) {
            let price =
              Math.round(
                i.reduce((acc, item) => acc + Math.round(item * 100) / 100, 0) *
                  100
              ) / 100;
            let sum = price;
            return sum;
          } else {
            return 0;
          }
        });
      }
    } else {
      return [0];
    }
  }
);

export const mouldingLineItemSelector = createSelector(
  [OrderSelector],
  (misc) => misc
);

export const subTotal_Total = createSelector(
  [subTotalSelector, miscTotalSelector],
  (subTotal, misc) =>
    Math.round(subTotal.reduce((acc, item) => acc + item, 0) * 100) / 100
);

export const totalDiscountSelector = createSelector(
  [subTotalSelector, miscTotalSelector, discountSelector, orderTypeSelector],
  (subTotal, misc, discount, orderType) => {
    if (orderType) {
      return (
        Math.round(
          ((subTotal.reduce((acc, item) => acc + item, 0) *
            Math.floor(discount * 100)) /
            100) *
            100
        ) / 100
      );
    } else {
      return 0;
    }
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
    nonDiscountedItems,
    orderTypeSelector,
  ],
  (subTotal, tax, discount, dis, misc, state, nonDiscounted, orderType) => {
    if (orderType === 'Misc Items') {
      return (
        Math.round(
          (subTotal.reduce((acc, item) => acc + item, 0) -
            discount +
            nonDiscounted) *
            tax *
            100
        ) / 100
      );
    } else {
      return (
        Math.round(
          (subTotal.reduce((acc, item) => acc + item, 0) -
            discount +
            misc +
            nonDiscounted) *
            tax *
            100
        ) / 100
      );
    }
  }
);

export const totalSelector = createSelector(
  [
    subTotalSelector,
    taxSelector,
    miscTotalSelector,
    totalDiscountSelector,
    nonDiscountedItems,
    orderTypeSelector,
  ],
  (subTotal, tax, misc, discount, nonDiscounted, orderType) => {
    if (orderType === 'Misc Items') {
      const sub =
        Math.floor(subTotal.reduce((acc, item) => acc + item, 0) * 100) / 100;
      return sub + tax + nonDiscounted - discount;
    } else {
      const sub = subTotal.reduce(
        (acc, item) => acc + Math.round(item * 100) / 100,
        0
      );
      return sub + tax + misc + nonDiscounted - discount;
    }
  }
);

export const rushTotal = createSelector(
  [
    subTotalSelector,
    taxSelector,
    miscTotalSelector,
    totalDiscountSelector,
    nonDiscountedItems,
    orderTypeSelector,
  ],
  (subTotal, tax, misc, discount, nonDiscounted, orderType) => {
    if (orderType === 'Misc Items') {
      const sub =
        Math.floor(subTotal.reduce((acc, item) => acc + item, 0) * 100) / 100;
      return sub + tax + nonDiscounted;
    } else {
      const sub = subTotal.reduce(
        (acc, item) => acc + Math.round(item * 100) / 100,
        0
      );
      return sub + tax + misc + nonDiscounted;
    }
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
