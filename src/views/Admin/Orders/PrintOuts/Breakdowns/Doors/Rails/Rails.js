import Cope from './designs/Cope/Cope'
import Miter from './designs/Miter/Miter'
import MT from './designs/MT/MT'


export default (info, part) => {
  if (part.construction.value === "Cope") {
    return Cope(info, part)
  }
  if (part.construction.value === "M") {
    return Miter(info, part)
  }
  if (part.construction.value === "MT") {
    return MT(info, part)
  }
};
