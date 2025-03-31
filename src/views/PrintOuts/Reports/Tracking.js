import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import LateList from './Components/Tracking';

export default (data, startDate, endDate, status, showPrice = false) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  const documentDefinition = {
    pageSize: 'LETTER',
    pageOrientation: 'landscape',
    content: [LateList(data, startDate, endDate, status, showPrice)],
    styles: {
      woodtype: {
        fontSize: 18,
        bold: true,
      },
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      tableExample: {
        margin: [-15, 5, 0, 10],
        fontSize: 10,
      },
      fonts: {
        fontSize: 10,
      },
      fontsBold: {
        fontSize: 12,
        bold: true,
      },
      totals: {
        fontSize: 10,
        bold: true,
      },
    },
  };
  pdfMake.createPdf(documentDefinition).open();
};
