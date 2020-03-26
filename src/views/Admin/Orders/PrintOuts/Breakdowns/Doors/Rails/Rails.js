import Cope_Door from './designs/Cope/Cope_Door'
import Miter_Door from './designs/Miter/Miter_Door'
import MT_Door from './designs/MT/MT_Door'

import Cope_DF from './designs/Cope/Coper_DF'
import Miter_DF from './designs/Miter/Miter_DF'
import MT_DF from './designs/MT/MT_DF'

import Face_Frame from './designs/Face_Frame/Face_Frame'




export default (info, part) => {

  if(part.orderType.value === "Door") {
    if (part.construction.value === "Cope") {
      return Cope_Door(info, part)
    }
    if (part.construction.value === "M") {
      return Miter_Door(info, part)
    }
    if (part.construction.value === "MT") {
      return MT_Door(info, part)
    }
  }

  if(part.orderType.value === "DF") {
    if (part.construction.value === "Cope") {
      return Cope_DF(info, part)
    }
    if (part.construction.value === "M") {
      return Miter_DF(info, part)
    }
    if (part.construction.value === "MT") {
      return MT_DF(info, part)
    }
  }

  if(part.orderType.value === "Face_Frame") {
    return Face_Frame(info,part)
  }



};
