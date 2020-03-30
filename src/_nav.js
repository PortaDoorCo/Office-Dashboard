export default {
  items: [
    {
      title: true,
      name: 'Dashboard',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'dashboard',

    },
    {
      title: true,
      name: '',
      icon: 'icon-speedometer',

    },
    {
      name: 'Door-Order',
      url: '/door-order',

    },
    {
      name: 'Drawer Order',
      url: '/drawer-order',
    },
    {
      name: 'Reports',
      icon: '',
      children: [
        {
          name: 'Orders',
          url: '/view-orders',
        },
        {
          name: 'Sales Reports',
          url: '/sales-reports',
        },
        {
          name: 'Tracking',
          url: '/tracking',
        },

        {
          name: 'Late List',
          url: '/late-list',
        },

        {
          name: 'Purchase Orders',
          url: '/purchase-orders',
        },


      ]
    },

    {
      name: 'Customers',
      url: '/customers',

    },
    {
      name: 'Products',
      url: '/products',

    },


    {
      name: 'Calendar',
      url: '/calendar',

    },

  ]
};
