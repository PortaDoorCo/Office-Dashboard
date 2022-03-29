import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import LateList from './Components/Tracking';
import OpenOrders from './Components/OpenOrders';

export default (data, startDate, endDate, status) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  const documentDefinition = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    content: [OpenOrders(data, startDate, endDate, status)],
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
        margin: [0, 5, 0, 10],
        fontSize: 8,
      },
      fonts: {
        fontSize: 8,
      },
      fontsBold: {
        fontSize: 8,
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
