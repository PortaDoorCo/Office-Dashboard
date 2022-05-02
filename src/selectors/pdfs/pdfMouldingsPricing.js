import numQty from 'numeric-quantity';

const pricing = (parts, pricer) => {
  const items = parts.map((i) => {
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
  });

  const withQty = items.map((i, index) => {
    const price = i ? i : 0;
    return Math.floor(price * 100) / 100;
  });

  return withQty;
};

export default pricing;
