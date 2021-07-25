import React, { Component } from 'react';
import _ from 'lodash';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js';
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
import { selectDateRange } from '../../../../redux/misc_items/actions';

type PropTypes ={
  selectedDateRange: {},
  selectDateRange: (date: string) => void,
  orders: Array<any>
}

const brandInfo = '#63c2de';

function convertHex(hex: string, opacity: number) {
  hex = hex.replace('#', '');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
  return result;
}

class Chart1 extends Component<PropTypes> {
  constructor(props: any) {
    super(props);

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      radioSelected: 'day',
      data: []
    };
  }

  componentDidMount() {
    Chart.pluginService.register({
      beforeDraw: function (chart: any) {
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

  onRadioBtnClick(radioSelected: number) {
    this.setState({
      radioSelected: radioSelected
    });
  }

  render() {
    const { selectDateRange, selectedDateRange } = this.props;
    let groups = this.props.orders.length > 0 ? [...this.props.orders]
      .filter(record =>
        selectedDateRange === 'day'
          ? moment(record.created_at).isSame(new Date(), 'day')
          : selectedDateRange === 'month'
            ? moment(record.created_at).isSame(new Date(), 'month')
            : selectedDateRange === 'year'
              ? moment(record.created_at).isSame(new Date(), 'year')
              : true
      )
      .sort((a, b) => moment(a.date || a.created_at).isBefore(b.date || b.created_at) ? -1 : 1) : [];
    switch (selectedDateRange) {
      case 'month':
        groups = _.groupBy(groups, item => moment(item.created_at).format('MMMM DD'));
        break;
      case 'year':
        groups = _.groupBy(groups, item => moment(item.created_at).format('MMM'));
        break;
      default:
        groups = _.groupBy(groups, item =>
          moment(item.created_at).format('h:mm:ss a')
        );
        break;
    } 

    Object.keys(groups).forEach(
      key => (groups[key] = groups[key].map(item => item.total))
    );

    let prices: Array<any> = [];
    let dates: Array<any> = [];



    function avg(list: Array<any>) {
      return list.reduce((sum, value) => sum + value) / list.length;
    }
    Object.keys(groups)
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

const mapStateToProps = (state: any) => ({
  orders: state.Orders.orders,
  customerDB: state.customers.customerDB,
  selectedDateRange: state.misc_items.selectedDateRange
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
  selectDateRange
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chart1);
