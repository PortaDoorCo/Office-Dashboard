import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  FormGroup
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DoorInfo from './components/DoorInfo';
import JobInfo from '../../Orders/OrderInfo/JobInfo';
import 'react-notifications/lib/notifications.css';
import {
  reduxForm,
  FormSection,
  getFormValues,
  change,
  FieldArray,
} from 'redux-form';
import {
  addToCart,
  loadCustomers,
  shippingAddress,
  submitOrder,
  loadOrders,
} from '../../../../redux/orders/actions';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
  taxSelector,
  totalSelector,
  addPriceSelector
} from '../../../../selectors/doorPricing';
import {
  // getWoodtypes,
  // getDesigns,
  // getEdges,
  // getFinish,
  // getMoulds,
  // getPanels,
  // getHinges
} from '../../../../redux/part_list/actions';
import PropTypes from 'prop-types';
import 'react-notifications/lib/notifications.css';
import SideBar from './components/SideBar';
import Ratio from 'lb-ratio'
import Sticky from 'react-stickynode';
import moment from 'moment-business-days'
import Cookies from "js-cookie";
import { FileUploader } from 'devextreme-react';

const cookie = Cookies.get("jwt");
const header = { 'Authorization': 'Bearer ' + cookie };

const dueDate = moment(new Date()).businessAdd(7)._d

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

class DoorOrders extends Component {
  constructor(props) {
    super(props);
    this.makerJS = React.createRef();
    this.state = {
      collapse: true,
      loaded: false,
      customerAddress: [],
      updateSubmit: false,
      files: []
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  reloadPage = () => {
    window.location.reload();
  };

  submit = async (values, e) => {
    const {
      reset,
      prices,
      itemPrice,
      subTotal,
      tax,
      total,
      submitOrder,
      orderNum,
      user,
      orders
    } = this.props;

    const orderType = 'Door Order';

    console.log(values.job_info.DueDate)

    const jobInfo = {
      jobName: values.job_info.jobName,
      status: values.job_info.status,
      poNum: values.job_info.poNum,
      Address1: values.job_info.Address1,
      Address2: values.job_info.Address2,
      City: values.job_info.City,
      State: values.job_info.State,
      Zip: values.job_info.Zip,
      Phone: values.job_info.Phone,
      DueDate: values.job_info.DueDate,
      customer: {
        Company: values.job_info.customer.Company
      }
    }

    const order = {
      part_list: values.part_list,
      status: values.job_info.status,
      jobInfo: jobInfo,
      companyprofile: values.job_info.customer.id,
      linePrice: prices,
      itemPrice: itemPrice,
      subTotals: subTotal,
      tax: tax,
      total: total,
      orderType: orderType,
      dueDate: values.job_info.DueDate,
      user: user.id,
      userName: user.username,
      files: this.state.files,
      tracking: [
        {
          "status": values.job_info.status,
          "date": new Date()
        }
      ]
    };

    if (values.part_list[0].dimensions.length > 0) {
      await submitOrder(order, cookie);
      this.setState({ updateSubmit: !this.state.updateSubmit })
      reset();
      window.scrollTo(0, 0);
    } else {
      return
    }
  };

  // componentDidUpdate(prevProps) {
  //   if (this.props.formState !== prevProps.formState) {
  //     if (this.props.formState) {
  //       const update = async () => {
  //         const form = await this.props.formState;
  //         const customer = await form.job_info.customer;
  //         const part_list = await form.part_list;

  //         this.props.dispatch(
  //           change(
  //             'DoorOrder',
  //             'job_info.Address1',
  //             customer.Shipping_Address1 || customer.Address1
  //           )
  //         );
  //         this.props.dispatch(
  //           change(
  //             'DoorOrder',
  //             'job_info.Address2',
  //             customer.Shipping_Address2 || customer.Address2
  //           )
  //         );
  //         this.props.dispatch(
  //           change(
  //             'DoorOrder',
  //             'job_info.City',
  //             customer.Shipping_City || customer.City
  //           )
  //         );
  //         this.props.dispatch(
  //           change(
  //             'DoorOrder',
  //             'job_info.State',
  //             customer.Shipping_State || customer.State
  //           )
  //         );
  //         this.props.dispatch(
  //           change(
  //             'DoorOrder',
  //             'job_info.Zip',
  //             customer.Shipping_Zip || customer.Zip
  //           )
  //         );
  //         this.props.dispatch(
  //           change(
  //             'DoorOrder',
  //             'job_info.Phone',
  //             customer.Shipping_Phone || customer.Phone1
  //           )
  //         );

  //         part_list.forEach((part, i) => {
  //           if (part.dimensions) {
  //             return part.dimensions.forEach((info, index) => {

  //               if (parseInt(part_list[i].dimensions[index].panelsH) < 2 || parseInt(part_list[i].dimensions[index].panelsW) !== 1) {
  //                 this.props.dispatch(
  //                   change(
  //                     'DoorOrder',
  //                     `part_list[${i}].dimensions[${index}].unevenCheck`,
  //                     false
  //                   )
  //                 )
  //               }

  //               if (parseInt(part_list[i].dimensions[index].panelsH) < 2 || parseInt(part_list[i].dimensions[index].panelsW) !== 1) {
  //                 this.props.dispatch(
  //                   change(
  //                     'DoorOrder',
  //                     `part_list[${i}].dimensions[${index}].unevenSplit`,
  //                     false
  //                   )
  //                 )
  //               }

  //               if (parseInt(part_list[i].dimensions[index].panelsH) < 2 || parseInt(part_list[i].dimensions[index].panelsW) !== 1) {
  //                 this.props.dispatch(
  //                   change(
  //                     'DoorOrder',
  //                     `part_list[${i}].dimensions[${index}].unevenSplitInput`,
  //                     '0'
  //                   )
  //                 )
  //               }

  //               this.props.dispatch(
  //                 change(
  //                   'DoorOrder',
  //                   `part_list[${i}].dimensions[${index}].item`,
  //                   index + 1
  //                 )
  //               )
  //               if (info.panelsW > 1) {
  //                 if (
  //                   info.panelsW !==
  //                   prevProps.formState.part_list[i].dimensions[index].panelsW
  //                 ) {
  //                   return this.props.dispatch(
  //                     change(
  //                       'DoorOrder',
  //                       `part_list[${i}].dimensions[${index}].verticalMidRailSize`,
  //                       fraction(part.design.V_MULL_WTH)
  //                     )
  //                   );
  //                 }
  //               }

  //               if (info.panelsH > 1) {
  //                 if (
  //                   info.panelsH !==
  //                   prevProps.formState.part_list[i].dimensions[index].panelsH
  //                 ) {
  //                   return this.props.dispatch(
  //                     change(
  //                       'DoorOrder',
  //                       `part_list[${i}].dimensions[${index}].horizontalMidRailSize`,
  //                       fraction(part.design.H_MULL_WTH)
  //                     ),
  //                   );
  //                 }
  //               }



  //             });
  //           } else {
  //             return null;
  //           }
  //         });

  //         if (part_list) {
  //           part_list.forEach((part, i) => {
  //             if ((part && part.design) !== (prevProps.formState && prevProps.formState.part_list[i] && prevProps.formState.part_list[i].design)) {
  //               if (part.dimensions) {
  //                 part.dimensions.forEach((info, index) => {
  //                   this.props.dispatch(
  //                     change(
  //                       'DoorOrder',
  //                       `part_list[${i}].dimensions[${index}].leftStile`,
  //                       fraction(part.design ? part.design.L_STILE_W : 0)
  //                     )
  //                   );

  //                   this.props.dispatch(
  //                     change(
  //                       'DoorOrder',
  //                       `part_list[${i}].dimensions[${index}].rightStile`,
  //                       fraction(part.design ? part.design.R_STILE_W : 0)
  //                     )
  //                   );

  //                   if(part.design && part.design.arch){
  //                     this.props.dispatch(
  //                       change(
  //                         'DoorOrder',
  //                         `part_list[${i}].dimensions[${index}].topRail`,
  //                         fraction(part.design ? part.design.arch.RAIL_WIDTH : 0)
  //                       )
  //                     );
  //                   } else {
  //                     this.props.dispatch(
  //                       change(
  //                         'DoorOrder',
  //                         `part_list[${i}].dimensions[${index}].topRail`,
  //                         fraction(part.design ? part.design.R_STILE_W : 0)
  //                       )
  //                     );
  //                   }

  //                   this.props.dispatch(
  //                     change(
  //                       'DoorOrder',
  //                       `part_list[${i}].dimensions[${index}].bottomRail`,
  //                       fraction(part.design ? part.design.BOT_RAIL_W : 0)
  //                     )
  //                   );



  //                   if (parseInt(info.panelsH) > 1) {
  //                     this.props.dispatch(
  //                       change(
  //                         'DoorOrder',
  //                         `part_list[${i}].dimensions[${index}].horizontalMidRailSize`,
  //                         fraction(part.design ? part.design.H_MULL_WTH : 0)
  //                       )
  //                     );
  //                   }

  //                   if (parseInt(info.panelsW) > 1) {
  //                     this.props.dispatch(
  //                       change(
  //                         'DoorOrder',
  //                         `part_list[${i}].dimensions[${index}].verticalMidRailSize`,
  //                         fraction(part.design ? part.design.V_MULL_WTH : 0)
  //                       )
  //                     );
  //                   }
  //                 });
  //               } else {
  //                 return
  //               }
  //             } else {
  //               return
  //             }
  //           });
  //         } else {
  //           return
  //         }

  //       };
  //       update();
  //     }
  //   }
  // }

  cancelOrder = e => {
    e.preventDefault();
    this.props.reset();
  };

  onKeyPress(event) {
    if (event.which === 13 /* Enter */) {
      event.preventDefault();
    }
  }

  onUploaded = (e) => {
    const data = JSON.parse(e.request.response);
    const id = data[0].id;
    const a = [...this.state.files, id]
    this.setState({ files: a })
  }

  render() {
    console.log('files   ', this.state.files)

    const {
      submitted,
      handleSubmit,
      prices,
      subTotal,
      woodtypes,
      designs,
      edges,
      moulds,
      panels,
      arches,
      finish,
      doorOptions,
      doorExtras,
      customers,
      formState,
      isValid,
      address,
      hinges,
      total,
      dispatch,
      tax
    } = this.props;

    return (
      <div className="animated fadeIn resize">
        <Row>
          <Col xs="12" sm="12" md="12" lg="7">
            <Card>
              <CardHeader>
                <strong>Door Order</strong>
              </CardHeader>
              <CardBody>
                <form onKeyPress={this.onKeyPress} onSubmit={handleSubmit(this.submit)}>
                  {!submitted ? (
                    <FormSection name="job_info">
                      <JobInfo
                        customers={customers}
                        change={change}
                        address={address}
                        loaded={this.state.loaded}
                        handleAddress={this.handleAddress}
                      />
                    </FormSection>
                  ) : null}



                  <FieldArray
                    name="part_list"
                    component={DoorInfo}
                    // woodtypes={woodtypes}
                    // designs={designs}
                    // edges={edges}
                    // moulds={moulds}
                    // panels={panels}
                    // finish={finish}
                    // hinges={hinges}
                    // arches={arches}
                    // doorOptions={doorOptions}
                    // doorExtras={doorExtras}
                    // prices={prices}
                    formState={formState}
                    // subTotal={subTotal}
                    dispatch={dispatch}
                    isValid={isValid}
                    updateSubmit={this.state.submit}
                  />

                  <div className="mb-3" />

                  <hr />
                  <hr />
                  <Row>
                    <Col xs="4" />
                    <Col xs="5" />
                    <Col xs="3">
                      <strong>Tax: </strong>
                      {/* <Input placeholder={'$' + tax.toFixed(2)} className="mb-2" /> */}
                      <strong>Total: </strong>
                      {/* <Input placeholder={'$' + total.toFixed(2)} className="mb-3" /> */}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="4" />
                    <Col xs="5" />
                    <Col xs="3">
                      <Row>
                        <Col>
                          <Button color="primary" className="submit" style={{ width: "100%" }}>Submit</Button>
                        </Col>
                        <Col>
                          <Button color="danger" onClick={this.cancelOrder} style={{ width: "100%" }}>
                            Cancel
                        </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </form>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <FormGroup>
                      <h3>Upload Files</h3>
                      <form id="form" ref={this.formElement} method="post" action="" encType="multipart/form-data">
                        <FileUploader name="files" uploadMode="instantly" uploadHeaders={header} multiple={true} onUploaded={this.onUploaded} uploadUrl="http://server.portadoor.com/upload" />
                      </form>
                    </FormGroup>
                  </CardBody>
                </Card>

              </Col>
            </Row>
            {(this.props.formState && this.props.formState.part_list) ? (
              this.props.formState.part_list.map((part, i) => {
                return (
                  <div>
                    <Row style={{ height: '100%' }}>
                      <Col>
                        <Sticky
                          top={100}
                          bottomBoundary={`#item-${i}`}
                          enabled={true}
                          key={i}
                        >
                          <SideBar key={i} i={i} part={part} />
                        </Sticky>
                      </Col>
                    </Row>
                    <Row>
                      <Col>

                      </Col>
                    </Row>
                  </div>
                );
              })
            ) : (
                <div />
              )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // orders: state.Orders.orders,
  // orderNum: state.Orders.orderNum,
  // woodtypes: state.part_list.woodtypes,
  // designs: state.part_list.designs,
  // edges: state.part_list.edges,
  // moulds: state.part_list.moulds,
  // panels: state.part_list.panels,
  // finish: state.part_list.finish,
  // arches: state.part_list.arches,
  // hinges: state.part_list.hinges,
  // doorOptions: state.part_list.doorOptions,
  // doorExtras: state.part_list.doorExtras,
  customers: state.Orders.customerDB,
  // address: state.Orders.address,
  customerDBLoaded: state.Orders.customerDBLoaded,

  user: state.users.user,

  submitted: state.Orders.submitted,
  initialValues: {
    open: true,
    part_list: [
      {

        construction: {
          name: 'Cope And Stick',
          value: 'Cope'
        },
        orderType: {
          name: 'Door Order',
          value: 'Door'
        },
        thickness: {
          name: '4/4',
          value: 0.75
        },
        dimensions: [],
        addPrice: 0,
      }
    ],
    job_info: {
      customer: state.Orders.customerDB[0],
      jobName: '',
      status: 'Quote',
      poNum: '',
      Address1: '',
      Address2: '',
      City: '',
      State: '',
      Zip: '',
      Phone: '',
      DueDate: dueDate
    }
  },
  formState: getFormValues('DoorOrder')(state),
  // prices: linePriceSelector(state),
  // itemPrice: itemPriceSelector(state),
  // subTotal: subTotalSelector(state),
  // total: totalSelector(state),
  // tax: taxSelector(state),
  // addPriceSelector: addPriceSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addToCart,
      loadCustomers,
      // getWoodtypes,
      // getDesigns,
      // getEdges,
      // getFinish,
      // getMoulds,
      // getPanels,
      shippingAddress,
      // getHinges,
      submitOrder,
      loadOrders,
    },
    dispatch
  );

// eslint-disable-next-line no-class-assign
DoorOrders = reduxForm({
  form: 'DoorOrder',
  enableReinitialize: true
})(DoorOrders);

DoorOrders.propTypes = {
  reset: PropTypes.string,
  prices: PropTypes.array,
  subTotal: PropTypes.array,
  total: PropTypes.number,
  submitOrder: PropTypes.func,
  orderNum: PropTypes.number,
  formState: PropTypes.object,
  dispatch: PropTypes.func,
  submitted: PropTypes.bool,
  handleSubmit: PropTypes.func,
  woodtypes: PropTypes.array,
  designs: PropTypes.array,
  edges: PropTypes.array,
  moulds: PropTypes.array,
  panels: PropTypes.array,
  finish: PropTypes.array,
  customers: PropTypes.array,
  address: PropTypes.object,
  hinges: PropTypes.array
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoorOrders);
