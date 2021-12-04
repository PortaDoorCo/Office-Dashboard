import { createSelector } from 'reselect';
import numQty from 'numeric-quantity';
import orderType from '../components/DoorOrders/DoorInfo/orderType';

const pricingSelector = (state) => {
  const pricing = state.part_list.pricing ? state.part_list.pricing[0] : 0;
  return pricing;
};

const discountSelector = (state) => {
  const orders = state.form.Order;

  if (orders) {
    if (state.form.Order.values && state.form.Order.values.discount) {
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
  [partListSelector, pricingSelector, orderTypeSelector],
  (parts, pricer, orderType) => {

    console.log({orderType});

    if(orderType === 'Door Order' || orderType === 'Face Frame'){
      return parts.map((part, index) => {
        console.log({orderType});
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
  
        
        const profile_cost = part.profile?.Extra_Charge ? part.profile?.Extra_Charge : 0;
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
            const linePrice = part.dimensions.map((i) => {
              const width_input = Math.ceil(numQty(i.width));
              const width =
                Math.ceil(numQty(i.width)) < 24
                  ? 18
                  : Math.ceil(numQty(i.width)) >= 24 &&
                    Math.ceil(numQty(i.width)) <= 48
                    ? 24
                    : 36;
              const height = Math.ceil(numQty(i.height));
              const openings = parseInt(i.openings);
              const finish = part.face_frame_finishing
                ? part.face_frame_finishing.PRICE
                : 0;
  
              const width_finish = width_input >= 35 ? finish * 0.25 : 0;
              const height_finish = height >= 97 ? finish * 0.25 : 0;
  
              const finishing = finish + width_finish + height_finish;
  
              let overcharge = 0;
  
              if (width_input >= 48 || height >= 96) {
                overcharge = 100;
              }
  
              const price = eval(pricer && pricer.face_frame_pricing);
  
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
            const linePrice = part.dimensions.map((i) => {
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
                  (part.design && part.design.PROFILE_WIDTH) !== numQty(i.topRail)
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
  
              //test
              //Slab Doors here
  
              if (
                part.orderType.value === 'Door' &&
                part.construction.value === 'Slab'
              ) {
                price =
                  (width * height) / 144 > 2
                    ? ((width * height) / 144) * wood + (6.5 + edge) + extraCost
                    : 2 * wood + (6.5 + edge) + extraCost;
              } else if (
                part.orderType.value === 'DF' &&
                part.construction.value === 'Slab'
              ) {
                price =
                  (width * height) / 144 > 1
                    ? ((width * height) / 144) * wood + (6.5 + edge) + extraCost
                    : 1 * wood + (6.5 + edge) + extraCost;
              } else if (part.orderType.value === 'DF') {
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
      });
    }

    if(orderType === 'Drawer Order'){
      return  parts.map((part, index) => {
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
        return part?.dimensions?.map((i, p) => {
          if (item[index][p]) {
            if (i.qty) {
              if (
                (part?.orderType?.value === 'Door' ||
                part?.orderType?.value === 'Glass' ||
                part?.orderType?.value === 'One_Piece' ||
                part?.orderType?.value === 'Two_Piece') &&
                ((parseInt(i.panelsH) === 1 && numQty(i.height) >= 48) ||
                  (parseInt(i.panelsW) === 1 && numQty(i.width) >= 24))
              ) {
                const base = item[index][p] * parseInt(i.qty);
                const add = base * 0.2;
                const price = base + add;
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

export const nonDiscountedItems = createSelector(
  [partListSelector],
  (parts) =>
    parts.map((i) => {
      return i.applied_profile?.UPCHARGE ? i.applied_profile?.UPCHARGE : 0;
    }).reduce((acc, item) => acc + item, 0)
);

export const addPriceSelector = createSelector(
  [partListSelector, pricingSelector, itemPriceSelector, orderTypeSelector],
  (parts, pricer, item, orderType) =>
  {
    if(orderType === 'Door Order') {
      return  parts.map((part, index) => {
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

export const mouldingPriceSelector = createSelector(
  [OrderSelector],
  (Order) =>
    Order.map((i) => {
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
  [mouldingPriceSelector, OrderSelector],
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

export const miscLineItemSelector = createSelector(
  [miscItemsSelector],
  (misc) => misc
);


export const subTotalSelector = createSelector(
  [linePriceSelector, miscTotalSelector, orderTypeSelector, mouldingTotalSelector],
  (prices, misc,orderType, moulding) =>
  {
    console.log({misc});
    console.log({misc});
    console.log({orderType});
    console.log({moulding});

    if(orderType){
      if (orderType === 'Mouldings'){
        return [moulding];
      } if (orderType === 'Misc Items'){
        return [misc];
      } else {
        return prices.map((i, index) => {
          if (i) {
            let price = parseFloat(i.reduce((acc, item) => acc + item, 0));
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
  (subTotal, misc) => subTotal.reduce((acc, item) => acc + item, 0)
);

export const totalDiscountSelector = createSelector(
  [subTotalSelector, miscTotalSelector, discountSelector, orderTypeSelector],
  (subTotal, misc, discount, orderType) => {
    console.log({subTotal});
    if(orderType){
      if(orderType === 'Misc Items'){
        return 0;
      } else {
        return subTotal.reduce((acc, item) => acc + item, 0) * discount;
      }
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
    orderTypeSelector
  ],
  (subTotal, tax, discount, dis, misc, state, nonDiscounted, orderType) => {

    if(orderType === 'Misc Items'){
      return (
        (subTotal.reduce((acc, item) => acc + item, 0) - discount + nonDiscounted) * tax
      );
    } else {
      return (
        (subTotal.reduce((acc, item) => acc + item, 0) - discount + misc + nonDiscounted) * tax
      );
    }

  }
);

export const totalSelector = createSelector(
  [subTotalSelector, taxSelector, miscTotalSelector, totalDiscountSelector, nonDiscountedItems, orderTypeSelector],
  (subTotal, tax, misc, discount, nonDiscounted, orderType) => {

    if(orderType === 'Misc Items'){
      return (
        subTotal.reduce((acc, item) => acc + item, 0) + tax + nonDiscounted - discount
      );
    } else {
      return (
        subTotal.reduce((acc, item) => acc + item, 0) + tax + misc + nonDiscounted - discount
      );
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