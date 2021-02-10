import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import AssemblyList from '../../Door_PDF/AssemblyList';
import StilesPage from '../../Door_PDF/StilesPage';
import RailsPage from '../../Door_PDF/RailsPage';
import PanelsPage from '../../Door_PDF/PanelsPage';
import MaterialsList from '../../Door_PDF/MaterialsList';
import QC_Checklist from '../../Door_PDF/QC_Checklist';
import Profiles from '../../Door_PDF/Profiles';

export default (data, edges, moulds, miter, mt, panels, appliedProfiles, breakdowns, p) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  console.log({p});

  let Content = [];

  for (let i = 0; i < p.assembly_list; i++) {
    Content.push(AssemblyList(data, breakdowns));
  }

  for (let i = 0; i < p.stiles; i++) {
    Content.push(StilesPage(data, breakdowns));
  }

  for (let i = 0; i < p.rails; i++) {
    Content.push(RailsPage(data, breakdowns));
  }

  for (let i = 0; i < p.panels; i++) {
    Content.push(PanelsPage(data, breakdowns));
  }


  for (let i = 0; i < p.materials; i++) {
    Content.push(MaterialsList(data, breakdowns));
  }

  for (let i = 0; i < p.qc; i++) {
    Content.push(QC_Checklist(data, breakdowns));
  }

  
  for (let i = 0; i < p.profiles; i++) {
    Content.push(Profiles(data, edges, moulds, miter, mt, panels, appliedProfiles, breakdowns));
  }



  const documentDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    content: Content,
    // [
      
    //   AssemblyList(data, breakdowns),
    //   StilesPage(data, breakdowns),
    //   RailsPage(data, breakdowns),
    //   PanelsPage(data, breakdowns),
    //   MaterialsList(data, breakdowns),
    //   QC_Checklist(data, breakdowns),
    //   Profiles(data, edges, moulds, miter, mt, panels, appliedProfiles, breakdowns),
    // ],
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
        fontSize: 10,
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
