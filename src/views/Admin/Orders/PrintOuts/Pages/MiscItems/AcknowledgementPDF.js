import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import Acknowledgement from '../../Misc_Items_PDF/Individual/Acknowledgement';

export default (data, breakdowns) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  const documentDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    content: [
      Acknowledgement(data, breakdowns),
    ],
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
      }
    }
  };
    // const fileName = `Order_${data.orderNum}`
  pdfMake.createPdf(documentDefinition).open();

};
