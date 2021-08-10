import { flatten } from 'lodash';
import GlassCheck from './GlassCheck';

const GlassSort = (part) => {
  const dimensions = part.dimensions.map((i, j) => {
    return {...GlassCheck(i)};
  });

  const sort = dimensions.sort((a, b) => a.glass_index - b.glass_index);

  return sort;
};

export default GlassSort;
