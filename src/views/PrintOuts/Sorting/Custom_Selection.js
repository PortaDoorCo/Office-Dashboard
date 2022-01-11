import SlabCheck from './Slab_Check';

export default (data, type) => {
  let array = [];

  const start = data.part_list
    .map((i) => {

      if(i.orderType?.value === 'Custom'){
        array.push([i]);
        return null;
      } else {
        return i;
      }
      
    })
    .filter((n) => n);

  const returnValue = [...array, start];

  if (type !== 'Page') {
    return array.concat(start);
  } else {
    return returnValue;
  }
};
