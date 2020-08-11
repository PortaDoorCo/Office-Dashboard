import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';


class Charts extends Component {
  render() {

    let quotes = this.props.data.filter(item => {
      return item.status.includes('Quote');
    });
    let inProduction = this.props.data.filter(item => {
      return item.status.includes('In Production');
    });
    let station1 = this.props.data.filter(item => {
      return item.status.includes('Invoiced');
    });
    let station2 = this.props.data.filter(item => {
      return item.status.includes('Ordered');
    });
    let station3 = this.props.data.filter(item => {
      return item.status.includes('Station 1');
    });
    let station4 = this.props.data.filter(item => {
      return item.status.includes('Station 2');
    });
    let shipped = this.props.data.filter(item => {
      return item.status.includes('shipped');
    });

    const bar = {
      labels: ['Quotes', 'In Production', 'Invoiced', 'Ordered', 'Station 1', 'Station 2', 'Shipped'],
      datasets: [
        {
          label: 'Stations',
          backgroundColor: 'rgba(43, 160, 125, 0.24)',
          borderColor: '#000000',
          borderWidth: 0.5,
          hoverBackgroundColor: 'rgba(194, 234, 234, 0.45)',
          hoverBorderColor: '#000000',
          data: [quotes.length, inProduction.length, station1.length, station2.length, station3.length, station4.length, shipped.length],
        },
      ],
    };


    const options = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips
      },
      maintainAspectRatio: true
    };

    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody>
            <div className="chart-wrapper">
              <Bar data={bar} options={options} height={75} />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Charts;
