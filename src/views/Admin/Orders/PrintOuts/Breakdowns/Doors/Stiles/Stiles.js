import Cope from './designs/Cope/Cope'
import Miter from './designs/Miter/Miter'
import MT from './designs/MT/MT'

export default (info, part) => {

  if (part.design.Construction === "Cope") {
    return Cope(info, part)
  }
  if (part.design.Construction === "M") {
    return Miter(info, part)
  }
  if (part.design.Construction === "MT") {
    return MT(info, part)
  }

};
