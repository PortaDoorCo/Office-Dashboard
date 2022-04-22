import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import _ from 'lodash';

class Charts extends Component {
  render() {
    const { orders } = this.props;
    const groups = [];
    orders.forEach((item) => {
      if (item.companyprofile.id !== 1) {
        groups.push(item.companyprofile);
      }
    });
    let groupbyName = _.groupBy(groups, 'Company');

    groupbyName = Object.entries(groupbyName)
      .map(([k, v]) => ({ key: k, value: v }))
      .sort((a, b) => b.value.length - a.value.length);

    const bar = {
      labels: groupbyName.map((i) => i.key),
      datasets: [
        {
          label: '# of Companies Orders',
          backgroundColor: 'rgba(43, 160, 125, 0.24)',
          borderColor: '#000000',
          borderWidth: 0.5,
          hoverBackgroundColor: 'rgba(194, 234, 234, 0.45)',
          hoverBorderColor: '#000000',
          data: groupbyName.map((v) => v.value.length),
        },
      ],
    };

    const options = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips,
      },
      maintainAspectRatio: true,
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
