import React from 'react';

const Dashboard = React.lazy(() => import('./views/Admin/Dashboard/Dashboard'));
const Orders = React.lazy(() => import('./views/Admin/Orders/OrderTable'));
const Customers = React.lazy(() =>
  import('./views/Admin/Customers/Customers/CompanyTable')
);
const Settings = React.lazy(() => import('./views/Admin/Settings/Settings'));
const Tracking = React.lazy(() => import('./views/Admin/Tracking/Tracking'));
const PurchaseOrders = React.lazy(() =>
  import('./views/Admin/PurchaseOrders/PurchaseOrders')
);
const SalesReport = React.lazy(() =>
  import('./views/Admin/SalesReport/SalesReport')
);
// const LateList = React.lazy(() => import('./views/Admin/Late_List/Late_List'));
const Users = React.lazy(() => import('./views/Admin/Users/Users'));
const Catalog = React.lazy(() => import('./views/Admin/Catalog/Catalog'));
const OrderContainer = React.lazy(() =>
  import('./views/Admin/OrderEntry/Container')
);
const Deliveries = React.lazy(() =>
  import('./views/Admin/Deliveries/Deliveries')
);

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, component: Dashboard, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  {
    path: '/door-order',
    name: 'Door Order',
    component: OrderContainer,
    type: 'Door Order',
  },
  {
    path: '/drawer-order',
    name: 'Drawer Order',
    component: OrderContainer,
    type: 'Drawer Order',
  },
  { path: '/view-orders', name: 'Orders', component: Orders },
  { path: '/customers', name: 'Customers', component: Customers },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    className: 'settings-tour',
  },
  { path: '/tracking', name: 'Tracking', component: Tracking },
  {
    path: '/purchase-orders',
    name: 'Purchase Orders',
    component: PurchaseOrders,
  },
  { path: '/sales-reports', name: 'Sales Reports', component: SalesReport },
  // { path: '/late-list', name: 'Late List', component: LateList },
  { path: '/users', name: 'Users', component: Users },
  {
    path: '/misc-items',
    name: 'MiscItems',
    component: OrderContainer,
    type: 'Misc Items',
  },
  { path: '/catalog', name: 'Catalog', component: Catalog },
  {
    path: '/mouldings',
    name: 'Mouldings',
    component: OrderContainer,
    type: 'Mouldings',
  },
  {
    path: '/face-frames',
    name: 'FaceFrames',
    component: OrderContainer,
    type: 'Face Frame',
  },
  { path: '/deliveries', name: 'Deliveries', component: Deliveries },
];

export default routes;
