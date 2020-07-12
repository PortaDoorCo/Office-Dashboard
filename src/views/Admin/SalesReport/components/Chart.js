import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';





class Charts extends Component {
  render() {

    let house = this.props.data.filter(item => {
      return []
      return item.sale.fullName.includes("House")
    })
    let harold = this.props.data.filter(item => {
      return item.sale.fullName.includes("Harold")
    })
    let ned = this.props.data.filter(item => {
      return item.sale.fullName.includes("Ned")
    })
    let joseph = this.props.data.filter(item => {
      return item.sale.fullName.includes("Joseph")
    })
    let peter = this.props.data.filter(item => {
      return item.sale.fullName.includes("Peter")
    })
    let meg = this.props.data.filter(item => {
      return item.sale.fullName.includes("Meg")
    })
    let krista = this.props.data.filter(item => {
      return item.sale.fullName.includes("Krista")
    })

    const bar = {
      labels: ['House', 'Harold', 'Ned', 'Joseph', 'Peter', 'Meg', 'Krista'],
      datasets: [
        {
          label: 'Sales Reps',
          backgroundColor: 'rgba(43, 160, 125, 0.24)',
          borderColor: '#000000',
          borderWidth: 0.5,
          hoverBackgroundColor: 'rgba(194, 234, 234, 0.45)',
          hoverBorderColor: '#000000',
          data: [house.length, harold.length, ned.length, joseph.length, peter.length, meg.length, krista.length],
        },
      ],
    };


    const options = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips
      },
      maintainAspectRatio: true
    }

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
