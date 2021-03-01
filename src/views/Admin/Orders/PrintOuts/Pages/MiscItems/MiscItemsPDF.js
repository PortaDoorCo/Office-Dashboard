import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import Invoice from '../../Misc_Items_PDF/Invoice';
import Acknowledgement from '../../Misc_Items_PDF/Acknowledgement';


export default (data, breakdowns, p) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  let Content = [];

  for (let i = 0; i < p.acknowledgement; i++) {
    Content.push(Acknowledgement(data, breakdowns));
  }

  for (let i = 0; i < p.invoice; i++) {
    Content.push(Invoice(data, breakdowns));
  }

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

  const documentDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    content: ContentSorted,
    styles: {
      woodtype: {
        fontSize: 18,
        bold: true
      },
      fonts: {
        fontSize: 9
      },
      fontsBold: {
        fontSize: 12,
        bold: true
      },
      totals: {
        fontSize: 8,
        bold: true,
      },
      warrantyFont: {
        fontSize: 7,
      }
    }
  };

  // const fileName = `Order_${data.orderNum}`
  pdfMake.createPdf(documentDefinition).open();
};
