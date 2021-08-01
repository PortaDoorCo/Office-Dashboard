import numQty from 'numeric-quantity';

const pricing = (parts, pricer) => {

  console.log({parts});
  console.log({pricer});

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
      const linePrice = part.dimensions.map((i) => {
        console.log({ part });
  
        const width_input = numQty(i.width);
        const width =
          numQty(i.width) <= 24
            ? 18
            : numQty(i.width) >= 24 &&
              numQty(i.width) <= 48
              ? 24
              : 36;
        const height = numQty(i.height);
        const openings = parseInt(i.openings);
  
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
  
      console.log({linePrice});
      return linePrice;
    } else {
      return 0;
    }
  });

  console.log({item});

  return item;
};

export default pricing;
