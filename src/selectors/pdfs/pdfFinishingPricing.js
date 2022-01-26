import numQty from 'numeric-quantity';

const pricing = (parts, pricer) => {
  const item = parts.map((part, index) => {
    if (part.dimensions) {
      const linePrice = part.dimensions.map((i) => {
        const width_input = numQty(i.width);
        const height = numQty(i.height);
        const finish = part.face_frame_finishing
          ? part.face_frame_finishing.PRICE
          : 0;


        let width =
              numQty(i.width) <= 24
                ? 18
                : numQty(i.width) >= 24 && numQty(i.width) <= 48
                  ? 24
                  : 36;

    
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
        const opening_add = openings > 1 && finish > 0 ? (openings - 1) * 5 : 0;

        const finishing = finish + (width_finish + height_finish + opening_add);

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
  });

  return item;
};

export default pricing;
