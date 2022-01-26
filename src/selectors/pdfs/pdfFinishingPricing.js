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

        const width_finish = width_input >= 35 ? finish * 0.25 : 0;
        const height_finish = height >= 97 ? finish * 0.25 : 0;

        const openings = parseInt(i.openings);
        const opening_add = openings > 1 && finish > 0 ? (openings - 1) * 5 : 0;

        const finishing = finish + (width_finish + height_finish + opening_add);

        if (height > -1) {
          return Math.floor(finishing * 100) / 100;;
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
