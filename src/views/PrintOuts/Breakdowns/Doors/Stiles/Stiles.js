import Door from './designs/Door/Door';
import Custom from './designs/Door/Custom';
import Face_Frame from './designs/Face_Frame/Face_Frame';
import One_Piece_Door from './designs/One_Piece_Door/One_Piece_Door';
import Slab_Door from './designs/Slab_Door/Slab_Door';
import WrappedDoor from './designs/Door/Wrapped';

export default (info, part, breakdowns) => {
  if (info.orderType?.value === 'Door') {
    if (info.construction.value === 'Slab') {
      return Slab_Door(info);
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

  if (info.orderType?.value === 'DF') {
    if (info.construction.value === 'Slab') {
      return Slab_Door(info);
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

  if (info.orderType?.value === 'Face_Frame') {
    return Face_Frame(info, part, breakdowns[6]);
  }

  if (info.orderType?.value === 'One_Piece') {
    return Door(info, part, breakdowns[0]);
  }

  if (info.orderType?.value === 'One_Piece_DF') {
    return Door(info, part, breakdowns[4]);
  }

  if (info.orderType?.value === 'Two_Piece') {
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

  if (info.orderType?.value === 'Two_Piece_DF') {
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
