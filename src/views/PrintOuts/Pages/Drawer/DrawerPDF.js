import moment from 'moment';
import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import TotalPieces from '../../Breakdowns/Doors/MaterialBreakdown/TotalPieces';
import Acknowledgement from '../../Drawer_PDF/Acknowledgement';
import AssemblyList from '../../Drawer_PDF/AssemblyList';
import Bottoms from '../../Drawer_PDF/Bottoms';
import Box_Labels from '../../Drawer_PDF/Box_Labels';
import Invoice from '../../Drawer_PDF/Invoice';
import Packing_Slip from '../../Drawer_PDF/Packing_Slip';
import Sides from '../../Drawer_PDF/Sides';

export default (data, breakdowns, p, pricing) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  const totalUnits = TotalPieces(data);

  let Content = [];

  for (let i = 0; i < p.acknowledgement; i++) {
    Content.push(Acknowledgement(data, pricing));
  }

  for (let i = 0; i < p.invoice; i++) {
    Content.push(Invoice(data, pricing));
  }

  for (let i = 0; i < p.assembly_list; i++) {
    Content.push(AssemblyList(data, breakdowns));
  }

  for (let i = 0; i < p.box_sides; i++) {
    Content.push(Sides(data, breakdowns));
  }

  for (let i = 0; i < p.box_bottoms; i++) {
    Content.push(Bottoms(data, breakdowns));
  }

  for (let i = 0; i < p.packing_slip; i++) {
    Content.push(Packing_Slip(data, breakdowns));
  }

  for (let i = 0; i < p.box_labels; i++) {
    Content.push(Box_Labels(data, breakdowns));
  }

  const rowLen = Content.length;
  const ContentSorted = Content.map((i, index) => {
    if (rowLen === index + 1) {
      return [i];
    } else {
      return [i, { text: '', pageBreak: 'before' }];
    }
  });

  const fileName = `Order #${data.id + 100}`;

  const documentDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    content: ContentSorted,
    pageMargins: [40, 40, 40, 60],
    footer: function (currentPage, pageCount) {
      return {
        columns: [
          {
            stack: [
              {
                text: moment().format('MM-D-YYYY'),
                style: 'warrantyFont',
              },
              {
                text: currentPage.toString() + ' of ' + pageCount,
                style: 'warrantyFont',
              },
            ],
            width: 250,
          },
          {
            stack: [
              {
                text: ' ',
                style: 'warrantyFont',
              },
              {
                text: `UNITS: ${totalUnits}    ${fileName}`,
                style: 'warrantyFont',
                alignment: 'right',
              },
            ],
          },
        ],
        margin: [40, 10, 40, 0],
      };
    },
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
      orderNum: {
        fontSize: 24,
        bold: true,
      },
      fonts: {
        fontSize: 9,
      },
      fontsBold: {
        fontSize: 8,
        bold: true,
      },
      headerFont: {
        fontSize: 10,
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
    },
  };
  pdfMake.createPdf(documentDefinition).open();
};
