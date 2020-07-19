import React, { Component } from 'react';
import _ from 'lodash';
import { Line, Chart } from 'react-chartjs-2';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  ButtonToolbar,
  ButtonGroup,
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { selectDateRange } from '../../../../redux/orders/actions'



const brandInfo = '#63c2de';


// Main Chart

// convert Hex to RGBA
function convertHex(hex, opacity) {
  hex = hex.replace('#', '');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
  return result;
}

class Chart1 extends Component {
  constructor(props) {
    super(props);

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      radioSelected: 'day',
      data: []
    };
  }

  componentDidMount() {
    Chart.pluginService.register({
      beforeDraw: function (chart) {
        if (chart.chart.config.data.labels.length === 0) {
          var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;

          ctx.restore();
          ctx.font = "16px normal 'Helvetica Nueue'";
          ctx.textBaseline = 'middle';

          var text = 'There is no data to display',
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2 - 20;

          ctx.fillText(text, textX, textY);
          ctx.save();

        }
      }
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected
    });
  }

  render() {
    const { selectDateRange, selectedDateRange } = this.props;


    //REMEMBER TO CHANGE DATE TO CREATED AT

    let groups = [...this.props.orders]
      .filter(record =>
        selectedDateRange === 'day'
          ? moment(record.createdAt).isSame(new Date(), 'day')
          : selectedDateRange === 'month'
            ? moment(record.createdAt).isSame(new Date(), 'month')
            : selectedDateRange === 'year'
              ? moment(record.createdAt).isSame(new Date(), 'year')
              : true
      )
      .sort((a, b) => moment(a.date || a.createdAt).isBefore(b.date || b.createdAt) ? -1 : 1);
    switch (selectedDateRange) {
      case 'month':
        groups = _.groupBy(groups, item => moment(item.createdAt).format('MMMM DD'));
        break;
      case 'year':
        groups = _.groupBy(groups, item => moment(item.createdAt).format('MMM'));
        break;
      default:
        groups = _.groupBy(groups, item =>
          moment(item.createdAt).format('h:mm:ss a')
        );
        break;
    }
    Object.keys(groups).forEach(
      key => (groups[key] = groups[key].map(item => item.total))
    );

    let prices = [];
    let dates = [];



    function avg(list) {
      return list.reduce((sum, value) => sum + value) / list.length;
    }
    Object.keys(groups)
      ///.sort((a, b) => moment(b).isBefore(a))
      .forEach(key => {
        prices.push(avg(groups[key]));
        dates.push(key);
      });



    const mainChart = {
      labels: dates,
      datasets: [
        {
          label: 'Average Sales',
          backgroundColor: convertHex(brandInfo, 10),
          borderColor: brandInfo,
          pointHoverBackgroundColor: '#fff',
          pointRadius: 2,
          borderWidth: 2,
          data: prices,
          lineTension: 0,
          fill: true
        }
      ]
    };

    const mainChartOpts = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              drawOnChartArea: false
            },
            time: {
              unit: 'day'
            }
          }
        ]
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      },

    };

    return (
      <div>
        <Card>
          <CardBody>
            <Row>
              <Col sm="5">
                <CardTitle className="mb-0">Sales</CardTitle>
                <div className="small text-muted">{moment().format('YYYY')}</div>
              </Col>
              <Col sm="7" className="d-none d-sm-inline-block">
                {/* <Button color="primary" className="float-right">
                  <i className="icon-cloud-download" />
                </Button> */}
                <ButtonToolbar
                  className="float-right"
                  aria-label="Toolbar with button groups"
                >
                  <ButtonGroup className="mr-3" aria-label="First group">
                    <Button
                      color="outline-secondary"
                      onClick={() => selectDateRange('day')}
                      active={selectedDateRange === 'day'}
                    >
                      Day
                    </Button>
                    <Button
                      color="outline-secondary"
                      onClick={() => selectDateRange('month')}
                      active={selectedDateRange === 'month'}
                    >
                      Month
                    </Button>
                    <Button
                      color="outline-secondary"
                      onClick={() => selectDateRange('year')}
                      active={selectedDateRange === 'year'}
                    >
                      Year
                    </Button>
                  </ButtonGroup>
                </ButtonToolbar>
              </Col>
            </Row>
            <div
              className="chart-wrapper"
              style={{ height: 300 + 'px', marginTop: 40 + 'px' }}
            >
              <Line data={mainChart} options={mainChartOpts} height={300} />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  customerDB: state.customers.customerDB,
  selectedDateRange: state.Orders.selectedDateRange
});

const mapDispatchToProps = dispatch => bindActionCreators({
  selectDateRange
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chart1);
