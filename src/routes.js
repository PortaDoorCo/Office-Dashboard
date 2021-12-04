import React from 'react';

const Dashboard = React.lazy(() => import('./views/Admin/Dashboard/Dashboard'));
const DoorOrders = React.lazy(() => import('./views/Admin/DoorOrders/DoorOrders'));
const DrawerOrders = React.lazy(() => import('./views/Admin/DrawerOrders/DrawerOrder'));
const Orders = React.lazy(() => import('./views/Admin/Orders/OrderTable'));
const Customers = React.lazy(() => import('./views/Admin/Customers/Customers/CompanyTable'));
const Settings = React.lazy(() => import('./views/Admin/Settings/Settings'));
const Tracking = React.lazy(() => import('./views/Admin/Tracking/Tracking'));
const PurchaseOrders = React.lazy(() => import('./views/Admin/PurchaseOrders/PurchaseOrders'));
const SalesReport = React.lazy(() => import('./views/Admin/SalesReport/SalesReport'));
const LateList = React.lazy(() => import('./views/Admin/Late_List/Late_List'));
const Users = React.lazy(() => import('./views/Admin/Users/Users'));
const MiscItems = React.lazy(() => import('./views/Admin/MiscItems/MiscItems'));
const Catalog = React.lazy(() => import('./views/Admin/Catalog/Catalog'));
const Mouldings = React.lazy(() => import('./views/Admin/Mouldings/Mouldings'));
const FaceFrames = React.lazy(() => import('./views/Admin/Face_Frames/FaceFrames'));
const OrderEntry = React.lazy(() => import('./views/Admin/OrderEntry/OrderEntry'));



// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, component: Dashboard, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/door-order', name: 'Door Order', component: OrderEntry, type: 'Door Order' },
  { path: '/drawer-order', name: 'Drawer Order', component: OrderEntry, type: 'Drawer Order' },
  { path: '/view-orders', name: 'Orders', component: Orders },
  { path: '/customers', name: 'Customers', component: Customers },
  { path: '/settings', name: 'Settings', component: Settings, className: 'settings-tour' },
  { path: '/tracking', name: 'Tracking', component: Tracking },
  { path: '/purchase-orders', name: 'Purchase Orders', component: PurchaseOrders },
  { path: '/sales-reports', name: 'Sales Reports', component: SalesReport },
  { path: '/late-list', name: 'Late List', component: LateList },
  { path: '/users', name: 'Users', component: Users },
  { path: '/misc-items', name: 'MiscItems', component: OrderEntry, type: 'Misc Items' },
  { path: '/catalog', name: 'Catalog', component: Catalog },
  { path: '/mouldings', name: 'Mouldings', component: OrderEntry, type: 'Mouldings' },
  { path: '/face-frames', name: 'FaceFrames', component: OrderEntry, type: 'Face Frame' },
];


export default routes;
