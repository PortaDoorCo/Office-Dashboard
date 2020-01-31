import React from 'react';

const Dashboard = React.lazy(() => import('./views/Admin/Dashboard'));
const DoorOrders = React.lazy(() => import('./views/Admin/Orders/DoorOrders/DoorOrders'));
const DrawerOrders = React.lazy(() => import('./views/Admin/Orders/DrawerOrders/DrawerOrder'));
const Orders = React.lazy(() => import('./views/Admin/Orders/ViewAllOrders/ViewAllOrders'));
const Customers = React.lazy(() => import('./views/Admin/Customers/Customers/Companies'));
const Products = React.lazy(() => import('./views/Admin/Products/Products'));
const Calendar = React.lazy(() => import('./views/Admin/Calendar'));
const Tracking = React.lazy(() => import('./views/Admin/Tracking/Tracking'));
const PurchaseOrders = React.lazy(() => import('./views/Admin/PurchaseOrders/PurchaseOrders'));
const SalesReport = React.lazy(() => import('./views/Admin/SalesReport/SalesReport'));
const LateList = React.lazy(() => import('./views/Admin/Late_List/Late_List'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/door-order', name: 'Door Orders', component: DoorOrders },
  { path: '/drawer-order', name: 'Drawer Orders', component: DrawerOrders },
  { path: '/view-orders', name: 'Orders', component: Orders },
  { path: '/customers', name: 'Customers', component: Customers },
  { path: '/products', name: 'Products', component: Products },
  { path: '/calendar', name: 'Calendar', component: Calendar },
  { path: '/tracking', name: 'Tracking', component: Tracking },
  { path: '/purchase-orders', name: 'Purchase Orders', component: PurchaseOrders },
  { path: '/sales-reports', name: 'Sales Reports', component: SalesReport },
  { path: '/late-list', name: 'Late List', component: LateList },
];


export default routes;
