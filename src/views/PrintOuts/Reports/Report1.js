import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import Orders from './Components/Orders';

export default (data, startDate, endDate, status) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  const documentDefinition = {
    pageSize: 'LETTER',
    pageOrientation: 'landscape',
    content: [Orders(data, startDate, endDate, status)],
    styles: {
      woodtype: {
        fontSize: 14,
        bold: true,
      },
      header: {
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      tableExample: {
        margin: [-25, 5, 5, 15],
        fontSize: 8,
      },
      fonts: {
        fontSize: 8,
      },
      fontsBold: {
        fontSize: 10,
        bold: true,
      },
      totals: {
        fontSize: 8,
        bold: true,
      },
    },
  };
  pdfMake.createPdf(documentDefinition).open();
};
