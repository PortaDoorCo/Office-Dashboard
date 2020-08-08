import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import AssemblyList from '../../Drawer_PDF/AssemblyList';
import Sides from '../../Drawer_PDF/Sides';
import Bottoms from '../../Drawer_PDF/Bottoms';
import Invoice from '../../Drawer_PDF/Invoice';
import Acknowledgement from '../../Drawer_PDF/Acknowledgement';


export default (data, breakdowns) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;


  const documentDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    content: [
      AssemblyList(data, breakdowns),
      Sides(data, breakdowns),
      Bottoms(data, breakdowns),
      Acknowledgement(data, breakdowns),
      Invoice(data, breakdowns)
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
