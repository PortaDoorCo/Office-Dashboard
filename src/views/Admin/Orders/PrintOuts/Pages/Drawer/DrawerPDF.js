import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import Acknowledgement from '../../Drawer_PDF/Acknowledgement';
import Invoice from '../../Drawer_PDF/Invoice';
import AssemblyList from '../../Drawer_PDF/AssemblyList';
import Sides from '../../Drawer_PDF/Sides';
import Bottoms from '../../Drawer_PDF/Bottoms';

export default (data, breakdowns, p) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  let Content = [];

  for (let i = 0; i < p.assembly_list; i++) {
    Content.push(AssemblyList(data, breakdowns));
  }

  for (let i = 0; i < p.box_sides; i++) {
    Content.push(Sides(data, breakdowns));
  }

  for (let i = 0; i < p.box_bottoms; i++) {
    Content.push(Bottoms(data, breakdowns));
  }

  for (let i = 0; i < p.acknowledgement; i++) {
    Content.push(Acknowledgement(data, breakdowns));
  }

  for (let i = 0; i < p.invoice; i++) {
    Content.push(Invoice(data, breakdowns));
  }

  const documentDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    content: Content,
    pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
      return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
    },
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
      }
    }
  };

  // const fileName = `Order_${data.orderNum}`
  pdfMake.createPdf(documentDefinition).open();
};
