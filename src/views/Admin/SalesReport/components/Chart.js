import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';





class Charts extends Component {
  render() {

    let house = this.props.data.filter(item => {
      return item.sale && item.sale.fullName && item.sale.fullName.includes('House');
    });
    let harold = this.props.data.filter(item => {
      return item.sale && item.sale.fullName && item.sale.fullName.includes('Harold');
    });
    let ned = this.props.data.filter(item => {
      return item.sale && item.sale.fullName && item.sale.fullName.includes('Ned');
    });
    let peter = this.props.data.filter(item => {
      return item.sale && item.sale.fullName && item.sale.fullName.includes('Peter');
    });
    let meg = this.props.data.filter(item => {
      return item.sale && item.sale.fullName && item.sale.fullName.includes('Meg');
    });


    const bar = {
      labels: ['House', 'Harold', 'Ned', 'Peter', 'Meg'],
      datasets: [
        {
          label: '# of Orders',
          backgroundColor: 'rgba(43, 160, 125, 0.24)',
          borderColor: '#000000',
          borderWidth: 0.5,
          hoverBackgroundColor: 'rgba(194, 234, 234, 0.45)',
          hoverBorderColor: '#000000',
          data: [house.length, harold.length, ned.length, peter.length, meg.length],
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
