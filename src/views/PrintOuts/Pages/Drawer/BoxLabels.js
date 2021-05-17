import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import Box_Labels from '../../Drawer_PDF/Box_Labels';


export default (data, breakdowns, p) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  const documentDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    content: Box_Labels(data, breakdowns),
    // pageMargins: [40, 40, 40, 60],
    pageBreakBefore: function (
      currentNode,
      followingNodesOnPage,
      nodesOnNextPage,
      previousNodesOnPage
    ) {
      return (
        currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
      );
    },
    styles: {
      woodtype: {
        fontSize: 15,
        bold: true,
      },
      fonts: {
        fontSize: 9,
      },
      fontsBold: {
        fontSize: 9,
        bold: true,
      },
      headerFont: {
        fontSize: 11,
        bold: true,
      },
      tableBold: {
        fontSize: 9,
        bold: true,
      },
      totals: {
        fontSize: 9,
        bold: true,
      },
      warrantyFont: {
        fontSize: 7,
      },
    }
  };

  // const fileName = `Order_${data.orderNum}`
  pdfMake.createPdf(documentDefinition).open();
};
