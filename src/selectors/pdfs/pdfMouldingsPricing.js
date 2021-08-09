import numQty from 'numeric-quantity';

const pricing = (parts, pricer) => {
  const items = parts.map((i) => {
    let price = 0;

    if (i.item) {
      const { item, woodtype, linearFT, grade } = i;

      let feet = (item.MOULDING_WIDTH * 12) / 144;
      let waste = feet * 1.25;
      let multiplier = item.Multiplier;
      let wood = woodtype ? woodtype[grade?.db_name] * 0.25 : 0;
      let premium = 0;

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

      price = a * wood * parseFloat(linearFT) * premium;
    }

    return price;
  });

  const withQty = items.map((i, index) => {
    const qty = parts[index].qty ? parts[index].qty : 0;
    const price = i ? i : 0;

    return price * parseInt(qty);
  });

  return withQty;
};

export default pricing;
