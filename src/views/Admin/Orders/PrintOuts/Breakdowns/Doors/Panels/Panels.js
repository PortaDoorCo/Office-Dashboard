import Cope_Door from './designs/Cope/Cope_Door'
import Miter_Door from './designs/Miter/Miter_Door'
// import MT from './designs/MT/MT'


export default (info, part) => {
  if (part.construction.value === "Cope") {
    return Cope_Door(info, part)
  }
  if (part.construction.value === "M") {
    return Miter_Door(info, part)
  }
  if (part.construction.value === "MT") {
    return
    // return MT(info, part)
  }
};
