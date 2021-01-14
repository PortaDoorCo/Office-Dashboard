import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import AssemblyList from '../../Door_PDF/AssemblyList';
import StilesPage from '../../Door_PDF/StilesPage';
import RailsPage from '../../Door_PDF/RailsPage';
import PanelsPage from '../../Door_PDF/PanelsPage';
import MaterialsList from '../../Door_PDF/MaterialsList';
import QC_Checklist from '../../Door_PDF/QC_Checklist';
import Profiles from '../../Door_PDF/Profiles';

export default (data, edges, moulds, miter, mt, panels, appliedProfiles, breakdowns) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  const documentDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    content: [
      AssemblyList(data, breakdowns),
      StilesPage(data, breakdowns),
      RailsPage(data, breakdowns),
      PanelsPage(data, breakdowns),
      MaterialsList(data, breakdowns),
      QC_Checklist(data, breakdowns),
      Profiles(data, edges, moulds, miter, mt, panels, appliedProfiles, breakdowns),
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
      tableBold: {
        fontSize: 9,
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
