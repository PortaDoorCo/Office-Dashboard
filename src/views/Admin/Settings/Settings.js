import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  NavbarText
} from 'reactstrap';


const Settings = (props) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Row>
        <Col>
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/">Settings</NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Doors
              </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      Cope and Stick
                </DropdownItem>
                    <DropdownItem>
                      MT Door
                </DropdownItem>
                    <DropdownItem>
                      MItre Door
                </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Drawer Fronts
              </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      Cope and Stick
                </DropdownItem>
                    <DropdownItem>
                      MT Door
                </DropdownItem>
                    <DropdownItem>
                      MItre Door
                </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Drawer Boxes
              </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      Dovetail Drawer Box
                </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
              <Nav pullRight>
                <NavItem>
                  <NavLink href="/components/">Account Settings</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </Col>
      </Row>
    </div>
  );
}

export default Settings