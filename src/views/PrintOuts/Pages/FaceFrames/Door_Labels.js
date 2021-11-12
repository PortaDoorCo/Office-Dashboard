import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import Invoice from '../../Face_Frame_PDF/Invoice';
import Acknowledgement from '../../Face_Frame_PDF/Acknowledgement';
import moment from 'moment';
import AssemblyList from '../../Face_Frame_PDF/AssemblyList';
import PackingSlip from '../Door/PackingSlip';
import Glass_Selection from '../../Sorting/Glass_Selection';
import Packing_Slip from '../../Face_Frame_PDF/Packing_Slip';
import QC from '../../Face_Frame_PDF/QC';
import Door_Labels from '../../Door_PDF/Door_Labels';
import TotalPieces from '../../Breakdowns/Doors/MaterialBreakdown/TotalPieces';

const FaceFramePDF = (data, breakdowns, p, pricing) => {
  return new Promise((resolve, reject) => {
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const totalUnits = TotalPieces(data);


    let Content = [];



    Content.push(Door_Labels(data, breakdowns));
    



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
      pageMargins: [ 40, 40, 40, 60 ],
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

    // const fileName = `Order_${data.orderNum}`
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);


  

    return pdfDocGenerator.getBlob((blob) => {
      console.log({blob});
      // blobUrl()
      resolve(blob);
    });
  });
};

export default FaceFramePDF;
