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

export default (data, breakdowns, p, pricing) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  let Content = [];

  for (let i = 0; i < p.acknowledgement; i++) {
    Content.push(Acknowledgement(data, pricing));
  }

  for (let i = 0; i < p.invoice; i++) {
    Content.push(Invoice(data, pricing));
  }

  for (let i = 0; i < p.assembly_list; i++) {
    const type = 'Page';

    const newParts = Glass_Selection(data, type).map((j) => {
      const newData = { ...data, part_list: j };
      return newData;
    });

    newParts.map((k) => {
      return Content.push(AssemblyList(k, breakdowns));
    });
  }


  for (let i = 0; i < p.packing_slip; i++) {
    Content.push(Packing_Slip(data, breakdowns));
  }

  for (let i = 0; i < p.qc; i++) {
    Content.push(QC(data, breakdowns));
  }

  for (let i = 0; i < p.door_labels; i++) {
    Content.push(Door_Labels(data, breakdowns));
  }



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
                text: fileName, style: 'warrantyFont', alignment: 'right'
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
  pdfMake.createPdf(documentDefinition).open();
};
