import React from 'react'
import CopeDoor from './Products/Door/Cope/Cope'
import MTDoor from './Products/Door/MT/MT'
import MiterDoor from './Products/Door/Mitre/Mitre'
import CopeDF from './Products/DrawerFront/Cope/Cope'
import MTDF from './Products/DrawerFront/MT/MT'
import MiterDF from './Products/DrawerFront/Mitre/Mitre'
import AccountSettings from './AccountSettings'

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
        default:
            return <AccountSettings />
    }

}

export default Selection;