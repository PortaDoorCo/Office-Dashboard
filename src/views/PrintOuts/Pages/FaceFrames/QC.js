import moment from 'moment';
import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import TotalPieces from '../../Breakdowns/Doors/MaterialBreakdown/TotalPieces';
import QC from '../../Face_Frame_PDF/QC';

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
              { text: 'QC Checkoff Sheet', bold: true },
              { qr: `${data.id}`, fit: '75', margin: [0, 5, 0, 0] },
            ],
          },
          {
            stack: [
              { text: 'Porta Door Co. Inc.', alignment: 'center' },
              { text: '65 Cogwheel Lane', alignment: 'center' },
              { text: 'Seymour, CT', alignment: 'center' },
              { text: '203-888-6191', alignment: 'center' },
              { text: moment().format('DD-MMM-YYYY'), alignment: 'center' }
            ]
          },
          {
            stack: [
              { text: data.job_info.Rush && data.job_info.Sample ? 'Sample / Rush' : data.job_info.Rush ? 'Rush' : data.job_info.Sample ? 'Sample' : '', alignment: 'right', bold: true },
              { text: `Order #: ${data.orderNum}`, alignment: 'right' },
              {
                text: `Due Date: ${
                  data.Shipping_Scheduled
                    ? `${moment(data.job_info.DueDate).format(
                      'MM/DD/YYYY'
                    )}`
                    : 'TBD'
                }`,
                alignment: 'right',
              },
            ]
          }
        ]
      },
      {
        margin: [40,0],
        columns: [
          {
            text: `${data.job_info.customer.Company}`,
          },
          {
            text: '',
            alignment: 'center'
          },
          {
            text: `PO: ${data.job_info.poNum.toUpperCase()}`,
            alignment: 'right',
          },
        ],
      },
      // {
      //   text:
      //         '==============================================================================',
      //   alignment: 'center',
      //   margin: [40,0]
      // },
    ];

    let Content = [];


    Content.push(QC(data, breakdowns));



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
      pageMargins: [40, 175, 40, 60],
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
      // blobUrl()
      resolve(blob);
    });
  });
};

export default FaceFramePDF;
