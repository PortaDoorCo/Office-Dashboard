import moment from 'moment';
import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import TotalPieces from '../../Breakdowns/Doors/MaterialBreakdown/TotalPieces';
import TotalSolidDFs from '../../Breakdowns/Doors/MaterialBreakdown/TotalSolidDFs';
import Packing_Slip from '../../Door_PDF/Packing_Slip';

const DoorPDF = async (
  data,
  designs,
  edges,
  moulds,
  miter,
  mt,
  panels,
  appliedProfiles,
  breakdowns,
  p,
  pricing
) => {
  return new Promise((resolve, reject) => {
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const units = TotalPieces(data);
    const solidDFs = TotalSolidDFs(data);
    const totalUnits = units;

    const headerInfo = [
      {
        margin: [40, 40, 40, 0],
        columns: [
          {
            stack: [
              { text: `Our Order: ${data.orderNum}`, bold: true },
              { qr: `${data.id}`, fit: '75', margin: [0, 0, 0, 5] },
              {
                text: `Job: ${
                  data.status === 'Quote' ? 'QUOTE' : ''
                } - ${data.job_info?.poNum.toUpperCase()}`,
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
        margin: [40, 10, 0, 0],
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
            text: '',
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
      // {
      //   text: '==============================================================================',
      //   alignment: 'center',
      // },
    ];

    let Content = [];

    const type = 'Page';

    let itemNum = 0;

    const itemNumCounter = {
      ...data,
      part_list: data.part_list.map((i) => {
        return {
          ...i,
          dimensions: i.dimensions.map((j) => {
            itemNum += 1;
            return {
              ...j,
              item: itemNum,
            };
          }),
        };
      }),
    };

    Content.push(Packing_Slip(itemNumCounter, breakdowns));

    const rowLen = Content.length;
    const ContentSorted = Content.map((i, index) => {
      if (rowLen === index + 1) {
        return [i];
      } else {
        return [i, { text: '', pageBreak: 'before' }];
      }
    });

    const fileName = `Order #${data.orderNum}`;

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

    // pdfMake.createPdf(documentDefinition).open();

    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

    return pdfDocGenerator.getBlob((blob) => {
      // blobUrl()
      resolve(blob);
    });
  });
};

export default DoorPDF;
