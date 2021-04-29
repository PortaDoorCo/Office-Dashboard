import { flatten } from 'lodash';


export default (data) => {
  console.log({part_list: data.part_list});
  const part = data.part_list;
  const dimensions = part.map(i => i.dimensions);
  const dimensions_flatten = flatten(dimensions);
  console.log({dimensions_flatten});

  const glass_check_name = dimensions_flatten.map(i => {
    return Array.from(Array(parseInt(i.panelsH)).keys())
      .map((i, v) => {
        return `glass_check_${i}`;
      });
  });

  console.log({glass_check_name});

  const glass_check = dimensions_flatten.map((i, index) => {
    return glass_check_name[index].map(j => i.hasOwnProperty(j));
  });

  console.log({glass_check: glass_check.map(i => i.includes(true))});

};