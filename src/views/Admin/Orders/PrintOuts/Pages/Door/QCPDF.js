import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import AssemblyList from '../../Door_PDF/AssemblyList';
import StilesPage from '../../Door_PDF/StilesPage';
import RailsPage from '../../Door_PDF/RailsPage';
import PanelsPage from '../../Door_PDF/PanelsPage';
import MaterialsList from '../../Door_PDF/MaterialsList'
import QC_Checklist from '../../Door_PDF/QC_Checklist'
import Invoice from '../../Door_PDF/Invoice'

export default data => {
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const documentDefinition = {
        pageSize: 'A4',
        pageOrientation: 'portrait',
        content: [
            QC_Checklist(data),
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
