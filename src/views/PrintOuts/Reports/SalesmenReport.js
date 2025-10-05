import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import Salesmen from './Components/Salesmen';
import SalesmenReportCSV from './SalesmenReportCSV';

export default (
  data,
  startDate,
  endDate,
  account,
  role,
  status,
  format = 'pdf'
) => {
  // If format is CSV, use the CSV export function
  if (format === 'csv') {
    return SalesmenReportCSV(data, startDate, endDate, account, role, status);
  }

  // Otherwise, generate PDF as before
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  const documentDefinition = {
    pageSize: 'LETTER',
    pageOrientation: 'portrait',
    content: [Salesmen(data, startDate, endDate, account, role, status)],
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
        margin: [0, 5, 0, 15],
        fontSize: 8,
      },
      fonts: {
        fontSize: 9,
      },
      fontsBold: {
        fontSize: 12,
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
