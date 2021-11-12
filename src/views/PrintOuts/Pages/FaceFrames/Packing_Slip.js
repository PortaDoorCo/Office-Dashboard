import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import Invoice from '../../Face_Frame_PDF/Invoice';
import Acknowledgement from '../../Face_Frame_PDF/Acknowledgement';
import moment from 'moment';
import AssemblyList from '../../Face_Frame_PDF/AssemblyList';
import PackingSlip from '../Door/PackingSlip';
import Glass_Selection from '../../Sorting/Glass_Selection';
import Packing_Slip from '../../Face_Frame_PDF/Packing_Slip';
import QC from '../../Face_Frame_PDF/QC';
import Door_Labels from '../../Door_PDF/Door_Labels';
import TotalPieces from '../../Breakdowns/Doors/MaterialBreakdown/TotalPieces';

const FaceFramePDF = (data, breakdowns, p, pricing) => {
  return new Promise((resolve, reject) => {
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const totalUnits = TotalPieces(data);

    const headerInfo = [
      {
        margin: [40,40,40,10],
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
        margin: [40, 0],
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
      // {
      //   text: '==============================================================================',
      //   alignment: 'center',
      //   margin: [40, 0]
      // },
    ];

    let Content = [];


    Content.push(Packing_Slip(data, breakdowns));
    

  

    const rowLen = Content.length;
    const ContentSorted = Content.map((i,index) => {
      if (rowLen === index + 1) {
        return [i];
      } else {
        return [
          i,
          { text: '', pageBreak: 'before' }
        ];
      }
    });

    const fileName = `Order #${data.orderNum}`;


    const documentDefinition = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      content: ContentSorted,
      pageMargins: [40, 210, 40, 60],
      header: function (currentPage) {
        return headerInfo;
      },
      footer: function(currentPage, pageCount) { 
        return {
          columns: [
            {
              stack: [
                {
                  text: moment().format('MM-D-YYYY'),
                  style: 'warrantyFont'
                },
                {
                  text: currentPage.toString() + ' of ' + pageCount, style: 'warrantyFont'
                }
              ],
              width: 250
            },
            {
              stack: [
                {
                  text: ' ', style: 'warrantyFont',
                },
                {
                  text: `UNITS: ${totalUnits}    ${fileName}`, style: 'warrantyFont', alignment: 'right'
                }
              ]  
            }
          ],
          margin: [40,10,40,0]
        };
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

    // const fileName = `Order_${data.orderNum}`
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);


  

    return pdfDocGenerator.getBlob((blob) => {
      console.log({blob});
      // blobUrl()
      resolve(blob);
    });
  });
};

export default FaceFramePDF;
