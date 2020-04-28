import React, { useState } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const Parameters = props => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    const keys = props.attributes

    return (
        <div>
            <Dropdown outline color="danger" isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle outline color="danger" caret>
                    {props.name}
                </DropdownToggle>
                <DropdownMenu outline color="danger">
                    {keys.map(i => {
                        return <DropdownItem onClick={() => props.onBtnClick(`${i}`)} color="danger">{i.toUpperCase()}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}

export default Parameters;