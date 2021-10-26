import Door from './designs/Door/Door';
import Face_Frame from './designs/Face_Frame/Face_Frame';
import One_Piece_Door from './designs/One_Piece_Door/One_Piece_Door';
import Slab_Door from './designs/Slab_Door/Slab_Door';

export default (info, part, breakdowns) => {

  

  const orderType = info?.orderType?.value ? info.orderType?.value : part?.orderType?.value;

  console.log({orderType});


  if (orderType === 'Door') {
    if (part.construction?.value === 'Slab') {
      return Slab_Door(info, part);
    } else {
      if (part.construction?.value === 'Cope') {
        console.log('hereee');
        return Door(info, part, breakdowns[0]);
      }

      if (part.construction?.value === 'MT') {
        return Door(info, part, breakdowns[1]);
      }

      if (part.construction?.value === 'Miter') {
        return Door(info, part, breakdowns[2]);
      }
    }
  }

  if (orderType === 'DF') {
    if (part?.construction?.value === 'Slab') {
      return Slab_Door(info, part);
    } else {
      if (part.construction?.value === 'Cope') {
        return Door(info, part, breakdowns[4]);
      }

      if (part.construction?.value === 'MT') {
        return Door(info, part, breakdowns[3]);
      }

      if (part.construction?.value === 'Miter') {
        return Door(info, part, breakdowns[5]);
      }
    }
  }

  if (orderType === 'Face_Frame') {
    return Face_Frame(info, part, breakdowns[6]);
  }

  if (orderType === 'One_Piece') {
    return One_Piece_Door(info, part, breakdowns[0]);
  }

  if (orderType === 'One_Piece_DF') {
    return One_Piece_Door(info, part, breakdowns[0]);
  }

  if (orderType === 'Two_Piece') {
    if (part.construction?.value === 'Cope') {
      console.log('heree');
      return Door(info, part, breakdowns[0]);
    }

    if (part.construction?.value === 'MT') {
      return Door(info, part, breakdowns[1]);
    }

    if (part.construction?.value === 'Miter') {
      return Door(info, part, breakdowns[2]);
    }
  }

  if (orderType === 'Two_Piece_DF') {
    if (part.construction?.value === 'Cope') {
      return Door(info, part, breakdowns[4]);
    }

    if (part.construction?.value === 'MT') {
      return Door(info, part, breakdowns[3]);
    }

    if (part.construction?.value === 'Miter') {
      return Door(info, part, breakdowns[5]);
    }
  } else {
    return [];
  }
};
