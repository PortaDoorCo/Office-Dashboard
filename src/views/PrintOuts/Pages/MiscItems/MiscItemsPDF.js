import moment from 'moment';
import pdfMake from 'pdfmake-lite/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import TotalMisc from '../../Breakdowns/Doors/MaterialBreakdown/TotalMisc';
import Acknowledgement from '../../Misc_Items_PDF/Acknowledgement';
import Invoice from '../../Misc_Items_PDF/Invoice';
import Packing_Slip from '../../Misc_Items_PDF/Packing_Slip';
import QC from '../../Misc_Items_PDF/QC';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const MiscItemPDF = (data, breakdowns, p, pricing) => {
  return new Promise((resolve, reject) => {
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const totalUnits = TotalMisc(data);

    const headerInfo = [];

    let Content = [];

    for (let i = 0; i < p.acknowledgement; i++) {
      Content.push(Acknowledgement(data, pricing));
    }

    for (let i = 0; i < p.invoice; i++) {
      Content.push(Invoice(data, pricing));
    }

    for (let i = 0; i < p.packing_slip; i++) {
      Content.push(Packing_Slip(data, breakdowns));
    }

    for (let i = 0; i < p.qc; i++) {
      Content.push(QC(data, breakdowns));
    }

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
      pageMargins: [40, 230, 40, 60],
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
