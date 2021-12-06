import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Attachment from '@material-ui/icons/Attachment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Chat from '@material-ui/icons/Chat';
import Delete from '@material-ui/icons/Delete';
import Dns from '@material-ui/icons/Dns';
import FileCopy from '@material-ui/icons/FileCopy';
import GetAppIcon from '@material-ui/icons/GetApp';
import List from '@material-ui/icons/List';
import Print from '@material-ui/icons/Print';
import Cookies from 'js-cookie';
// import BoxLabelPDF from '../../PrintOuts/Pages/Drawer/BoxLabels';
import moment from 'moment';
import numQty from 'numeric-quantity';
import PDFMerger from 'pdf-merger-js/browser';
import React, { Component, createRef } from 'react';
import { CSVLink } from 'react-csv';
import CsvDownloader from 'react-csv-downloader';
import { connect } from 'react-redux';
import {
  Button, Card, CardBody, Col, Collapse, Modal, ModalBody,
  ModalFooter, ModalHeader, Row, Table
} from 'reactstrap';
import { bindActionCreators } from 'redux';
import { getFormValues } from 'redux-form';
import FileUploader from '../../../components/FileUploader/FileUploader';
import {
  deleteFilesFromOrder, deleteOrder, loadOrders, setSelectedOrder, submitOrder, updateOrder, uploadFilesToOrder
} from '../../../redux/orders/actions';
import LoadingModal from '../../../utils/LoadingModal';
import CopyModal from '../../../utils/Modal';
import Rails from '../../PrintOuts/Breakdowns/Doors/Rails/Rails';
import Stiles from '../../PrintOuts/Breakdowns/Doors/Stiles/Stiles';
import PrintModal from '../../PrintOuts/Modal/Modal';
import Acknowledgement from '../../PrintOuts/Pages/Door/Acknowledgement';
import AssemblyList from '../../PrintOuts/Pages/Door/AssemblyList';
import Door_Labels from '../../PrintOuts/Pages/Door/Door_Labels';
import Invoice from '../../PrintOuts/Pages/Door/Invoice';
import MaterialsList from '../../PrintOuts/Pages/Door/MaterialList';
import PackingSlip from '../../PrintOuts/Pages/Door/PackingSlip';
import PanelsPage from '../../PrintOuts/Pages/Door/Panels';
import Profiles from '../../PrintOuts/Pages/Door/Profiles';
import QC_Checklist from '../../PrintOuts/Pages/Door/QC';
import RailsPage from '../../PrintOuts/Pages/Door/Rails';
import SolidsPage from '../../PrintOuts/Pages/Door/Solids';
import StilesPage from '../../PrintOuts/Pages/Door/Stiles';
import Drawer_Acknowledgement from '../../PrintOuts/Pages/Drawer/Acknowledgement';
import Drawer_AssemblyList from '../../PrintOuts/Pages/Drawer/AssemblyList';
import Drawer_Bottoms from '../../PrintOuts/Pages/Drawer/Bottoms';
import Drawer_Box_Labels from '../../PrintOuts/Pages/Drawer/Box_Labels';
import Drawer_Invoice from '../../PrintOuts/Pages/Drawer/Invoice';
import Drawer_Packing_Slip from '../../PrintOuts/Pages/Drawer/PackingSlip';
import Drawer_Sides from '../../PrintOuts/Pages/Drawer/Sides';
import Face_Frame_Acknowledgement from '../../PrintOuts/Pages/FaceFrames/Acknowledgement';
import Face_Frame_Assembly_List from '../../PrintOuts/Pages/FaceFrames/Assembly_List';
import Face_Frame_Labels from '../../PrintOuts/Pages/FaceFrames/Door_Labels';
import Face_Frame_Invoice from '../../PrintOuts/Pages/FaceFrames/Invoice';
import Face_Frame_Packing_Slip from '../../PrintOuts/Pages/FaceFrames/Packing_Slip';
import Face_Frame_QC from '../../PrintOuts/Pages/FaceFrames/QC';
import Misc_Item_Acknowledgement from '../../PrintOuts/Pages/MiscItems/Acknowledgement';
import Misc_Item_Invoice from '../../PrintOuts/Pages/MiscItems/Invoice';
import Misc_Item_Packing_Slip from '../../PrintOuts/Pages/MiscItems/Packing_Slip';
import Misc_Item_QC from '../../PrintOuts/Pages/MiscItems/QC';
import Moulding_Acknowledgement from '../../PrintOuts/Pages/Mouldings/Acknowledgement';
import Moulding_Assembly_List from '../../PrintOuts/Pages/Mouldings/AssemblyList';
import Moulding_Invoice from '../../PrintOuts/Pages/Mouldings/Invoice';
import Moulding_Packing_Slip from '../../PrintOuts/Pages/Mouldings/Packing_Slip';
import Moulding_QC from '../../PrintOuts/Pages/Mouldings/QC';
import Slab_Selection from '../../PrintOuts/Sorting/Slab_Selection';
import OrderEntry from '../OrderEntry/OrderEntry';
import Balance from './Balance/Balance';
import BalanceHistory from './Balance/BalanceHistory';
import MiscItems from './MiscItems';
import Navigation from './Navigation';
import ConversationNotes from './Notes/Conversation_Notes';
























const cookie = Cookies.get('jwt');

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

class OrderPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      orderEdit: false,
      page: [],
      tooltipOpen: false,
      selectedOption: [],
      edgePhoto: null,
      trackingOpen: false,
      filesOpen: false,
      deleteModal: false,
      balanceOpen: false,
      miscItemsOpen: false,
      notesOpen: false,
      printModal: false,
      copyModal: false,
      loadingModal: false,
    };
    this.someRef = createRef();
  }

  handleCopyModal = () => {
    this.setState({ copyModal: !this.state.copyModal });
  };

  breakdown = (e) => {
    e.preventDefault();
    this.setState({ page: 'breakdowns' });
  };

  invoice = (e) => {
    e.preventDefault();
    this.setState({ page: 'invoice' });
  };

  close = (e) => {
    e.preventDefault();
    this.setState({ page: [] });
  };

  editable = () => {
    this.setState({
      edit: !this.state.edit,
    });
  };

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  };

  toggleTracking = () => {
    const scroll = document.getElementById('scrollModal');
    scroll.parentNode.scrollTo({ top: 0, behavior: 'smooth' });
    this.setState({
      trackingOpen: !this.state.trackingOpen,
    });
  };

  toggleBalance = () => {
    const scroll = document.getElementById('scrollModal');
    scroll.parentNode.scrollTo({ top: 0, behavior: 'smooth' });
    this.setState({
      balanceOpen: !this.state.balanceOpen,
    });
  };

  toggleMiscItems = () => {
    const scroll = document.getElementById('scrollModal');
    scroll.parentNode.scrollTo({ top: 0, behavior: 'smooth' });

    this.setState({
      miscItemsOpen: !this.state.miscItemsOpen,
    });
  };

  toggleFiles = () => {
    const scroll = document.getElementById('scrollModal');
    scroll.parentNode.scrollTo({ top: 0, behavior: 'smooth' });
    this.setState({
      filesOpen: !this.state.filesOpen,
    });
  };

  toggleNotes = () => {
    const scroll = document.getElementById('scrollModal');
    scroll.parentNode.scrollTo({ top: 0, behavior: 'smooth' });
    this.setState({
      notesOpen: !this.state.notesOpen,
    });
  };

  toggleDeleteModal = () =>
    this.setState({
      deleteModal: !this.state.deleteModal,
    });

  onUploaded = (e) => {
    const { uploadFilesToOrder, selectedOrder } = this.props;
    uploadFilesToOrder(selectedOrder, e, cookie);
  };

  deleteOrder = async () => {
    const { selectedOrder } = this.props;
    await this.props.deleteOrder(selectedOrder.id, cookie);
    await this.toggleDeleteModal();
    await this.props.toggle();
  };

  togglePrinter = () => {
    this.setState({
      printModal: !this.state.printModal,
    });
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption }, () =>
      console.log('Option selected:', this.state.selectedOption)
    );
  };

  copyOrder = async () => {
    const {
      formState,
      submitOrder,
    } = this.props;
    const data = formState
      ? formState
      : [];

    let newOrder = {
      ...data,
      job_info: {
        ...data.job_info,
        poNum: `${data.job_info.poNum} - COPY`,
        status: 'Quote',
      },
    };

    newOrder.part_list.map((i) => {
      delete i['id'];
      delete i['_id'];
      return null;
    });

    delete newOrder['id'];
    delete newOrder['_id'];
    delete newOrder['orderNum'];
    delete newOrder['created_at'];
    delete newOrder['updatedAt'];
    delete newOrder['published_at'];

    newOrder['balance_history'] = [{ balance_paid: 0 }];
    newOrder['balance_paid'] = 0;
    newOrder['files'] = [];
    newOrder['Rush'] = false;
    newOrder['Sample'] = false;

    await submitOrder(newOrder, cookie);
    await this.props.toggle();
  };

  toggleLoadingModal = () => {
    this.setState({
      loadingModal: !this.state.loadingModal,
    });
  };

  downloadPDF = async (p) => {
    this.toggleLoadingModal();

    const {
      formState,
      breakdowns,
      box_breakdowns,
      selectedOrder,
    } = this.props;
    const data = formState
      ? formState
      : [];

    const merger = new PDFMerger();

    const generatePDF = async (files) => {
      if (files.length > 0) {
        await Promise.all(files.map(async (file) => await merger.add(file)));

        const mergedPdf = await merger.saveAsBlob();
        const url = URL.createObjectURL(mergedPdf);

        console.log({ url });

        await window.open(url, '_blank').focus();
        await files.pop();

        this.toggleLoadingModal();
      }
    };

    const noPhoto =
      'https://res.cloudinary.com/porta-door/image/upload/v1634764886/none_2fcc23e82e.png';

    if (data.orderType === 'Door Order') {
      const designPromiseArr1 = selectedOrder.part_list.map((i) => {
        return new Promise((resolve, reject) => {
          toDataUrl(
            i.design?.photo?.url ? i.design?.photo?.url : noPhoto,
            (result) => {
              resolve(result);
            }
          );
        });
      });

      const edgesPromiseArr1 = selectedOrder.part_list.map((i) => {
        return new Promise((resolve, reject) => {
          toDataUrl(
            i.edge?.photo?.url ? i.edge?.photo?.url : noPhoto,
            (result) => {
              resolve(result);
            }
          );
        });
      });

      const mouldsPromiseArr1 = selectedOrder.part_list.map((i) => {
        return new Promise((resolve, reject) => {
          toDataUrl(
            i.profile?.photo?.url ? i.profile?.photo?.url : noPhoto,
            (result) => {
              resolve(result);
            }
          );
        });
      });

      const miterPromiseArr1 = selectedOrder.part_list.map((i) => {
        return new Promise((resolve, reject) => {
          toDataUrl(
            i.miter_design?.photo?.url ? i.miter_design?.photo?.url : noPhoto,
            (result) => {
              resolve(result);
            }
          );
        });
      });

      const MT_PromiseArr1 = selectedOrder.part_list.map((i) => {
        return new Promise((resolve, reject) => {
          toDataUrl(
            i.mt_design?.photo?.url ? i.mt_design?.photo?.url : noPhoto,
            (result) => {
              resolve(result);
            }
          );
        });
      });

      const panelsPromiseArr1 = selectedOrder.part_list.map((i) => {
        return new Promise((resolve, reject) => {
          toDataUrl(
            i.panel?.photo?.url ? i.panel?.photo?.url : noPhoto,
            (result) => {
              resolve(result);
            }
          );
        });
      });

      const appliedProfilePromiseArr1 = selectedOrder.part_list.map((i) => {
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

      const itemNumCounter = {
        ...data,
        part_list: data.part_list.map((i) => {
          return {
            ...i,
            dimensions: i.dimensions.map((j) => {
              itemNum += 1;
              return {
                ...j,
                item: itemNum,
              };
            }),
          };
        }),
      };

      const newParts = Slab_Selection(itemNumCounter, type).map((j) => {
        const newData = {
          ...data,
          part_list: j,
          hasSlab: j.some((e) => e.hasSlab === true),
        };
        return newData;
      });

      console.log({ newParts });

      let files = [];

      for (let i = 0; i < p.acknowledgement; i++) {
        await Acknowledgement(
          data,
          design1,
          edges1,
          moulds1,
          miter1,
          mt_1,
          panels1,
          appliedProfiles1,
          breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
        await Profiles(
          data,
          design1,
          edges1,
          moulds1,
          miter1,
          mt_1,
          panels1,
          appliedProfiles1,
          breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.invoice; i++) {
        await Invoice(
          data,
          design1,
          edges1,
          moulds1,
          miter1,
          mt_1,
          panels1,
          appliedProfiles1,
          breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.assembly_list; i++) {
        await AssemblyList(
          data,
          design1,
          edges1,
          moulds1,
          miter1,
          mt_1,
          panels1,
          appliedProfiles1,
          breakdowns,
          p,
          this.props.pricing
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
                this.props.pricing
              ).then(async (v) => {
                console.log({ v });
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
                  this.props.pricing
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
          data,
          design1,
          edges1,
          moulds1,
          miter1,
          mt_1,
          panels1,
          appliedProfiles1,
          breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.rails; i++) {
        await RailsPage(
          data,
          design1,
          edges1,
          moulds1,
          miter1,
          mt_1,
          panels1,
          appliedProfiles1,
          breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.profiles; i++) {
        await Profiles(
          data,
          design1,
          edges1,
          moulds1,
          miter1,
          mt_1,
          panels1,
          appliedProfiles1,
          breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.materials; i++) {
        await MaterialsList(
          data,
          design1,
          edges1,
          moulds1,
          miter1,
          mt_1,
          panels1,
          appliedProfiles1,
          breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.packing_slip; i++) {
        await PackingSlip(
          data,
          design1,
          edges1,
          moulds1,
          miter1,
          mt_1,
          panels1,
          appliedProfiles1,
          breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.qc; i++) {
        await QC_Checklist(
          data,
          design1,
          edges1,
          moulds1,
          miter1,
          mt_1,
          panels1,
          appliedProfiles1,
          breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.door_labels; i++) {
        await Door_Labels(
          data,
          design1,
          edges1,
          moulds1,
          miter1,
          mt_1,
          panels1,
          appliedProfiles1,
          breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      console.log({ files });

      await generatePDF(files);
    } else if (data.orderType === 'Drawer Order') {
      let files = [];

      // DrawerPDF(data, box_breakdowns, p, this.props.pricing);

      for (let i = 0; i < p.acknowledgement; i++) {
        await Drawer_Acknowledgement(
          data,
          box_breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.invoice; i++) {
        await Drawer_Invoice(data, box_breakdowns, p, this.props.pricing).then(
          async (v) => {
            files.push(v);
          }
        );
      }

      for (let i = 0; i < p.assembly_list; i++) {
        await Drawer_AssemblyList(
          data,
          box_breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.box_sides; i++) {
        await Drawer_Sides(data, box_breakdowns, p, this.props.pricing).then(
          async (v) => {
            files.push(v);
          }
        );
      }

      for (let i = 0; i < p.box_bottoms; i++) {
        await Drawer_Bottoms(data, box_breakdowns, p, this.props.pricing).then(
          async (v) => {
            files.push(v);
          }
        );
      }

      for (let i = 0; i < p.packing_slip; i++) {
        await Drawer_Packing_Slip(
          data,
          box_breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.box_labels; i++) {
        await Drawer_Box_Labels(
          data,
          box_breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      await generatePDF(files);
    } else if (data.orderType === 'Misc Items') {
      // MiscItemsPDF(data, box_breakdowns, p, this.props.pricing);

      let files = [];

      for (let i = 0; i < p.acknowledgement; i++) {
        await Misc_Item_Acknowledgement(
          data,
          box_breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.invoice; i++) {
        await Misc_Item_Invoice(
          data,
          box_breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.packing_slip; i++) {
        await Misc_Item_Packing_Slip(
          data,
          box_breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.qc; i++) {
        await Misc_Item_QC(data, box_breakdowns, p, this.props.pricing).then(
          async (v) => {
            files.push(v);
          }
        );
      }

      await generatePDF(files);
    } else if (data.orderType === 'Mouldings') {
      // MouldingsPDF(data, box_breakdowns, p, this.props.pricing);

      let files = [];

      for (let i = 0; i < p.acknowledgement; i++) {
        await Moulding_Acknowledgement(
          data,
          box_breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.invoice; i++) {
        await Moulding_Invoice(
          data,
          box_breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.assembly_list; i++) {
        await Moulding_Assembly_List(
          data,
          box_breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.packing_slip; i++) {
        await Moulding_Packing_Slip(
          data,
          box_breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.qc; i++) {
        await Moulding_QC(data, box_breakdowns, p, this.props.pricing).then(
          async (v) => {
            files.push(v);
          }
        );
      }

      await generatePDF(files);
    } else if (data.orderType === 'Face Frame') {
      let files = [];

      // FaceFramesPDF(data, breakdowns, p, this.props.pricing);

      for (let i = 0; i < p.acknowledgement; i++) {
        await Face_Frame_Acknowledgement(
          data,
          breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.invoice; i++) {
        await Face_Frame_Invoice(data, breakdowns, p, this.props.pricing).then(
          async (v) => {
            files.push(v);
          }
        );
      }

      for (let i = 0; i < p.assembly_list; i++) {
        await Face_Frame_Assembly_List(
          data,
          breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.packing_slip; i++) {
        await Face_Frame_Packing_Slip(
          data,
          breakdowns,
          p,
          this.props.pricing
        ).then(async (v) => {
          files.push(v);
        });
      }

      for (let i = 0; i < p.qc; i++) {
        await Face_Frame_QC(data, breakdowns, p, this.props.pricing).then(
          async (v) => {
            files.push(v);
          }
        );
      }

      for (let i = 0; i < p.door_labels; i++) {
        await Face_Frame_Labels(data, breakdowns, p, this.props.pricing).then(
          async (v) => {
            files.push(v);
          }
        );
      }

      await generatePDF(files);
    }
  };

  downloadBoxLabel = async (printerSettings) => {
    const {
      formState,
      box_breakdowns,
    } = this.props;
    const data = formState
      ? formState
      : [];
    Drawer_Box_Labels(data, box_breakdowns);
  };

  render() {
    const props = this.props;

    const { selectedOrder, printer_options, user, deleteFilesFromOrder } =
      this.props;

    let options;
    let s = selectedOrder ? selectedOrder : 'Door Order';

    let exportCsv = [];
    let a = [];
    let razorGuage = [];

    let b = a.map((i, ind) => {
      return i;
    });

    let itemNum = 0;

    const itemNumCounter = {
      ...s,
      part_list: s?.part_list?.map((i) => {
        return {
          ...i,
          dimensions: i?.dimensions?.map((j) => {
            itemNum += 1;
            return {
              ...j,
              item: itemNum,
            };
          }),
        };
      }),
    };

    if (s.orderType === 'Door Order') {
      options = [
        { value: 'Breakdowns', label: 'Breakdowns' },
        { value: 'CustomerCopy', label: 'Customer Copy' },
        { value: 'Assembly', label: 'Assembly List' },
        { value: 'Acknowledgement', label: 'Acknowledgement' },
        { value: 'Invoice', label: 'Invoice' },
        { value: 'Stiles', label: 'Stiles' },
        { value: 'Rails', label: 'Rails' },
        { value: 'Panels', label: 'Panels' },
        { value: 'Materials', label: 'Materials' },
        { value: 'Profiles', label: 'Profiles' },
        { value: 'QC', label: 'QC' },
      ];

      exportCsv = s
        ? itemNumCounter.part_list.map((f, index) => {
          f.dimensions.forEach((j, ind) => {
            if (
              f.orderType.value === 'DF' ||
                numQty(j.width) > numQty(j.height)
            ) {
              a.push([
                s.orderNum,
                '15DF',
                j.qty,
                f.woodtype && f.woodtype.NAME,
                numQty(j.width),
                numQty(j.height),
                f.edge && f.edge.NAME,
                  f.thickness?.thickness_values
                    ? f.thickness?.thickness_values
                    : f.thickness?.thickness_1 === '4/4'
                      ? 0.75
                      : f.thickness?.thickness_1 === '5/4'
                        ? 1
                        : f.thickness?.thickness_1 === '6/4'
                          ? 1.25
                          : 0.75,
              ]);
            } else {
              a.push([
                s.orderNum,
                'D',
                j.qty,
                f.woodtype && f.woodtype.NAME,
                numQty(j.width),
                numQty(j.height),
                f.edge && f.edge.NAME,
                  f.thickness?.thickness_values
                    ? f.thickness?.thickness_values
                    : f.thickness?.thickness_1 === '4/4'
                      ? 0.75
                      : f.thickness?.thickness_1 === '5/4'
                        ? 1
                        : f.thickness?.thickness_1 === '6/4'
                          ? 1.25
                          : 0.75,
              ]);
            }
          });
          return a;
        })
        : [];

      const razor = itemNumCounter
        ? itemNumCounter.part_list.map((f, index) => {
          // console.log({ f });

          f.dimensions.forEach((j, ind) => {
            // console.log({ j });

            const { breakdowns } = this.props;

            const stile = (Stiles(j, f, breakdowns) || []).map((rail) => {
              return rail;
            });

            const rail = (Rails(j, f, breakdowns) || []).map((rail) => {
              return rail;
            });

            // console.log({ rail });
            // console.log({ stile });

            const stilePrint = stile.map((i) => {
              return razorGuage.push([
                `${s.orderNum}`,
                `${f.woodtype?.NAME} ${f.thickness?.thickness_1}`,
                i.width,
                i.height,
                i.qty_2,
                i.razor_pattern,
                `${f.design?.NAME} ${f.thickness?.thickness_1}`,
                i.item,
                  f.profile?.NAME
                    ? f.profile?.NAME
                    : f.design?.NAME
                      ? f.design?.NAME
                      : '',
              ]);
            });

            const railPrint = rail.map((i) => {
              console.log({ i });
              return razorGuage.push([
                `${s.orderNum}`,
                `${f.woodtype?.NAME} ${f.thickness?.thickness_1}`,
                i.width,
                i.height,
                i.qty_2,
                i.razor_pattern,
                `${f.design?.NAME} ${f.thickness?.thickness_1}`,
                i.item,
                  f.profile?.NAME
                    ? f.profile?.NAME
                    : f.design?.NAME
                      ? f.design?.NAME
                      : '',
              ]);
            });
          });
          return razorGuage;
        })
        : [];
    } else if (s.orderType === 'Drawer Order') {
      options = [
        { value: 'Breakdowns', label: 'Breakdowns' },
        { value: 'CustomerCopy', label: 'Customer Copy' },
        { value: 'Acknowledgement', label: 'Acknowledgement' },
        { value: 'Invoice', label: 'Invoice' },
        { value: 'Assembly', label: 'Assembly List' },
        { value: 'Bottoms', label: 'Box Bottoms' },
        { value: 'Sides', label: 'Box Sides' },
      ];
    } else if (s.orderType === 'Misc Items' || s.orderType === 'Mouldings') {
      options = [
        { value: 'All', label: 'All' },
        { value: 'Acknowledgement', label: 'Acknowledgement' },
        { value: 'Invoice', label: 'Invoice' },
      ];
    }

    return (
      <div className="animated noPrint resize">
        <CopyModal
          message={'Would you like to copy this order?'}
          title={'Copy Order'}
          actionButton={'Copy Order'}
          toggle={this.handleCopyModal}
          modal={this.state.copyModal}
          action={this.copyOrder}
        />

        <Modal
          isOpen={props.modal}
          toggle={props.toggle}
          className="modal-lg"
          id="scrollModal"
        >
          <ModalHeader toggle={props.toggle}>
            Order #{selectedOrder && selectedOrder.orderNum}
          </ModalHeader>
          <ModalBody>
            {this.props.edit ? (
              <div>
                <Row>
                  <Col>
                    <IconButton onClick={this.props.editable}>
                      <ArrowBack style={{ width: '40', height: '40' }} />
                    </IconButton>

                    <Tooltip title="Tracking History" placement="top">
                      <IconButton onClick={this.toggleTracking}>
                        <List style={{ width: '40', height: '40' }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Balance" placement="top">
                      <IconButton onClick={this.toggleBalance}>
                        <AttachMoneyIcon
                          style={{ width: '40', height: '40' }}
                        />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Misc Items" placement="top">
                      <IconButton onClick={this.toggleMiscItems}>
                        <Dns style={{ width: '40', height: '40' }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Notes" placement="top">
                      <IconButton onClick={this.toggleNotes}>
                        <Chat style={{ width: '40', height: '40' }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Files" placement="top">
                      <IconButton onClick={this.toggleFiles}>
                        <Attachment style={{ width: '40', height: '40' }} />
                      </IconButton>
                    </Tooltip>
                  </Col>
                  <Col />
                  <Col />
                </Row>
              </div>
            ) : (
              <div>
                <Modal
                  isOpen={this.state.deleteModal}
                  toggle={this.toggleDeleteModal}
                >
                  <ModalHeader toggle={this.toggleDeleteModal}>
                    Delete Order
                  </ModalHeader>
                  <ModalBody>
                    Are You Sure You Want To Delete This Order?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onClick={this.deleteOrder}>
                      Delete Order
                    </Button>{' '}
                    <Button color="secondary" onClick={this.toggleDeleteModal}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>

                <Row></Row>
                <Row>
                  {user?.role?.type !== 'quality_control' ? (
                    <Navigation
                      {...this.props}
                      toggleTracking={this.toggleTracking}
                      toggleBalance={this.toggleBalance}
                      toggleMiscItems={this.toggleMiscItems}
                      toggleNotes={this.toggleNotes}
                      toggleFiles={this.toggleFiles}
                    />
                  ) : (
                    <Col />
                  )}

                  <Col className="ml-5">
                    <Row>
                      <Col lg="6"></Col>
                      <Col>
                        {/* {(s.orderType === 'Drawer Order') ? 
                          <Tooltip title="Box Labels" placement="top" className="mb-3">
                            <IconButton onClick={this.downloadBoxLabel}>
                              <LabelIcon style={{ width: '40', height: '40' }} />
                            </IconButton>
                          </Tooltip> : null
                        } */}

                        <Tooltip title="Print" placement="top" className="mb-3">
                          <IconButton onClick={this.togglePrinter}>
                            <Print style={{ width: '40', height: '40' }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title="Copy Order"
                          placement="top"
                          className="mb-3"
                        >
                          <IconButton onClick={this.handleCopyModal}>
                            <FileCopy style={{ width: '40', height: '40' }} />
                          </IconButton>
                        </Tooltip>

                        {selectedOrder &&
                        selectedOrder.orderType === 'Door Order' ? (
                            <CSVLink
                              data={a.map((i, ind) => {
                                return [
                                  ...i,
                                  ind + 1,
                                  `*${i[0]}X${('00' + (ind + 1)).slice(-3)}*`,
                                ];
                              })}
                              filename={`${s && s.orderNum}.csv`}
                              separator={','}
                              className="mb-3"
                            >
                              {' '}
                              <Tooltip
                                title="Export Edges"
                                placement="top"
                                className="mb-3"
                              >
                                <IconButton>
                                  <GetAppIcon
                                    style={{ width: '40', height: '40' }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </CSVLink>
                          ) : null}

                        {selectedOrder &&
                        selectedOrder.orderType === 'Door Order' ? (
                            <Tooltip
                              title="Razorguage Export"
                              placement="top"
                              className="mb-3"
                            >
                              <IconButton>
                                <CsvDownloader
                                  datas={razorGuage}
                                  filename={`${s && s.orderNum}`}
                                  extension=".csv"
                                  // uFEFF={false}
                                  separator=","
                                >
                                  <GetAppIcon
                                    style={{ width: '40', height: '40' }}
                                  />
                                </CsvDownloader>
                              </IconButton>
                            </Tooltip>
                          ) : null}

                        {(this.props.user &&
                          this.props.user.role &&
                          this.props.user.role &&
                          this.props.user.role.name === 'Administrator') ||
                        (this.props.user &&
                          this.props.user.role &&
                          this.props.user.role &&
                          this.props.user.role.name === 'Management') ? (
                            <Tooltip
                              title="Delete Order"
                              placement="top"
                              className="mb-3"
                            >
                              <IconButton onClick={this.toggleDeleteModal}>
                                <Delete style={{ width: '40', height: '40' }} />
                              </IconButton>
                            </Tooltip>
                          ) : null}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            )}
            <div>
              <Collapse isOpen={this.state.filesOpen}>
                <Row>
                  <Col lg="12">
                    <Card>
                      <CardBody>
                        <h5>Files</h5>
                        <Table striped>
                          <tbody>
                            {selectedOrder
                              ? selectedOrder.files.map((i, index) => (
                                <tr>
                                  <th scope="row">{index + 1}</th>
                                  <td style={{ width: '90%' }}>{i.name}</td>
                                  <td style={{ textAlign: 'right' }}>
                                    <a
                                      href={i.url}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      <Button>
                                        View
                                      </Button>
                                    </a>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <Button
                                      onClick={() =>
                                        deleteFilesFromOrder(
                                          selectedOrder,
                                          i,
                                          cookie
                                        )
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </td>
                                </tr>
                              ))
                              : null}
                          </tbody>
                        </Table>
                        <FileUploader
                          onUploaded={this.onUploaded}
                          multi={true}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Collapse>
            </div>

            <div>
              <Collapse isOpen={this.state.trackingOpen}>
                <Row>
                  <Col lg="12">
                    <Card>
                      <CardBody>
                        <h5>Tracking History</h5>
                        <Table striped>
                          <tbody>
                            {selectedOrder && selectedOrder.tracking
                              ? selectedOrder.tracking
                                .slice(0)
                                .reverse()
                                .map((i, index) => (
                                  <tr key={index}>
                                    <th>
                                      {i.status ? i.status : 'Order Edited'}
                                    </th>
                                    <td>
                                      {moment(i.date).format(
                                        'dddd, MMMM Do YYYY, h:mm:ss a'
                                      )}
                                    </td>
                                  </tr>
                                ))
                              : null}
                          </tbody>
                        </Table>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Collapse>
            </div>

            <div>
              <Collapse isOpen={this.state.notesOpen}>
                <Row>
                  <Col lg="12">
                    <Card>
                      <CardBody>
                        <h2>Conversation Notes</h2>
                        <ConversationNotes
                          toggleBalance={this.toggleBalance}
                          selectedOrder={props.selectedOrder}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Collapse>
            </div>

            <div>
              <Collapse isOpen={this.state.balanceOpen}>
                <Row>
                  <Col lg="4">
                    <Card>
                      <CardBody>
                        <h5>Balance</h5>
                        <Balance
                          toggleBalance={this.toggleBalance}
                          selectedOrder={props.selectedOrder}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <CardBody>
                        <h5>Balance History</h5>
                        <BalanceHistory
                          edit={!this.props.edit}
                          editable={this.props.editable}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Collapse>
            </div>

            <div>
              <Collapse isOpen={this.state.miscItemsOpen}>
                <Row>
                  <Col lg="12">
                    <Card>
                      <CardBody>
                        <h5>Misc Items</h5>
                        <MiscItems
                          toggle={this.toggleMiscItems}
                          edit={!this.props.edit}
                        />
                         
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Collapse>
            </div>

            <div>
              {/* order edit here */}

              <OrderEntry
                isEdit={true}
                editOrderType={props.selectedOrder?.orderType}
                selectedOrder={props.selectedOrder}
                editable={this.props.editable}
                edit={!this.props.edit}
                toggle={props.toggle}
                toggleTracking={this.toggleTracking}
                toggleBalance={this.toggleBalance}
                toggleMiscItems={this.toggleMiscItems}
                toggleNotes={this.toggleNotes}
                toggleFiles={this.toggleFiles}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={props.toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <PrintModal
          toggle={this.togglePrinter}
          modal={this.state.printModal}
          printer_options={printer_options}
          selectedOrder={props.selectedOrder}
          downloadPDF={this.downloadPDF}
          formState
          drawerState
          miscState
          mouldingsState
          breakdowns
          box_breakdowns
        />

        <LoadingModal
          modal={this.state.loadingModal}
          toggle={this.toggleLoadingModal}
          message={
            <div>
              <center>
                <h3>Loading...</h3>
              </center>
            </div>
          }
          title={'Loading'}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  formState: getFormValues('Order')(state),
  breakdowns: state.part_list.breakdowns,
  box_breakdowns: state.part_list.box_breakdowns,
  selectedOrder: state.Orders.selectedOrder,
  printer_options: state.misc_items.printer_options,
  pricing: state.part_list.pricing,
  user: state.users.user,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateOrder,
      loadOrders,
      deleteOrder,
      setSelectedOrder,
      uploadFilesToOrder,
      deleteFilesFromOrder,
      submitOrder,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrderPage);
