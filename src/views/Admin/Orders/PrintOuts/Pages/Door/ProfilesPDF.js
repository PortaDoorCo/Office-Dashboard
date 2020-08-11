import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import Profiles from '../../Door_PDF/Profiles';

export default (data, edges, moulds, panels, appliedProfiles,) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;


  const documentDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    content: [
      Profiles(data, edges, moulds, panels, appliedProfiles,),
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
