import moment from 'moment';
import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import TotalPieces from '../../Breakdowns/Doors/MaterialBreakdown/TotalPieces';
import Invoice from '../../Drawer_PDF/Invoice';

const DrawerPDF = async (data, breakdowns, p, pricing) => {
  return new Promise((resolve, reject) => {
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const totalUnits = TotalPieces(data);

    const headerInfo = [
      {
        margin: [40, 40, 40, 10],
        columns: [
          {
            stack: [{ text: 'INVOICE', margin: [0, 0, 0, -10] }],
            style: 'headerFont',
          },

          {
            stack: [
              { text: 'Porta Door Co. Inc.', alignment: 'center' },
              { text: '65 Cogwheel Lane', alignment: 'center' },
              { text: 'Seymour, CT 06483', alignment: 'center' },
              {
                text: '203-888-6191',
                alignment: 'center',
                margin: [0, 0, 0, 10],
              },
              {
                text: data.DateInvoiced
                  ? moment(data.DateInvoiced).format('DD-MMM-YYYY')
                  : 'TBA',
                alignment: 'center',
              },
            ],
            // width: 200,
            alignment: 'center',
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
                text: `Order #: ${data.id + 100}`,
                alignment: 'right',
                style: 'headerFont',
              },
              {
                text: `Est. Completion: ${
                  data.Shipping_Scheduled
                    ? `${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`
                    : 'TBD'
                }`,
                alignment: 'right',
                style: 'headerFont',
              },
              {
                text: `Ship Via: ${
                  data.job_info.shipping_method
                    ? data.job_info.shipping_method.NAME
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
            ],
          },
        ],
      },
      {
        margin: [40, 0],
        columns: [
          {
            width: 200,
            stack: [
              {
                columns: [
                  {
                    text: 'Customer - ',
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
                        text: `${data.companyprofile.City}, ${data.companyprofile.State} ${data.companyprofile.Zip}`,
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
                      {
                        text: `Terms: ${
                          data.companyprofile.PMT_TERMS
                            ? data.companyprofile.PMT_TERMS
                            : ''
                        }`,
                        style: 'fonts',
                      },
                    ],
                  },
                ],

                style: 'fontsBold',
                margin: [0, 0, 0, 0],
              },
            ],
            style: 'headerFont',
          },

          {
            text: '',
            // width: 200,
            alignment: 'center',
          },
          {
            stack: [
              {
                margin: [0, 0, 0, 0],
                columns: [
                  {
                    width: 40,
                    stack: [
                      {
                        text: 'Job: ',
                        alignment: 'left',
                        margin: [0, 0, 0, 0],
                        style: 'fonts',
                      },
                      {
                        text: 'Ship To: ',
                        style: 'fonts',
                        alignment: 'left',
                        margin: [0, 0, 0, 0],
                      },
                    ],
                  },
                  {
                    width: 120,
                    stack: [
                      {
                        text: `${
                          data.job_info.poNum.length > 0
                            ? data.job_info.poNum.toUpperCase()
                            : 'None'
                        }`,
                        alignment: 'left',
                        margin: [0, 0, 0, 0],
                        style: 'fonts',
                      },
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
                        text: `${data.job_info.Phone}`,
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
      // {
      //   text: '==============================================================================',
      //   alignment: 'center',
      //   margin: [40, 0],
      // },
    ];

    let Content = [];

    Content.push(Invoice(data, pricing));

    const rowLen = Content.length;
    const ContentSorted = Content.map((i, index) => {
      if (rowLen === index + 1) {
        return [i];
      } else {
        return [i, { text: '', pageBreak: 'before' }];
      }
    });

    const fileName = `Order #${data.id + 100}`;

    const documentDefinition = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      content: ContentSorted,
      pageMargins: [40, 220, 40, 60],
      header: function (currentPage) {
        return headerInfo;
      },
      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              stack: [
                {
                  text: moment().format('MM-D-YYYY'),
                  style: 'warrantyFont',
                },
                {
                  text: currentPage.toString() + ' of ' + pageCount,
                  style: 'warrantyFont',
                },
              ],
              width: 250,
            },
            {
              stack: [
                {
                  text: ' ',
                  style: 'warrantyFont',
                },
                {
                  text: `UNITS: ${totalUnits}    ${fileName}`,
                  style: 'warrantyFont',
                  alignment: 'right',
                },
              ],
            },
          ],
          margin: [40, 10, 40, 0],
        };
      },
      pageBreakBefore: function (
        currentNode,
        followingNodesOnPage,
        nodesOnNextPage,
        previousNodesOnPage
      ) {
        return (
          currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
        );
      },
      styles: {
        woodtype: {
          fontSize: 15,
          bold: true,
        },
        orderNum: {
          fontSize: 24,
          bold: true,
        },
        fonts: {
          fontSize: 9,
        },
        misc_items: {
          fontSize: 9,
          decoration: 'underline',
        },
        fontsBold: {
          fontSize: 8,
          bold: true,
        },
        headerFont: {
          fontSize: 10,
          bold: true,
        },
        tableBold: {
          fontSize: 9,
          bold: true,
        },
        totals: {
          fontSize: 9,
          bold: true,
        },
        warrantyFont: {
          fontSize: 7,
        },
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

    return pdfDocGenerator.getBlob((blob) => {
      // blobUrl()
      resolve(blob);
    });
  });
};

export default DrawerPDF;
