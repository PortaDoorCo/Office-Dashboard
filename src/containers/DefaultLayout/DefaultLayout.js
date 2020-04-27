import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';

import Cookies from "js-cookie";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { loadOrders, loadCustomers, loadSales, loadShippingMethod, getDeliveries } from "../../redux/orders/actions";
import {
  getWoodtypes,
  getAppliedMoulds,
  getBaseCap,
  getBaseboards,
  getCasings,
  getChairRails,
  getCopeDesigns,
  getCrownMouldings,
  getEdgeSlabs,
  getEdges,
  getFinish,
  getLites,
  get_Miter_DF_Designs,
  getMiterDesigns,
  getMouldingsLengths,
  getMTDesigns,
  get_MT_DF_Designs,
  getPanels,
  get_Plyths_Stools,
  getProfiles,
  getSolidCrowns,
  get_Wainscot_Beads,
  get_Face_Frame_Designs,
  get_Face_Frame_Top_Rails,
  getFurnitureFeet,
  getOnePieceWoodtypes,
  getOnePieceDesigns,
  getOnePiecePanels,
  getOnePieceEdges,

  getBoxBottomThickness,
  getBoxFinishes,
  getBoxNotches,
  getBoxThicknesses,
  getBoxWoodtypes,

  getBreakdowns



} from "../../redux/part_list/actions";
import { login } from "../../redux/users/actions";

import Loader from '../../views/Admin/Loader/Loader'
import { NotificationContainer } from 'react-notifications';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

  componentDidMount = async() => {
    const props = this.props;
    const {
      getWoodtypes,
      getAppliedMoulds,
      getBaseCap,
      getBaseboards,
      getCasings,
      getChairRails,
      getCopeDesigns,
      getCrownMouldings,
      getEdgeSlabs,
      getEdges,
      getFinish,
      getLites,
      get_Miter_DF_Designs,
      getMiterDesigns,
      getMouldingsLengths,
      getMTDesigns,
      get_MT_DF_Designs,
      getPanels,
      get_Plyths_Stools,
      getProfiles,
      getSolidCrowns,
      get_Wainscot_Beads,
      get_Face_Frame_Designs,
      get_Face_Frame_Top_Rails,
      getFurnitureFeet,
      getOnePieceWoodtypes,
      getOnePieceDesigns,
      getOnePiecePanels,
      getOnePieceEdges,

      getBoxBottomThickness,
      getBoxFinishes,
      getBoxNotches,
      getBoxThicknesses,
      getBoxWoodtypes,

      getBreakdowns,

      login,
      loadSales,
      loadOrders,
      getDeliveries

    } = this.props;

    const cookie = await Cookies.get("jwt");

    if(cookie){
      await login(cookie);
      await loadSales(cookie);
      await loadOrders(cookie);
      await getDeliveries(cookie);
      await getBreakdowns(cookie);

      await getWoodtypes(cookie);
      await getAppliedMoulds(cookie);
      await getBaseCap(cookie);
      await getBaseboards(cookie);
      await getCasings(cookie);
      await getChairRails(cookie);
      await getCopeDesigns(cookie);
      await getCrownMouldings(cookie);
      await getEdgeSlabs(cookie);
      await getEdges(cookie);
      await getFinish(cookie);
      await getLites(cookie);
      await get_Miter_DF_Designs(cookie);
      await getMiterDesigns(cookie);
      await getMouldingsLengths(cookie);
      await getMTDesigns(cookie);
      await get_MT_DF_Designs(cookie);
      await getPanels(cookie);
      await get_Plyths_Stools(cookie);
      await getProfiles(cookie);
      await getSolidCrowns(cookie);
      await get_Wainscot_Beads(cookie);
      await get_Face_Frame_Designs(cookie);
      await get_Face_Frame_Top_Rails(cookie);
      await getFurnitureFeet(cookie);
      await getOnePieceWoodtypes(cookie);
      await getOnePieceDesigns(cookie);
      await getOnePiecePanels(cookie);
      await getOnePieceEdges(cookie);

      await getBoxBottomThickness(cookie);
      await getBoxFinishes(cookie);
      await getBoxNotches(cookie);
      await getBoxThicknesses(cookie);
      await getBoxWoodtypes(cookie);
      
      
    } else {
      alert('not logged in')
    }

  }

  render() {


    if (
      !this.props.orders.length>0
    ) {
      return <Loader />;
    } else {
      return (
        <div className="app">
          <NotificationContainer />
          <AppHeader fixed>
            <Suspense fallback={this.loading()}>
              <DefaultHeader />
            </Suspense>
          </AppHeader>
          <div className="app-body">
            <AppSidebar fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              <Suspense>
                <AppSidebarNav navConfig={navigation} {...this.props} />
              </Suspense>
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
            <main className="main">
              <AppBreadcrumb appRoutes={routes} />
              <Container fluid>
                <Suspense fallback={this.loading()}>
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={props => (
                            <route.component {...props} />
                          )} />
                      ) : (null);
                    })}
                    <Redirect from="/" to="/dashboard" />
                  </Switch>
                </Suspense>
              </Container>
            </main>
            <AppAside fixed>
              <Suspense fallback={this.loading()}>
                <DefaultAside />
              </Suspense>
            </AppAside>
          </div>
          <AppFooter>
            <Suspense fallback={this.loading()}>
              <DefaultFooter />
            </Suspense>
          </AppFooter>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  customerDBLoaded: state.Orders.customerDBLoaded,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  loggedIn: state.users.loggedIn
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadOrders,
      loadCustomers,
      loadSales,
      loadShippingMethod,

      getWoodtypes,
      getAppliedMoulds,
      getBaseCap,
      getBaseboards,
      getCasings,
      getChairRails,
      getCopeDesigns,
      getCrownMouldings,
      getEdgeSlabs,
      getEdges,
      getFinish,
      getLites,
      get_Miter_DF_Designs,
      getMiterDesigns,
      getMouldingsLengths,
      getMTDesigns,
      get_MT_DF_Designs,
      getPanels,
      get_Plyths_Stools,
      getProfiles,
      getSolidCrowns,
      get_Wainscot_Beads,
      get_Face_Frame_Designs,
      get_Face_Frame_Top_Rails,
      getFurnitureFeet,
      getOnePieceWoodtypes,
      getOnePieceDesigns,
      getOnePiecePanels,
      getOnePieceEdges,

      getBoxBottomThickness,
      getBoxFinishes,
      getBoxNotches,
      getBoxThicknesses,
      getBoxWoodtypes,
      getDeliveries,

      getBreakdowns,



      login,
      // getBoxThickness,
      // getBoxBottoms,
      // getAssembly,
      // getNotch,
      // getDrawerFinish,
      // getDoorExtras,
      // getDoorOptions
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultLayout);

