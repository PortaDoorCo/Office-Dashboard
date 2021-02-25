downloadPDF = () => {


    


  const {
    formState,
    drawerState,
    miscState,
    mouldingsState,
    breakdowns,
    box_breakdowns,
    selectedOrder,
    user
  } = this.props;
  const data = formState
    ? formState
    : drawerState
      ? drawerState
      : miscState
        ? miscState
        : mouldingsState ?
          mouldingsState
          : [];

  const printerSettings = {
    assembly_list: user.assembly_list,
    stiles: user.stiles,
    rails: user.rails,
    panels: user.panels,
    profiles: user.profiles,
    materials: user.materials,
    qc: user.qc
  };


  console.log({printerSettings});


  if (data.orderType === 'Door Order') {
    this.state.selectedOption.map(async (option) => {
      switch (option.value) {
        case 'Breakdowns':
          const edgesPromiseArr1 = selectedOrder.part_list
            .filter((i) => i.edge && i.edge.photo && i.edge.photo.url)
            .map((i) => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.edge.photo.url, (result) => {
                  resolve(result);
                });
              });
            });

          const mouldsPromiseArr1 = selectedOrder.part_list
            .filter(
              (i) => i.profile && i.profile.photo && i.profile.photo.url
            )
            .map((i) => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.profile.photo.url, (result) => {
                  resolve(result);
                });
              });
            });

          const miterPromiseArr1 = selectedOrder.part_list
            .filter(
              (i) =>
                i.miter_design &&
                  i.miter_design.photo &&
                  i.miter_design.photo.url
            )
            .map((i) => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.miter_design.photo.url, (result) => {
                  resolve(result);
                });
              });
            });

          const MT_PromiseArr1 = selectedOrder.part_list
            .filter(
              (i) => i.mt_design && i.mt_design.photo && i.mt_design.photo.url
            )
            .map((i) => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.mt_design.photo.url, (result) => {
                  resolve(result);
                });
              });
            });

          const panelsPromiseArr1 = selectedOrder.part_list
            .filter((i) => i.panel && i.panel.photo && i.panel.photo.url)
            .map((i) => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.panel.photo.url, (result) => {
                  resolve(result);
                });
              });
            });

          const appliedProfilePromiseArr1 = selectedOrder.part_list
            .filter(
              (i) =>
                i.applied_profile &&
                  i.applied_profile.photo &&
                  i.applied_profile.photo.url
            )
            .map((i) => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.applied_profile.photo.url, (result) => {
                  resolve(result);
                });
              });
            });

          let edges1;
          let moulds1;
          let miter1;
          let mt_1;
          let panels1;
          let appliedProfiles1;

          try {
            edges1 = await Promise.all(edgesPromiseArr1);
            moulds1 = await Promise.all(mouldsPromiseArr1);
            miter1 = await Promise.all(miterPromiseArr1);
            mt_1 = await Promise.all(MT_PromiseArr1);
            panels1 = await Promise.all(panelsPromiseArr1);
            appliedProfiles1 = await Promise.all(appliedProfilePromiseArr1);
          } catch (err) {
            console.log('errrrrrr', err);
          }

          DoorPDF(
            data,
            edges1,
            moulds1,
            miter1,
            mt_1,
            panels1,
            appliedProfiles1,
            breakdowns,
            printerSettings
          );
          this.setState({ selectedOption: [] });
          break;
        case 'CustomerCopy':
          CustomerCopyDoorPDF(data, breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Assembly':
          AssemblyListPDF(data, breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Acknowledgement':
          AcknowledgementPDF(data, breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Invoice':
          InvoicePDF(data, breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Stiles':
          StilesPDF(data, breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Rails':
          RailsPDF(data, breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Panels':
          PanelsPDF(data, breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Materials':
          MaterialsPDF(data, breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Profiles':
          const edgesPromiseArr = selectedOrder.part_list
            .filter((i) => i.edge && i.edge.photo && i.edge.photo.url)
            .map((i) => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.edge.photo.url, (result) => {
                  resolve(result);
                });
              });
            });

          const mouldsPromiseArr = selectedOrder.part_list
            .filter(
              (i) => i.profile && i.profile.photo && i.profile.photo.url
            )
            .map((i) => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.profile.photo.url, (result) => {
                  resolve(result);
                });
              });
            });

          const miterPromiseArr = selectedOrder.part_list
            .filter(
              (i) =>
                i.miter_design &&
                  i.miter_design.photo &&
                  i.miter_design.photo.url
            )
            .map((i) => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.miter_design.photo.url, (result) => {
                  resolve(result);
                });
              });
            });

          const MT_PromiseArr = selectedOrder.part_list
            .filter(
              (i) => i.mt_design && i.mt_design.photo && i.mt_design.photo.url
            )
            .map((i) => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.mt_design.photo.url, (result) => {
                  resolve(result);
                });
              });
            });

          const panelsPromiseArr = selectedOrder.part_list
            .filter((i) => i.panel && i.panel.photo && i.panel.photo.url)
            .map((i) => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.panel.photo.url, (result) => {
                  resolve(result);
                });
              });
            });

          const appliedProfilePromiseArr = selectedOrder.part_list
            .filter(
              (i) =>
                i.applied_profile &&
                  i.applied_profile.photo &&
                  i.applied_profile.photo.url
            )
            .map((i) => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.applied_profile.photo.url, (result) => {
                  resolve(result);
                });
              });
            });

          let edges;
          let moulds;
          let miter;
          let mt;
          let panels;
          let appliedProfiles;

          try {
            edges = await Promise.all(edgesPromiseArr);
            moulds = await Promise.all(mouldsPromiseArr);
            miter = await Promise.all(miterPromiseArr);
            mt = await Promise.all(MT_PromiseArr);
            panels = await Promise.all(panelsPromiseArr);
            appliedProfiles = await Promise.all(appliedProfilePromiseArr);
          } catch (err) {
            console.log('errrrrrr', err);
          }

          ProfilesPDF(
            data,
            edges,
            moulds,
            miter,
            mt,
            panels,
            appliedProfiles,
            breakdowns
          );
          this.setState({ selectedOption: [] });
          break;
        case 'QC':
          QCPDF(data, breakdowns);
          this.setState({ selectedOption: [] });
          break;
        default:
          return;
      }
    });
  } else if (data.orderType === 'Drawer Order') {
    this.state.selectedOption.map(async (option) => {
      switch (option.value) {
        case 'Breakdowns':
          DrawerPDF(data, box_breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'CustomerCopy':
          CustomerCopyDrawerPDF(data, breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Acknowledgement':
          DrawerAcnowledgementPDF(data, box_breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Invoice':
          DrawerInvoicePDF(data, box_breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Assembly':
          DrawerAssemblyListPDF(data, box_breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Bottoms':
          DrawerBottomsPDF(data, box_breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Sides':
          DrawerSidesPDF(data, box_breakdowns);
          this.setState({ selectedOption: [] });
          break;
        default:
          return;
      }
    });
  } else if (data.orderType === 'Misc Items') {
    this.state.selectedOption.map(async (option) => {
      switch (option.value) {
        case 'All':
          MiscItemsPDF(data, box_breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Acknowledgement':
          MiscItemsAcknowledgement(data, box_breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Invoice':
          MiscItemsInvoice(data, box_breakdowns);
          this.setState({ selectedOption: [] });
          break;
        default:
          return;
      }
    });
  }
  else if (data.orderType === 'Mouldings') {
    this.state.selectedOption.map(async (option) => {
      switch (option.value) {
        case 'All':
          MouldingsPDF(data, box_breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Acknowledgement':
          MouldingsAcknowledgement(data, box_breakdowns);
          this.setState({ selectedOption: [] });
          break;
        case 'Invoice':
          MouldingsInvoice(data, box_breakdowns);
          this.setState({ selectedOption: [] });
          break;
        default:
          return;
      }
    });
  }
};