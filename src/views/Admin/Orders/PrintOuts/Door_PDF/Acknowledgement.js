import moment from 'moment';
import Size from '../Breakdowns/Doors/Size';

export default (data) => {
  const qty = data.part_list.map((part, i) => {
    return part.dimensions
      .map((dim, index) => {
        return parseInt(dim.qty);
      })
      .reduce((acc, item) => acc + item, 0);
  });

  const subTotal = data.subTotals.reduce((acc, item) => acc + item, 0);

  const balancePaid = data.balance_history.reduce(function (
    accumulator,
    balance
  ) {
    return accumulator + balance.balance_paid;
  },
  0);

  const balanceDue = data.total - balancePaid;

  const miscTotal = data.misc_items.map((i) => {
    if (i.category === 'preselect') {
      return parseFloat(i.qty) * parseFloat(i.price);
    } else {
      return i.pricePer ? parseFloat(i.qty) * parseFloat(i.pricePer) : 0;
    }
  });

  const discountTotal = subTotal * (data.discount / 100);

  const discountSubTotal = subTotal - subTotal * (data.discount / 100);

  console.log({ data });

  return [
    {
      columns: [
        {
          stack: [
            'Acknowledgement',
            {
              stack: [
                { text: `Customer - ${data.job_info.customer.Company}` },
                {
                  text: `${
                    data.companyprofile.Contact
                      ? data.companyprofile.Contact
                      : ''
                  }`,
                  style: 'fonts',
                },
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
                { text: `Ph: ${data.companyprofile.Phone1}`, style: 'fonts' },
                {
                  text: `Fax: ${
                    data.companyprofile.Fax ? data.companyprofile.Fax : ''
                  }`,
                  style: 'fonts',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: `Terms: ${
                    data.companyprofile.PMT_TERMS
                      ? data.companyprofile.PMT_TERMS
                      : ''
                  }`,
                  style: 'fonts',
                },
              ],
              style: 'fontsBold',
              margin: [0, 40, 0, 0],
            },
          ],
          style: 'headerFont',
        },

        {
          stack: [
            { text: 'Porta Door Co. Inc.', alignment: 'center' },
            { text: '65 Cogwheel Lane', alignment: 'center' },
            { text: 'Seymour, CT', alignment: 'center' },
            {
              text: '203-888-6191',
              alignment: 'center',
              margin: [0, 0, 0, 10],
            },
            { text: moment().format('DD-MMM-YYYY'), alignment: 'center' },
          ],
        },
        {
          stack: [
            {
              text:
                data.job_info.Rush && data.job_info.Sample
                  ? 'Sample / Rush'
                  : data.job_info.Rush
                    ? 'Rush'
                    : data.job_info.Sample
                      ? 'Sample'
                      : '',
              alignment: 'right',
              style: 'rushFonts',
            },
            {
              text: `Order #: ${data.orderNum}`,
              alignment: 'right',
              style: 'headerFont',
            },
            {
              text: `${
                data.status === 'Quote'
                  ? ''
                  : `Est. Completion: ${moment(data.job_info.DueDate).format(
                    'MM/DD/YYYY'
                  )}`
              }`,
              alignment: 'right',
              style: 'headerFont',
            },
            {
              text: `Ship Via: ${
                data.job_info.ShippingMethod
                  ? data.job_info.ShippingMethod.NAME
                  : ' '
              }`,
              alignment: 'right',
              style: 'headerFont',
            },
            {
              text: `Salesmen: ${data.sale ? data.sale.fullName : ''}`,
              alignment: 'right',
              style: 'headerFont',
            },

            {
              stack: [
                {
                  text: `Job: ${
                    data.job_info.poNum.length > 0
                      ? data.job_info.poNum
                      : 'None'
                  }`,
                  alignment: 'right',
                  margin: [0, 0, 0, 0],
                  style: 'fonts',
                },
                {
                  text: `Ship To: ${data.job_info.customer.Company}`,
                  style: 'fonts',
                  alignment: 'right',
                  margin: [0, 0, 0, 0],
                },
                {
                  text: `${data.job_info.Address1}`,
                  alignment: 'right',
                  style: 'fonts',
                  margin: [0, 0, 0, 0],
                },
                {
                  text: `${
                    data.job_info.Address2 ? data.job_info.Address2 : ''
                  }`,
                  alignment: 'right',
                  style: 'fonts',
                  margin: [0, 0, 0, 0],
                },
                {
                  text: `${data.job_info.City}, ${data.job_info.State} ${data.job_info.Zip}`,
                  alignment: 'right',
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
                  alignment: 'right',
                  style: 'fonts',
                  margin: [0, 0, 0, 0],
                },
              ],
              margin: [0, 10, 0, 0],
            },
          ],
        },
      ],
    },
    {
      text:
        '==============================================================================',
      alignment: 'center',
    },
    data.part_list.map((part, i) => {
      const tableBody = [
        [
          { text: 'Item', style: 'fonts' },
          { text: 'Actual Size WxH', style: 'fonts' },
          { text: 'Qty', style: 'fonts' },
          { text: 'Notes', style: 'fonts' },
          { text: 'Total 1 Unit', style: 'fonts' },
          { text: 'Total Cost', style: 'fonts' },
        ],
      ];

      part.dimensions.forEach((item, index) => {
        tableBody.push([
          { text: index + 1, style: 'fonts' },
          { text: `${Size(item)}`, style: 'fonts' },
          { text: `${item.qty}`, style: 'fonts' },
          {
            text: `${item.notes ? item.notes : ''} ${
              item.full_frame ? 'Full Frame DF' : ''
            } ${item.lite ? item.lite.NAME : ''}`,
            style: 'fonts',
          },
          // {
          //   text: ''
          // },
          {
            text: `${(data.linePrice[i][index] / parseInt(item.qty)).toFixed(
              2
            )}`,
            style: 'fonts',
          },
          {
            text: `${data.linePrice[i][index].toFixed(2)}`,
            style: 'fonts',
            alignment: 'right',
          },
        ]);
      });

      console.log({ data });

      return [
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                {
                  text: `${part.woodtype.NAME} - ${
                    part.thickness && part.thickness.value === 0.75
                      ? '4/4'
                      : part.thickness && part.thickness.value === 1
                        ? '5/4'
                        : ''
                  }`,
                  style: 'fonts',
                },
                // {
                //   text: `${part.orderType ? part.orderType.value : ''}`,
                //   style: 'fonts',
                // },
              ],
            },

            {
              stack: [
                {
                  text: `${part.notes ? part.notes : ''}`,
                  style: 'headerFont',
                  alignment: 'center',
                },
                part.applied_profile?.NAME !== 'None' ? {
                  text: `${part.applied_profile ? part.applied_profile.NAME : ''}`,
                  style: 'fontsBold',
                  alignment: 'center'
                } : null
              ],
            },
            {
              stack: [
                {
                  text: `IP: ${
                    part.profile ? part.profile.NAME : 'None'
                  }  Edge: ${
                    part.edge ? part.edge.NAME : 'None'
                  }`,
                  style: 'fonts',
                },
                // {
                //   text: `Applied Profile: ${
                //     part.applied_profile ? part.applied_profile.NAME : 'None'
                //   }`,
                //   style: 'fonts',
                // },
                // {
                //   text: `Thickness: ${
                //     part.thickness ? part.thickness.name : 'None'
                //   }`,
                //   style: 'fonts',
                // },
              ],
              alignment: 'right',
            },
          ],
        },
        {
          text:
            '==============================================================================',
          alignment: 'center',
        },
        {
          margin: [0, 10, 0, 0],
          columns: [
            {
              stack: [
                {
                  text: `${
                    part.cope_design
                      ? part.cope_design.NAME
                      : part.cope_df_design
                        ? part.cope_df_design.NAME + ' DF'
                        : part.mt_design
                          ? part.mt_design.NAME + ' ' + part.construction.value
                          : part.miter_design
                            ? part.miter_design.NAME + ' ' + part.construction.value
                            : part.miter_df_design
                              ? part.miter_df_design.NAME +
                        ' ' +
                        part.construction.value
                              : part.mt_df_design
                                ? part.mt_df_design.NAME + ' ' + part.construction.value
                                : part.face_frame_design
                                  ? part.face_frame_design.NAME
                                  : part.orderType.value === 'Slab_Door' ||
                        part.orderType.value === 'Slab_DF'
                                    ? ''
                                    : ''
                  } - ${
                    part.panel
                      ? part.panel.NAME
                      : part.orderType.value === 'Slab_Door' ||
                        part.orderType.value === 'Slab_DF'
                        ? ''
                        : 'Glass'
                  } ${i.lite ? '- ' + i.lite.NAME : ''}`,
                  style: 'fonts',
                },
              ],
              width: 260,
            },
          ],
        },
        {
          table: {
            headerRows: 1,
            widths: [30, 120, 25, 133, '*', '*'],
            body: tableBody,
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
          stack: [
            {
              columns: [
                {
                  text: '-------',
                  margin: [175, 0, 0, 0],
                },
              ],
              margin: [0, 0, 0, -10],
            },
            {
              columns: [
                {
                  text: '------------',
                  margin: [0, 0, 0, 0],
                  alignment: 'right',
                },
              ],
              margin: [0, 0, 0, -10],
            },
            {
              columns: [
                {
                  text: '',
                  width: 100,
                },
                {
                  text: ' Total: ',
                  width: 82,
                  style: 'fonts',
                  alignment: 'left',
                },
                { text: `${qty[i]}`, style: 'fonts', alignment: 'left' },
                {
                  stack: [
                    {
                      columns: [
                        // {
                        //   text: 'Additional Price',
                        //   style: 'totals',
                        //   margin: [0, 0, 0, 0],
                        // },
                        // {
                        //   text: `$${part.addPrice}`,
                        //   style: 'totals',
                        //   margin: [0, 0, 0, 0],
                        //   alignment: 'right',
                        // },
                        {
                          text: '',
                          style: 'totals',
                          margin: [0, 0, 0, 0],
                        },
                        {
                          text: '',
                          style: 'totals',
                          margin: [0, 0, 0, 0],
                          alignment: 'right',
                        },
                      ],
                      // width: 100,
                    },
                    {
                      columns: [
                        {
                          text: 'Item Subtotal',
                          style: 'fonts',
                          margin: [0, 0, 0, 0],
                        },
                        {
                          text: `$${data.subTotals[i].toFixed(2)}`,
                          style: 'fonts',
                          margin: [0, 0, 0, 0],
                          alignment: 'right',
                        },
                      ],
                    },
                  ],
                },
              ],
              margin: [0, 10, 0, 5],
            },
          ],
        },

        {
          text:
            '==============================================================================',
          alignment: 'center',
        },
      ];
    }),
    {
      columns: [
        {
          text: `Total Number of Pieces: ${qty.reduce(
            (acc, item) => acc + item,
            0
          )}`,
          style: 'fonts',
          width: 347,
        },
        { text: 'Order Subtotal', style: 'totals', margin: [0, 0, 0, 0] },
        {
          text: `$${subTotal.toFixed(2)}`,
          style: 'fonts',
          margin: [31, 0, 0, 0],
          alignment: 'right',
        },
      ],
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        {
          text: `${data.discount > 0 ? data.discount + '% ' + 'Discount' : ''}`,
          style: 'totals',
          margin: [0, 0, 0, 0],
        },
        {
          text: `${
            data.discount > 0 ? '-' + '$' + discountTotal.toFixed(2) : ''
          }`,
          style: 'fonts',
          alignment: 'right',
        },
      ],
      margin: [0, 0, 0, 0],
    },
    {
      text: '------------',
      margin: [0, 0, 0, 0],
      alignment: 'right',
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        {
          text: `${data.discount > 0 ? 'Discount Subtotal' : ''}`,
          style: 'totals',
          margin: [0, 0, 0, 0],
          width: 100,
        },
        {
          text: `${data.discount > 0 ? '$' + discountSubTotal.toFixed(2) : ''}`,
          style: 'fonts',
          alignment: 'right',
        },
      ],
      margin: [0, 0, 0, 0],
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        {
          text: data.Taxable
            ? '$' +
              discountSubTotal.toFixed(2) +
              ' x ' +
              data.companyprofile.TaxRate +
              '%' +
              ' Tax:'
            : '',
          style: 'totals',
          margin: [0, 0, 0, 0],
          width: 100
        },
        {
          text: `${data.tax > 0 ? '$' + data.tax.toFixed(2) : ''}`,
          style: 'fonts',
          alignment: 'right',
        },
      ],
      margin: [0, 10, 0, 0],
    },
    {
      columns: [
        {
          text: `${data.misc_items.length > 0 ? 'Misc Items' : ''}`,
          style: 'totals',
          width: 347,
          decoration: 'underline',
        },
        { text: '', style: 'totals', margin: [0, 0, 0, 0] },
        { text: '', style: 'totals', margin: [0, 0, 0, 0], alignment: 'right' },
      ],
      margin: [0, 10, 0, 0],
    },
    {
      columns: [
        {
          text: data.misc_items.map((i) => {
            return `(${i.qty ? i.qty : ''}) ${
              i.item ? i.item.NAME : i.item2 ? i.item2 : ''
            } \n`;
          }),
          style: 'fonts',
          width: 347,
        },
        {
          text: data.misc_items.map((i) => {
            return `$${
              i.price
                ? parseFloat(i.price).toFixed(2)
                : i.pricePer
                  ? parseFloat(i.pricePer).toFixed(2)
                  : 0
            } \n`;
          }),
          style: 'fonts',
          margin: [0, 0, 0, 0],
        },
        {
          text: data.misc_items.map((i) => {
            return `$${
              i.price
                ? (parseFloat(i.price) * parseFloat(i.qty)).toFixed(2)
                : i.pricePer
                  ? (parseFloat(i.pricePer) * parseFloat(i.qty)).toFixed(2)
                  : 0
            } \n`;
          }),
          style: 'fonts',
          alignment: 'right',
        },
      ],
      margin: [0, 2, 0, 0],
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347, decoration: 'underline' },
        {
          text: miscTotal.length > 0 ? 'Subtotal' : '',
          style: 'totals',
          margin: [0, 0, 0, 0],
        },
        {
          text:
            miscTotal.length > 0
              ? '$' + miscTotal.reduce((acc, item) => acc + item, 0)
              : '',
          style: 'fonts',
          margin: [0, 0, 0, 0],
          alignment: 'right',
        },
      ],
      margin: [0, 10, 0, 0],
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347, decoration: 'underline' },
        {
          text: `${data.status === 'Quote' ? 'QUOTE ONLY' : 'TOTAL'}`,
          style: 'totals',
          margin: [0, 0, 0, 0],
        },
        {
          text: `$${data.total.toFixed(2)}`,
          style: 'fonts',
          margin: [0, 0, 0, 0],
          alignment: 'right',
        },
      ],
      margin: [0, 10, 0, 0],
    },
    {
      columns: [
        { text: '', style: 'totals', width: 347, decoration: 'underline' },
        { text: 'Minus Balance Paid:', style: 'totals', margin: [0, 0, 0, 0], width: 100 },
        {
          text: `$${balancePaid.toFixed(2)}`,
          style: 'fonts',
          margin: [0, 0, 0, 0],
          alignment: 'right',
        },
      ],
      margin: [0, 2, 0, 0],
    },

    {
      columns: [
        { text: '', style: 'totals', width: 347 },
        { text: 'BALANCE DUE:', style: 'totals', margin: [0, 0, 0, 0] },
        {
          text: `$${balanceDue.toFixed(2)}`,
          style: 'fonts',
          margin: [0, 0, 0, 0],
          alignment: 'right',
        },
      ],
      margin: [0, 15, 0, 0],
    },
    {
      text:
        'Our products are warranted for 1 year from date of shipment, warranty details can found at \n https://portadoor.com and in our 2020 Catalog \n \n Liability under this warrant shall be limited to the original invoice price of the product',
      style: 'warrantyFont',
      alignment: 'center',
      margin: [0, 25, 0, 0],
    },
    // { text: '', pageBreak: 'before' }
  ];
};
