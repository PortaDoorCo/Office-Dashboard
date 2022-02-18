import numQty from 'numeric-quantity';

const pricing = (parts, pricer, itemPrice) => {
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

        const price =itemPrice?.length > 0 && itemPrice[index]?.length > 0
        ? itemPrice[index][j]
        : Math.floor((eval(pricer && pricer.face_frame_pricing) * 100) / 100) + extraCost;
         


        if (height > -1) {
          return (price * parseInt(i.qty))
        } else {
          return 0;
        }
      });

      return linePrice;
    } else {
      return 0;
    }
  });

  return item;
};

export default pricing;