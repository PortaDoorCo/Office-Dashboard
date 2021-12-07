import SlabCheck from './Slab_Check';

export default (data, type) => {
  let array = [];

  const start = data.part_list
    .map((i) => {
      const part = SlabCheck(i);

      if(part.hasSlab){
        array.push([part]);
        return null;
      } else {
        return part;
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
