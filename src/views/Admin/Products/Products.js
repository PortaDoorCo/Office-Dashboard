import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { updateProduct, addProduct, getWoodtypes, deleteProduct, getDesigns, getMoulds, uploadFile, getPhotoId, getEdges, getPanels, getFinish } from '../../../redux/part_list/actions'
import Design from './Products/Design'
import Woodtype from './Products/Woodtype'
import Moulds from './Products/Moulds'
import Edges from './Products/Edges'
import Panels from './Products/Panels'
import Finishes from './Products/Finishes'




const SalesReport = (props) => {

  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  const { role } = props;

  return (
      role.type === 'management' || role.type === 'root' ?
        <div>

          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => { toggle('1'); }}
              >
                <strong>Menu</strong>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => { toggle('2'); }}
              >
                <strong>Design</strong>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '3' })}
                onClick={() => { toggle('3'); }}
              >
                <strong>Woodtype</strong>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '4' })}
                onClick={() => { toggle('4'); }}
              >
                <strong>Moulds</strong>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '5' })}
                onClick={() => { toggle('5'); }}
              >
                <strong>Edges</strong>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '6' })}
                onClick={() => { toggle('6'); }}
              >
                <strong>Panels</strong>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '7' })}
                onClick={() => { toggle('7'); }}
              >
                <strong>Finishes</strong>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <p>Please Select a Product</p>
            </TabPane>
            <TabPane tabId="2">
              <Design
                product={props.designs}
                updateProduct={props.updateProduct}
                addProduct={props.addProduct}
                getProduct={props.getDesigns}
                deleteProduct={props.deleteProduct}
              />
            </TabPane>
            <TabPane tabId="3">
              <Woodtype
                product={props.woodtypes}
                updateProduct={props.updateProduct}
                addProduct={props.addProduct}
                getProduct={props.getWoodtypes}
                deleteProduct={props.deleteProduct}
              />
            </TabPane>
            <TabPane tabId="4">
              <Moulds
                product={props.moulds}
                updateProduct={props.updateProduct}
                addProduct={props.addProduct}
                getProduct={props.getMoulds}
                deleteProduct={props.deleteProduct}
              />
            </TabPane>
            <TabPane tabId="5">
              <Edges
                product={props.edges}
                updateProduct={props.updateProduct}
                addProduct={props.addProduct}
                getProduct={props.getEdges}
                deleteProduct={props.deleteProduct}
              />
            </TabPane>
            <TabPane tabId="6">
              <Panels
                product={props.panels}
                updateProduct={props.updateProduct}
                addProduct={props.addProduct}
                getProduct={props.getPanels}
                deleteProduct={props.deleteProduct}
              />
            </TabPane>
            <TabPane tabId="7">
              <Finishes
                product={props.finish}
                updateProduct={props.updateProduct}
                addProduct={props.addProduct}
                getProduct={props.getFinish}
                deleteProduct={props.deleteProduct}
              />
            </TabPane>
          </TabContent>
        </div> :
        <div>
          Restricted Access
    </div>
    
  );
}

const mapStateToProps = (state, prop) => ({
  designs: state.part_list.designs,
  woodtypes: state.part_list.woodtypes,
  moulds: state.part_list.moulds,
  edges: state.part_list.edges,
  panels: state.part_list.panels,
  finish: state.part_list.finish,
  file: state.part_list.file,
  photoId: state.part_list.photoId,
  role: state.users.user.role
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // updateProduct,
      // addProduct,
      // deleteProduct,
      // getWoodtypes,
      // getDesigns,
      // getMoulds,
      // getEdges,
      // getPanels,
      // getFinish,
      // uploadFile,
      // getPhotoId
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesReport);