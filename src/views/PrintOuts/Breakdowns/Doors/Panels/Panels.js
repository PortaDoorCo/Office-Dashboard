import Door from './designs/Door/Door';
import Custom from './designs/Door/Custom';
import Face_Frame from './designs/Face_Frame/Face_Frame';
import One_Piece_Door from './designs/One_Piece_Door/One_Piece_Door';
import Slab_Door from './designs/Slab_Door/Slab_Door';
import WrappedDoor from './designs/Door/Wrapped';

export default (info, part, breakdowns) => {
  const orderType = info?.orderType?.value
    ? info.orderType?.value
    : part?.orderType?.value;

  if (orderType === 'Door') {
    if (info.construction?.value === 'Slab') {
      return Slab_Door(info, part);
    } else {
      if (info.construction?.value === 'Cope') {
        return Door(info, part, breakdowns[0]);
      }

      if (info.construction?.value === 'MT') {
        return Door(info, part, breakdowns[1]);
      }

      if (info.construction?.value === 'Miter') {
        return Door(info, part, breakdowns[2]);
      }

      if (info.construction?.value === 'Wrapped') {
        return WrappedDoor(info, part, breakdowns[0]);
      }
    }
  }

  if (info.orderType?.value === 'Custom') {
    return Custom(info, part);
  }

  if (orderType === 'DF') {
    if (info?.construction?.value === 'Slab') {
      return Slab_Door(info, part);
    } else {
      if (info.construction?.value === 'Cope') {
        return Door(info, part, breakdowns[4]);
      }

      if (info.construction?.value === 'MT') {
        return Door(info, part, breakdowns[3]);
      }

      if (info.construction?.value === 'Miter') {
        return Door(info, part, breakdowns[5]);
      }
      if (info.construction?.value === 'Wrapped') {
        return WrappedDoor(info, part, breakdowns[0]);
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
    if (info.construction?.value === 'Cope') {
      return Door(info, part, breakdowns[0]);
    }

    if (info.construction?.value === 'MT') {
      return Door(info, part, breakdowns[1]);
    }

    if (info.construction?.value === 'Miter') {
      return Door(info, part, breakdowns[2]);
    }
  }

  if (orderType === 'Two_Piece_DF') {
    if (info.construction?.value === 'Cope') {
      return Door(info, part, breakdowns[4]);
    }

    if (info.construction?.value === 'MT') {
      return Door(info, part, breakdowns[3]);
    }

    if (info.construction?.value === 'Miter') {
      return Door(info, part, breakdowns[5]);
    }
  } else {
    return [];
  }
};
