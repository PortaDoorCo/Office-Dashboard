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
import { selectDateRange } from '../../../../../redux/misc_items/actions';



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
      data: [],
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
          ctx.font = '16px normal \'Helvetica Nueue\'';
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
    const { orders, startDate, endDate, status } = this.props;


    //REMEMBER TO CHANGE DATE TO CREATED AT

    let groups = [...orders].filter((item) => {
      let date = new Date(item.created_at);


      return (
        moment(date) >= moment(startDate).startOf('day').valueOf() &&
            moment(date) <= moment(endDate).endOf('day').valueOf() && 
            item.sale && item.sale.fullName && item.sale.fullName.includes(status)
      );
      

    }).sort((a, b) => moment(a.date || a.created_at).isBefore(b.date || b.created_at) ? -1 : 1);

    groups = _.groupBy(groups, item =>
      moment(item.created_at).format('MMM DD h:mm a')
    );

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

  customerDB: state.customers.customerDB,
  selectedDateRange: state.misc_items.selectedDateRange
});

const mapDispatchToProps = dispatch => bindActionCreators({
  selectDateRange
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chart1);
