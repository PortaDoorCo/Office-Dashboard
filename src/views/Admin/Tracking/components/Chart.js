import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';


class Charts extends Component {
  render() {
    let inProduction = this.props.data.filter(item => {
      return item.status.includes('In Production');
    });
    let cut = this.props.data.filter(item => {
      return item.status.includes('Cut');
    });
    let framing = this.props.data.filter(item => {
      return item.status.includes('Framing');
    });
    let assembly = this.props.data.filter(item => {
      return item.status.includes('Assembly');
    });
    let tenon = this.props.data.filter(item => {
      return item.status.includes('Tenon');
    });
    let panels = this.props.data.filter(item => {
      return item.status.includes('Panels');
    });
    let sanding = this.props.data.filter(item => {
      return item.status.includes('Sanding');
    });
    let lipping = this.props.data.filter(item => {
      return item.status.includes('Lipping');
    });

    let inspecting = this.props.data.filter(item => {
      return item.status.includes('Inspecting');
    });

    let paint_shop = this.props.data.filter(item => {
      return item.status.includes('Paint Shop');
    });

    let complete = this.props.data.filter(item => {
      return item.status.includes('Complete');
    });

    let shipped = this.props.data.filter(item => {
      return item.status.includes('Shipped');
    });

    const bar = {
      labels: ['In Production', 'Cut', 'Framing', 'Assembly', 'Tenon', 'Panels', 'Sanding', 'Lipping', 'Inspecting', 'Paint Shop', 'Complete', 'Shipped'],
      datasets: [
        {
          label: 'Stations',
          backgroundColor: 'rgba(43, 160, 125, 0.24)',
          borderColor: '#000000',
          borderWidth: 0.5,
          hoverBackgroundColor: 'rgba(194, 234, 234, 0.45)',
          hoverBorderColor: '#000000',
          data: [inProduction.length, cut.length, framing.length, assembly.length, tenon.length, panels.length, sanding.length, lipping.length, inspecting.length, paint_shop.length, complete.length, shipped.length],
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
