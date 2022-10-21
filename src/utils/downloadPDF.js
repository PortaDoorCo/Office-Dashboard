import Acknowledgement from '../views/PrintOuts/Pages/Door/Acknowledgement';
import AssemblyList from '../views/PrintOuts/Pages/Door/AssemblyList';
import Door_Labels from '../views/PrintOuts/Pages/Door/Door_Labels';
import Invoice from '../views/PrintOuts/Pages/Door/Invoice';
import MaterialsList from '../views/PrintOuts/Pages/Door/MaterialList';
import PackingSlip from '../views/PrintOuts/Pages/Door/PackingSlip';
import PanelsPage from '../views/PrintOuts/Pages/Door/Panels';
import Profiles from '../views/PrintOuts/Pages/Door/Profiles';
import QC_Checklist from '../views/PrintOuts/Pages/Door/QC';
import RailsPage from '../views/PrintOuts/Pages/Door/Rails';
import SolidsPage from '../views/PrintOuts/Pages/Door/Solids';
import StilesPage from '../views/PrintOuts/Pages/Door/Stiles';
import Drawer_Acknowledgement from '../views/PrintOuts/Pages/Drawer/Acknowledgement';
import Drawer_AssemblyList from '../views/PrintOuts/Pages/Drawer/AssemblyList';
import Drawer_Bottoms from '../views/PrintOuts/Pages/Drawer/Bottoms';
import Drawer_Box_Labels from '../views/PrintOuts/Pages/Drawer/Box_Labels';
import Drawer_Invoice from '../views/PrintOuts/Pages/Drawer/Invoice';
import Drawer_Packing_Slip from '../views/PrintOuts/Pages/Drawer/PackingSlip';
import Drawer_Sides from '../views/PrintOuts/Pages/Drawer/Sides';
import Face_Frame_Acknowledgement from '../views/PrintOuts/Pages/FaceFrames/Acknowledgement';
import Face_Frame_Assembly_List from '../views/PrintOuts/Pages/FaceFrames/Assembly_List';
import Face_Frame_Labels from '../views/PrintOuts/Pages/FaceFrames/Door_Labels';
import Face_Frame_Invoice from '../views/PrintOuts/Pages/FaceFrames/Invoice';
import Face_Frame_Packing_Slip from '../views/PrintOuts/Pages/FaceFrames/Packing_Slip';
import Face_Frame_QC from '../views/PrintOuts/Pages/FaceFrames/QC';
import Misc_Item_Acknowledgement from '../views/PrintOuts/Pages/MiscItems/Acknowledgement';
import Misc_Item_Invoice from '../views/PrintOuts/Pages/MiscItems/Invoice';
import Misc_Item_Packing_Slip from '../views/PrintOuts/Pages/MiscItems/Packing_Slip';
import Misc_Item_QC from '../views/PrintOuts/Pages/MiscItems/QC';
import Moulding_Acknowledgement from '../views/PrintOuts/Pages/Mouldings/Acknowledgement';
import Moulding_Assembly_List from '../views/PrintOuts/Pages/Mouldings/AssemblyList';
import Moulding_Invoice from '../views/PrintOuts/Pages/Mouldings/Invoice';
import Moulding_Packing_Slip from '../views/PrintOuts/Pages/Mouldings/Packing_Slip';
import Moulding_QC from '../views/PrintOuts/Pages/Mouldings/QC';
import FlatStock_Acknowledgement from '../views/PrintOuts/Pages/FlatStock/Acknowledgement';
import FlatStock_Assembly_List from '../views/PrintOuts/Pages/FlatStock/AssemblyList';
import FlatStock_Invoice from '../views/PrintOuts/Pages/FlatStock/Invoice';
import FlatStock_Packing_Slip from '../views/PrintOuts/Pages/FlatStock/Packing_Slip';
import FlatStock_QC from '../views/PrintOuts/Pages/FlatStock/QC';
import Slab_Selection from '../views/PrintOuts/Sorting/Slab_Selection';
import PDFMerger from 'pdf-merger-js/browser';

const toDataUrl = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
};

const downloadPDF = async (p, data, breakdowns, box_breakdowns, pricing) => {
  console.log({ data, breakdowns, box_breakdowns, pricing });

  const merger = new PDFMerger();

  const generatePDF = async (files) => {
    if (files.length > 0) {
      await Promise.all(files.map(async (file) => await merger.add(file)));

      const mergedPdf = await merger.saveAsBlob();
      const url = URL.createObjectURL(mergedPdf);

      await window.open(url, '_blank').focus();
      await files.pop();
    }
  };

  const noPhoto =
    'https://res.cloudinary.com/porta-door/image/upload/v1634764886/none_2fcc23e82e.png';

  if (data.orderType === 'Door Order') {
    const designPromiseArr1 = data.part_list.map((i) => {
      return new Promise((resolve, reject) => {
        toDataUrl(
          i.design?.photo?.url ? i.design?.photo?.url : noPhoto,
          (result) => {
            resolve(result);
          }
        );
      });
    });

    const edgesPromiseArr1 = data.part_list.map((i) => {
      return new Promise((resolve, reject) => {
        toDataUrl(
          i.edge?.photo?.url ? i.edge?.photo?.url : noPhoto,
          (result) => {
            resolve(result);
          }
        );
      });
    });

    const mouldsPromiseArr1 = data.part_list.map((i) => {
      return new Promise((resolve, reject) => {
        toDataUrl(
          i.profile?.photo?.url ? i.profile?.photo?.url : noPhoto,
          (result) => {
            resolve(result);
          }
        );
      });
    });

    const miterPromiseArr1 = data.part_list.map((i) => {
      return new Promise((resolve, reject) => {
        toDataUrl(
          i.miter_design?.photo?.url ? i.miter_design?.photo?.url : noPhoto,
          (result) => {
            resolve(result);
          }
        );
      });
    });

    const MT_PromiseArr1 = data.part_list.map((i) => {
      return new Promise((resolve, reject) => {
        toDataUrl(
          i.mt_design?.photo?.url ? i.mt_design?.photo?.url : noPhoto,
          (result) => {
            resolve(result);
          }
        );
      });
    });

    const panelsPromiseArr1 = data.part_list.map((i) => {
      return new Promise((resolve, reject) => {
        toDataUrl(
          i.panel?.photo?.url ? i.panel?.photo?.url : noPhoto,
          (result) => {
            resolve(result);
          }
        );
      });
    });

    const appliedProfilePromiseArr1 = data.part_list.map((i) => {
      return new Promise((resolve, reject) => {
        toDataUrl(
          i.applied_profile?.photo?.url
            ? i.applied_profile?.photo?.url
            : noPhoto,
          (result) => {
            resolve(result);
          }
        );
      });
    });

    let design1;
    let edges1;
    let moulds1;
    let miter1;
    let mt_1;
    let panels1;
    let appliedProfiles1;

    try {
      design1 = await Promise.all(designPromiseArr1);
      edges1 = await Promise.all(edgesPromiseArr1);
      moulds1 = await Promise.all(mouldsPromiseArr1);
      miter1 = await Promise.all(miterPromiseArr1);
      mt_1 = await Promise.all(MT_PromiseArr1);
      panels1 = await Promise.all(panelsPromiseArr1);
      appliedProfiles1 = await Promise.all(appliedProfilePromiseArr1);
    } catch (err) {
      console.log('errrrrrr', err);
    }

    const type = 'Page';

    let itemNum = 0;

    const newDataOrder = {
      ...data,
      part_list: data.part_list.map((i) => {
        return {
          ...i,
          dimensions: i.dimensions.map((j) => {
            itemNum += 1;
            return {
              ...j,
              construction: i.construction,
              profile: i.profile,
              design: i.design,
              edge: i.edge,
              panel: i.panel,
              orderType: i.orderType,
              VERTICAL_GRAIN: i.VERTICAL_GRAIN,
              item: itemNum,
            };
          }),
        };
      }),
    };

    const newParts = Slab_Selection(newDataOrder, type).map((j) => {
      const newData = {
        ...data,
        part_list: j,
        hasSlab: j.some((e) => e.hasSlab === true),
      };
      return newData;
    });

    let files = [];

    for (let i = 0; i < p.acknowledgement; i++) {
      await Acknowledgement(
        newDataOrder,
        design1,
        edges1,
        moulds1,
        miter1,
        mt_1,
        panels1,
        appliedProfiles1,
        breakdowns,
        p,
        pricing
      ).then(async (v) => {
        files.push(v);
      });
      await Profiles(
        newDataOrder,
        design1,
        edges1,
        moulds1,
        miter1,
        mt_1,
        panels1,
        appliedProfiles1,
        breakdowns,
        p,
        pricing
      ).then(async (v) => {
        files.push(v);
      });
    }

    for (let i = 0; i < p.invoice; i++) {
      await Invoice(
        newDataOrder,
        design1,
        edges1,
        moulds1,
        miter1,
        mt_1,
        panels1,
        appliedProfiles1,
        breakdowns,
        p,
        pricing
      ).then(async (v) => {
        files.push(v);
      });
    }

    for (let i = 0; i < p.assembly_list; i++) {
      await AssemblyList(
        newDataOrder,
        design1,
        edges1,
        moulds1,
        miter1,
        mt_1,
        panels1,
        appliedProfiles1,
        breakdowns,
        p,
        pricing
      ).then(async (v) => {
        files.push(v);
      });
    }

    for (let i = 0; i < p.panels; i++) {
      await Promise.all(
        newParts.map(async (k) => {
          if (k.hasSlab) {
            return await SolidsPage(
              k,
              design1,
              edges1,
              moulds1,
              miter1,
              mt_1,
              panels1,
              appliedProfiles1,
              breakdowns,
              p,
              pricing,
              newDataOrder
            ).then(async (v) => {
              files.push(v);
            });
          } else {
            if (k.part_list.length > 0) {
              return await PanelsPage(
                k,
                design1,
                edges1,
                moulds1,
                miter1,
                mt_1,
                panels1,
                appliedProfiles1,
                breakdowns,
                p,
                pricing,
                newDataOrder
              ).then(async (v) => {
                files.push(v);
              });
            } else {
              return null;
            }
          }
        })
      );

      // const generatePanels = async () => {

      // };

      // await generatePanels();
    }

    for (let i = 0; i < p.stiles; i++) {
      await StilesPage(
        newDataOrder,
        design1,
        edges1,
        moulds1,
        miter1,
        mt_1,
        panels1,
        appliedProfiles1,
        breakdowns,
        p,
        pricing
      ).then(async (v) => {
        files.push(v);
      });
    }

    for (let i = 0; i < p.rails; i++) {
      await RailsPage(
        newDataOrder,
        design1,
        edges1,
        moulds1,
        miter1,
        mt_1,
        panels1,
        appliedProfiles1,
        breakdowns,
        p,
        pricing
      ).then(async (v) => {
        files.push(v);
      });
    }

    for (let i = 0; i < p.profiles; i++) {
      await Profiles(
        newDataOrder,
        design1,
        edges1,
        moulds1,
        miter1,
        mt_1,
        panels1,
        appliedProfiles1,
        breakdowns,
        p,
        pricing
      ).then(async (v) => {
        files.push(v);
      });
    }

    for (let i = 0; i < p.materials; i++) {
      await MaterialsList(
        newDataOrder,
        design1,
        edges1,
        moulds1,
        miter1,
        mt_1,
        panels1,
        appliedProfiles1,
        breakdowns,
        p,
        pricing
      ).then(async (v) => {
        files.push(v);
      });
    }

    for (let i = 0; i < p.packing_slip; i++) {
      await PackingSlip(
        newDataOrder,
        design1,
        edges1,
        moulds1,
        miter1,
        mt_1,
        panels1,
        appliedProfiles1,
        breakdowns,
        p,
        pricing
      ).then(async (v) => {
        files.push(v);
      });
    }

    for (let i = 0; i < p.qc; i++) {
      await QC_Checklist(
        newDataOrder,
        design1,
        edges1,
        moulds1,
        miter1,
        mt_1,
        panels1,
        appliedProfiles1,
        breakdowns,
        p,
        pricing
      ).then(async (v) => {
        files.push(v);
      });
    }

    if (p.door_labels > 0) {
      await Door_Labels(
        newDataOrder,
        design1,
        edges1,
        moulds1,
        miter1,
        mt_1,
        panels1,
        appliedProfiles1,
        breakdowns,
        p,
        pricing
      ).then(async (v) => {
        files.push(v);
      });
    }

    await generatePDF(files);
  } else if (data.orderType === 'Drawer Order') {
    let files = [];

    // DrawerPDF(data, box_breakdowns, p, pricing);

    for (let i = 0; i < p.acknowledgement; i++) {
      await Drawer_Acknowledgement(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.invoice; i++) {
      await Drawer_Invoice(data, box_breakdowns, p, pricing).then(async (v) => {
        files.push(v);
      });
    }

    for (let i = 0; i < p.assembly_list; i++) {
      await Drawer_AssemblyList(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.box_sides; i++) {
      await Drawer_Sides(data, box_breakdowns, p, pricing).then(async (v) => {
        files.push(v);
      });
    }

    for (let i = 0; i < p.box_bottoms; i++) {
      await Drawer_Bottoms(data, box_breakdowns, p, pricing).then(async (v) => {
        files.push(v);
      });
    }

    for (let i = 0; i < p.packing_slip; i++) {
      await Drawer_Packing_Slip(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.box_labels; i++) {
      await Drawer_Box_Labels(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    await generatePDF(files);
  } else if (data.orderType === 'Misc Items') {
    // MiscItemsPDF(data, box_breakdowns, p, pricing);

    let files = [];

    for (let i = 0; i < p.acknowledgement; i++) {
      await Misc_Item_Acknowledgement(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.invoice; i++) {
      await Misc_Item_Invoice(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.packing_slip; i++) {
      await Misc_Item_Packing_Slip(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.qc; i++) {
      await Misc_Item_QC(data, box_breakdowns, p, pricing).then(async (v) => {
        files.push(v);
      });
    }

    await generatePDF(files);
  } else if (data.orderType === 'Mouldings') {
    // MouldingsPDF(data, box_breakdowns, p, pricing);

    let files = [];

    for (let i = 0; i < p.acknowledgement; i++) {
      await Moulding_Acknowledgement(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.invoice; i++) {
      await Moulding_Invoice(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.assembly_list; i++) {
      await Moulding_Assembly_List(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.packing_slip; i++) {
      await Moulding_Packing_Slip(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.qc; i++) {
      await Moulding_QC(data, box_breakdowns, p, pricing).then(async (v) => {
        files.push(v);
      });
    }

    await generatePDF(files);
  } else if (data.orderType === 'Flat Stock') {
    // MouldingsPDF(data, box_breakdowns, p, pricing);

    let files = [];

    for (let i = 0; i < p.acknowledgement; i++) {
      await FlatStock_Acknowledgement(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.invoice; i++) {
      await FlatStock_Invoice(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.assembly_list; i++) {
      await FlatStock_Assembly_List(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.packing_slip; i++) {
      await FlatStock_Packing_Slip(data, box_breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.qc; i++) {
      await FlatStock_QC(data, box_breakdowns, p, pricing).then(async (v) => {
        files.push(v);
      });
    }

    await generatePDF(files);
  } else if (data.orderType === 'Face Frame') {
    let files = [];

    // FaceFramesPDF(data, breakdowns, p, pricing);

    for (let i = 0; i < p.acknowledgement; i++) {
      await Face_Frame_Acknowledgement(data, breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.invoice; i++) {
      await Face_Frame_Invoice(data, breakdowns, p, pricing).then(async (v) => {
        files.push(v);
      });
    }

    for (let i = 0; i < p.assembly_list; i++) {
      await Face_Frame_Assembly_List(data, breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.packing_slip; i++) {
      await Face_Frame_Packing_Slip(data, breakdowns, p, pricing).then(
        async (v) => {
          files.push(v);
        }
      );
    }

    for (let i = 0; i < p.qc; i++) {
      await Face_Frame_QC(data, breakdowns, p, pricing).then(async (v) => {
        files.push(v);
      });
    }

    if (p.door_labels > 0) {
      await Face_Frame_Labels(data, breakdowns, p, pricing).then(async (v) => {
        files.push(v);
      });
    }

    await generatePDF(files);
  }
};

export default downloadPDF;
