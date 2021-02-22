import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col
} from 'reactstrap';
import Selection from './Selection';


const Settings = (props) => {

  const [isOpen, setIsOpen] = useState(false);
  const [selection, setSelection] = useState('index');

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="account-tour">
      <Row>
        <Col>
          <Navbar color="light" light expand="md" className="settings-nav-tour">
            <NavbarBrand onClick={() => setSelection('index')}>Settings</NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Doors
                  </DropdownToggle>
                  <DropdownMenu right >
                    <DropdownItem onClick={() => setSelection('cope_door')} >
                      Cope and Stick
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelection('mt_door')}>
                      MT Door
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelection('miter_door')}>
                      Miter Door
                    </DropdownItem>

                    {/* <DropdownItem onClick={() => setSelection('one_piece_door')}>
                      One Piece Door
                    </DropdownItem> */}
                
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Drawer Fronts
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => setSelection('cope_df')}>
                      Cope and Stick
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelection('mt_df')}>
                      MT Design
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelection('miter_df')}>
                      Miter Design
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelection('slab_type_door')}>
                      Slab Type DF
                    </DropdownItem>
                  </DropdownMenu>

                </UncontrolledDropdown>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Drawer Boxes
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => setSelection('drawer_box')}>
                      Dovetail Drawer Box
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Face Frames
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => setSelection('face_frames')}>
                      Face Frames
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Mouldings
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => setSelection('base_cap')}>
                      Base Caps
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelection('baseboards')}>
                      Baseboards
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelection('casings')}>
                      Casings
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelection('chair_rails')}>
                      Chair Rails
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelection('crown_mouldings')}>
                      Crown Mouldings
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelection('solid_crowns')}>
                      Solid Crowns
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelection('flat_stock')}>
                      Flat Stock
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Misc. Items
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => setSelection('misc_items')}>
                      Misc Items.
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Pricing
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => setSelection('door_pricing')}>
                      Doors
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelection('drawer_pricing')} >
                      Drawer Boxes
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            
            </Collapse>
          </Navbar>
        </Col>
      </Row>
      <Row>
        <Col>
          <Selection selection={selection} />
        </Col>
      </Row>
    </div>
  );
};

export default Settings;