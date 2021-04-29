import { flatten } from 'lodash';
import GlassCheck from './GlassCheck';

const GlassSort = (data) => {

  const part = data.part_list;
  const dimensions = part.map(i => i.dimensions);
  const flatten_dimensions = flatten(dimensions);


  return flatten_dimensions.map(i => {
    return GlassCheck(i);
  });
};

export default GlassSort;