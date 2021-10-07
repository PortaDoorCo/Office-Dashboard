import moment from 'moment';
import Size from '../Breakdowns/Doors/Size';
import { flattenDeep, uniq, flatten, groupBy } from 'lodash';
import Glass_Selection from '../Sorting/Glass_Selection';

export default (data, breakdowns) => {

  let qty = 0;

  const count = data.misc_items.map((part, i) => {
    qty += (i+ 1);
  });

  const table_body = [
    [
      { text: 'Line', style: 'fonts' },
      { text: 'Item', style: 'fonts' },
      { text: 'QTY', style: 'fonts' },
    ]
  ];


  data.misc_items.map((i, index)  => {
    if(i.category === 'preselect') {
      return table_body.push([
        { text: index + 1, style: 'fonts' },

        { text: i.item.NAME, style: 'fonts' },
        { text: i.qty, style: 'fonts' },
      ]);
    } else if (i.category === 'custom') {
      return table_body.push([
        { text: index + 1, style: 'fonts' },

        { text: i.item2, style: 'fonts' },
        { text: i.qty, style: 'fonts' },
      ]);
    } else {
      return [];
    }
  });


  // const table_body = [];

  return [
    {
      columns: [
        {
          stack: [
            { text: `Our Order: ${data.orderNum}`, style: 'fonts' },
            { qr: `${data.id}`, fit: '75', margin: [0, 0, 0, 5] },
            {
              text: `Job: ${data.status === 'Quote' ? 'QUOTE' : ''} - ${
                data.job_info?.poNum.toUpperCase()
              }`,
              style: 'fonts',
            },
          ],
        },
        {
          stack: [
            {
              text: 'Porta Door Co, INC.',
              alignment: 'center',
              style: 'fonts',
            },
            {
              text: 'Phone: 203-888-6191  Fax: 203-888-5803',
              alignment: 'center',
              style: 'fonts',
            },
            {
              text: 'Email: Info@portadoor.com',
              alignment: 'center',
              style: 'fonts',
            },
          ],
        },
        {
          stack: [
            {
              text: 'PACKING SLIP',
              alignment: 'right',
              style: 'woodtype',
              decoration: 'underline',
            },
            {
              text: `Ship Via: ${data.job_info?.shipping_method?.NAME}`,
              alignment: 'right',
              style: 'fonts',
            },
          ],
        },
      ],
    },
    {
      margin: [0,10,0,0],
      columns: [
        {
          width: 200,
          stack: [
            {
              columns: [
                {
                  text: 'Sold To: ',
                  width: 60,
                },
                {
                  stack: [
                    { text: `${data.job_info.customer.Company}` },
                    // {
                    //   text: `${
                    //     data.companyprofile.Contact
                    //       ? data.companyprofile.Contact
                    //       : ''
                    //   }`,
                    //   style: 'fonts',
                    // },
                    {
                      text: `${
                        data.companyprofile.Address1
                          ? data.companyprofile.Address1
                          : ''
                      }`,
                      style: 'fonts',
                    },
                    {
                      text: `${data.companyprofile.City}, ${data.job_info.State} ${data.job_info.Zip}`,
                      style: 'fonts',
                    },
                    {
                      text: `Ph: ${data.companyprofile.Phone1}`,
                      style: 'fonts',
                    },
                    data.companyprofile.Fax
                      ? {
                        text: `Fax: ${
                          data.companyprofile.Fax
                            ? data.companyprofile.Fax
                            : ''
                        }`,
                        style: 'fonts',
                        margin: [0, 0, 0, 10],
                      }
                      : null,
                  ],
                },
              ],

              style: 'fonts',
              margin: [0, 0, 0, 0],
            },
          ],
          style: 'fonts',
        },

        {
          text: `${data.job_info?.Shop_Notes ? data.job_info?.Shop_Notes?.toUpperCase() : ''}`,
          margin: [10,0,0,0]
        },
        {
          stack: [
            {
              margin: [10, 0, 0, 0],
              columns: [
                {
                  width: 40,
                  stack: [
                    {
                      text: 'Ship To: ',
                      style: 'fonts',
                      alignment: 'left',
                      margin: [0, 0, 0, 0],
                    },
                  ],
                },
                {
                  stack: [
                    {
                      text: `${data.job_info.customer.Company}`,
                      style: 'fonts',
                      // alignment: 'right',
                      margin: [0, 0, 0, 0],
                    },
                    {
                      text: `${data.job_info.Address1}`,
                      // alignment: 'right',
                      style: 'fonts',
                      margin: [0, 0, 0, 0],
                    },
                    {
                      text: `${
                        data.job_info.Address2 ? data.job_info.Address2 : ''
                      }`,
                      // alignment: 'right',
                      style: 'fonts',
                      margin: [0, 0, 0, 0],
                    },
                    {
                      text: `${data.job_info.City}, ${data.job_info.State} ${data.job_info.Zip}`,
                      // alignment: 'right',
                      style: 'fonts',
                      margin: [0, 0, 0, 0],
                    },
                    // {
                    //   text: `${data.job_info.Zip}`,
                    //   alignment: 'left',
                    //   style: 'fonts',
                    //   margin: [0, 0, 0, 0],
                    // },
                    {
                      text: `${data.companyprofile.Phone1}`,
                      // alignment: 'right',
                      style: 'fonts',
                      margin: [0, 0, 0, 0],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      text: '==============================================================================',
      alignment: 'center',
    },
    {
      table: {
        headerRows: 1,
        widths: [30, '*', '*'],
        body: table_body,
      },
      layout: {
        hLineWidth: function (i, node) {
          return i === 1 ? 1 : 0;
        },
        vLineWidth: function (i, node) {
          return 0;
        },
        hLineStyle: function (i, node) {
          if (i === 0 || i === node.table.body.length) {
            return null;
          }
          return { dash: { length: 1, space: 1 } };
        },
        paddingLeft: function (i) {
          return i === 0 ? 0 : 8;
        },
        paddingRight: function (i, node) {
          return i === node.table.widths.length - 1 ? 0 : 8;
        },
      },
    },
    {
      text: '==============================================================================',
      alignment: 'center',
    },
    {
      margin: [0, 10, 0, 10],
      columns: [
        {
          text: `Ship Via: ${
            data.job_info &&
                    data.job_info.shipping_method &&
                    data.job_info.shipping_method.NAME
          }`,
          width: 200,
        },
        {
          text: 'Checked By: ______________',
          style: 'totals',
          width: 160,
        },
        {
          text: `Payment Method: ${
            data.companyprofile && data.companyprofile.PMT_TERMS
          }`,
          style: 'totals',
          width: 200,
        },
      ],
    },
    {
      columns: [
        {
          text: '',
          style: 'totals',
          width: 200,
        },
        {
          text: 'Packed By:  _______________',
          style: 'totals',
          width: 347,
        },
        {
          text: '',
        },
      ],
      margin: [0, 0, 0, 10],
    },
    {
      columns: [
        {
          text: '',
          style: 'totals',
          width: 200,
        },

        {
          text: 'Total Weight: _____________',
          style: 'totals',
          width: 347,
        },
        {
          text: '',
        },
      ],
      margin: [0, 0, 0, 10],
    },
    {
      columns: [
        {
          text: '',
          style: 'totals',
          width: 200,
        },
        {
          text: 'Total # Inv\'s: ______________',
          style: 'totals',
          width: 347,
        },
      ],
      margin: [0, 0, 0, 10],
    },
    {
      columns: [
        {
          text: '',
          style: 'totals',
          width: 200,
        },
        {
          text: 'Received In Good Condition: ___________________________',
          style: 'totals',
          width: 347,
        },
      ],
      margin: [0, 0, 0, 10],
    },
  ];
};
