import numQty from 'numeric-quantity';

const pricing = (parts, pricer) => {
  const item = parts.map((part, index) => {
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

    const wood =
      part.woodtype && part.thickness.value === 1
        ? part.woodtype.STANDARD_GRADE
        : part.woodtype && part.thickness.value === 2
          ? part.woodtype.SELECT_GRADE
          : part.woodtype && part.thickness.value === 3
            ? part.woodtype.STANDARD_GRADE_THICK
            : part.woodtype && part.thickness.value === 4
              ? part.woodtype.SELECT_GRADE_THICK
              : part.woodtype && part.thickness.value === 5
                ? part.woodtype.SIX_QUARTER
                : part.woodtype && part.thickness.value === 6
                  ? part.woodtype.SIX_QUARTER_THICK
                  : 0;

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

    if (part?.orderType?.value === 'Face_Frame') {
      const linePrice = part.dimensions.map((i) => {
        console.log({ i });

        const ff_wood = part?.woodtype?.STANDARD_GRADE;
        const width = Math.ceil(numQty(i.width));
        const height = Math.ceil(numQty(i.height));
        const openings = parseInt(i.openings);

        const price = eval(pricer && pricer.face_frame_pricing);

        console.log({ price });

        return price;
      });

      console.log({ linePrice });

      return linePrice;
    } else {
      const linePrice = part.dimensions.map((i) => {
        console.log({ i });

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
            (part.profile && part.profile.PROFILE_WIDTH) !== numQty(i.leftStile)
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
            (part.profile && part.profile.PROFILE_WIDTH) !== numQty(i.topRail)
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
            (part.design && part.design.PROFILE_WIDTH) !== numQty(i.leftStile)
          ) {
            calc('leftStile', part.design?.PROFILE_WIDTH, price);
          }
          //rightStile
          if (
            (part.design && part.design.PROFILE_WIDTH) !== numQty(i.rightStile)
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
            (part.design && part.design.PROFILE_WIDTH) !== numQty(i.bottomRail)
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
            extraCost;
        } else {
          price =
            eval(pricer && pricer.door_pricing) +
            leftStileAdd +
            rightStileAdd +
            topRailAdd +
            bottomRailAdd +
            extraCost;
        }

        return price;
      });

      console.log({ linePrice });

      return linePrice;
    }
  });

  const addCharge = parts.map((part, index) => {
    return part.dimensions.map((i, p) => {
      const base = item[index][p] * parseInt(i.qty);

      if (
        (parseInt(i.panelsH) === 1 && numQty(i.height) >= 48) ||
        (parseInt(i.panelsW) === 1 && numQty(i.width) >= 24)
      ) {
        const add = base * 0.2;
        return base + add;
      } else {
        return base;
      }
    });
  });

  return addCharge;
};

export default pricing;
