import moment from 'moment';
import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import TotalMisc from '../../Breakdowns/Doors/MaterialBreakdown/TotalMisc';
import QC from '../../Misc_Items_PDF/QC';

const MiscItemPDF = (data, breakdowns, p, pricing) => {
  return new Promise((resolve, reject) => {
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const totalUnits = TotalMisc(data);

    const headerInfo = [
      {
        margin: [40, 40, 40, 10],
        columns: [
          {
            stack: [
              { text: 'QC Check Off Sheet', bold: true },
              {
                text: `Est. Completion: ${
                  data.Shipping_Scheduled
                    ? `${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`
                    : 'TBD'
                }`,
              },
              { qr: `${data.id}`, fit: '75', margin: [0, 5, 0, 0] },
            ],
          },
          {
            stack: [
              { text: 'Porta Door Co. Inc.', alignment: 'center' },
              { text: '65 Cogwheel Lane', alignment: 'center' },
              { text: 'Seymour, CT', alignment: 'center' },
              { text: '203-888-6191', alignment: 'center' },
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
                bold: true,
              },
              { text: `Order #: ${data.id + 100}`, alignment: 'right' },
              {
                text: `Est. Completion: ${
                  data.Shipping_Scheduled
                    ? `${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`
                    : 'TBD'
                }`,
                alignment: 'right',
              },
              {
                text: `Ship Via: ${
                  data.job_info.shipping_method
                    ? data.job_info.shipping_method.NAME
                    : ''
                }`,
                alignment: 'right',
              },
            ],
          },
        ],
      },
      {
        stack: [
          {
            text: `${data.id + 100}`,
            style: 'orderNum',
          },
          {
            columns: [
              {
                text: `${data.job_info.customer.Company}`,
              },
              {
                text: '',
                alignment: 'center',
              },
              {
                text: `PO: ${data.job_info.poNum.toUpperCase()}`,
                alignment: 'right',
              },
            ],
          },
        ],
        margin: [40, 0],
      },
      // {
      //   text: '==============================================================================',
      //   alignment: 'center',
      //   margin:[40,0]
      // },
    ];

    let Content = [];

    Content.push(QC(data, breakdowns));

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

    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    return pdfDocGenerator.getBlob((blob) => {
      // blobUrl()
      resolve(blob);
    });
  });
};

export default MiscItemPDF;
