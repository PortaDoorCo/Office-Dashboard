import React from 'react';
import CopeDoor from './Products/Door/Cope/Cope';
import MTDoor from './Products/Door/MT/MT';
import MiterDoor from './Products/Door/Mitre/Mitre';
import CopeDF from './Products/DrawerFront/Cope/Cope';
import MTDF from './Products/DrawerFront/MT/MT';
import MiterDF from './Products/DrawerFront/Mitre/Mitre';
import AccountSettings from './AccountSettings';
// import Door from './Products/Door/Door/Door';
import SlabDoor from './Products/Door/Slab_Type_Door/Slab';
import OnePiece from './Products/Door/One_Piece_Door/One_Piece';
import FaceFrame from './Products/FaceFrame/FaceFrame';
import DrawerBox from './Products/DrawerBox/DrawerBox';
import DoorPricing from './Pricing/Door/DoorPricing';
import DrawerPricing from './Pricing/DrawerBox/DrawerPricing';
import BaseCap from './Products/Mouldings/Base_Cap/Base_Cap';
import Baseboard from './Products/Mouldings/Baseboard/Baseboard';
import Casings from './Products/Mouldings/Casings/Casings';
import ChairRails from './Products/Mouldings/Chair_Rails/Chair_Rails';
import CrownMouldings from './Products/Mouldings/Crown_Mouldings/Crown_Mouldings';
import SolidCrowns from './Products/Mouldings/Solid_Crowns/Solid_Crowns';
import MiscItems from './Products/MiscItems/Misc_Items';
import FlatStock from './Products/Mouldings/Flat_Stock/Flat_Stock';

const Selection = props => {

  const { selection } = props;
  switch (selection) {
    case 'index':
      return <AccountSettings />;
    // case 'door':
    //   return <Door />;
    case 'cope_door':
      return <CopeDoor />;
    case 'mt_door':
      return <MTDoor />;
    case 'miter_door':
      return <MiterDoor />;
    case 'cope_df':
      return <CopeDF />;
    case 'mt_df':
      return <MTDF />;
    case 'miter_df':
      return <MiterDF />;
    case 'slab_type_door':
      return <SlabDoor />;
    case 'one_piece_door':
      return <OnePiece />;
    case 'face_frames':
      return <FaceFrame />;
    case 'drawer_box':
      return <DrawerBox />;
    case 'door_pricing':
      return <DoorPricing />;
    case 'drawer_pricing':
      return <DrawerPricing />;
    case 'base_cap':
      return <BaseCap />;
    case 'baseboards':
      return <Baseboard />;
    case 'casings':
      return <Casings />;
    case 'chair_rails':
      return <ChairRails />;
    case 'crown_mouldings':
      return <CrownMouldings />;
    case 'solid_crowns':
      return <SolidCrowns />;
    case 'misc_items':
      return <MiscItems />;
    case 'flat_stock':
      return <FlatStock />;
    default:
      return <AccountSettings />;
  }

};

export default Selection;