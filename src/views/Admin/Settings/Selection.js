import React from 'react'
import CopeDoor from './Products/Door/Cope/Cope'
import MTDoor from './Products/Door/MT/MT'
import MiterDoor from './Products/Door/Mitre/Mitre'
import CopeDF from './Products/DrawerFront/Cope/Cope'
import MTDF from './Products/DrawerFront/MT/MT'
import MiterDF from './Products/DrawerFront/Mitre/Mitre'
import AccountSettings from './AccountSettings'
import SlabDoor from './Products/Door/Slab_Type_Door/Slab'
import OnePiece from './Products/Door/One_Piece_Door/One_Piece'
import FaceFrame from './Products/FaceFrame/FaceFrame'
import DrawerBox from './Products/DrawerBox/DrawerBox'
import DoorPricing from './Pricing/Door/DoorPricing'
import DrawerPricing from './Pricing/DrawerBox/DrawerPricing'

const Selection = props => {

    const { selection } = props;
    switch (selection) {
        case 'index':
            return <AccountSettings />
        case 'cope_door':
            return <CopeDoor />
        case 'mt_door':
            return <MTDoor />
        case 'miter_door':
            return <MiterDoor />
        case 'cope_df':
            return <CopeDF />
        case 'mt_df':
            return <MTDF />
        case 'miter_df':
            return <MiterDF />
        case 'slab_type_door':
            return <SlabDoor />
        case 'one_piece_door':
            return <OnePiece />
        case 'face_frames':
            return <FaceFrame />
        case 'drawer_box':
            return <DrawerBox />
        case 'door_pricing':
            return <DoorPricing />
        case 'drawer_pricing':
            return <DrawerPricing />
        default:
            return <AccountSettings />
    }

}

export default Selection;