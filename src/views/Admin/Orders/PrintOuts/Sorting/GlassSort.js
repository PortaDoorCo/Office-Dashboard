import { flatten } from 'lodash';
import GlassCheck from './GlassCheck';

const GlassSort = (part) => {

  console.log({part});

  const dimensions =  part.dimensions.map(i => {
    return GlassCheck(i);
  });


  const sort = dimensions.sort((a,b) => a.glass_index - b.glass_index );

  return sort;


};

export default GlassSort;