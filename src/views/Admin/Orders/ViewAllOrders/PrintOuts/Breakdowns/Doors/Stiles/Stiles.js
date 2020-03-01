import Cope from './designs/Cope'
import Miter from './designs/Miter'
import MT from './designs/MT'

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
