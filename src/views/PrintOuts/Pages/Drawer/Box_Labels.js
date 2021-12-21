import moment from 'moment';
import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import TotalPieces from '../../Breakdowns/Doors/MaterialBreakdown/TotalPieces';
import Box_Labels from '../../Drawer_PDF/Box_Labels';

const DrawerPDF = async (data, breakdowns, p, pricing) => {

  return new Promise((resolve, reject) => {
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const totalUnits = TotalPieces(data);


    let Content = [];


    Content.push(Box_Labels(data, breakdowns));
  

  

    const rowLen = Content.length;
    const ContentSorted = Content.map((i,index) => {
      if (rowLen === index + 1) {
        return [i];
      } else {
        return [
          i,
          { text: '', pageBreak: 'before' }
        ];
      }
    });

    const fileName = `Order #${data.orderNum}`;

    const documentDefinition = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      content: ContentSorted,
      pageMargins: [40, 40, 40, 60],
      footer: function(currentPage, pageCount) { 
        return {
          columns: [
            {
              stack: [
                {
                  text: moment().format('MM-D-YYYY'),
                  style: 'warrantyFont'
                },
                {
                  text: currentPage.toString() + ' of ' + pageCount, style: 'warrantyFont'
                }
              ],
              width: 250
            },
            {
              stack: [
                {
                  text: ' ', style: 'warrantyFont',
                },
                {
                  text: `UNITS: ${totalUnits}    ${fileName}`, style: 'warrantyFont', alignment: 'right'
                }
              ]  
            }
          ],
          margin: [40,10,40,0]
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

    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);


  

    return pdfDocGenerator.getBlob((blob) => {
      console.log({blob});
      // blobUrl()
      resolve(blob);
    });
  });
};

export default DrawerPDF;
