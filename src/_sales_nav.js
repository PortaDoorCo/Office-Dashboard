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
      name: 'Reports',
      icon: '',
      children: [
        {
          name: 'Salesmen Reports',
          url: '/sales-reports',
        },
      ]
    },
    {
      name: 'Settings',
      url: '/settings',
    },
    {
      name: 'Catalog ',
      url: '/catalog',
    },
  
  
    // {
    //   name: 'Calendar',
    //   url: '/calendar',
    // },
  
  ]
};
  