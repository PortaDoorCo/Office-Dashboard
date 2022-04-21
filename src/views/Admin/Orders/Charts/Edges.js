import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import 'chartjs-plugin-colorschemes';

class Chart2 extends Component {
  render() {
    const { orders, selectedDateRange } = this.props;

    // const filteredOrders = orders.filter(order => {
    //   switch (selectedDateRange) {
    //     case 'month':
    //       return moment(order.created_at).isSame(new Date(), 'month');
    //     case 'year':
    //       return moment(order.created_at).isSame(new Date(), 'year');
    //     default:
    //       return moment(order.created_at).isSame(new Date(), 'day');
    //   }
    // });

    const groups = [];
    orders.forEach((item) => {
      item.part_list.forEach((part) => {
        if (item.orderType === 'Door Order') {
          switch (part.construction?.value) {
            case 'Cope':
              part.dimensions.map((j) => {
                for (let i = 0; i < parseInt(j.qty); i++) {
                  return groups.push(part.edge);
                }
              });
              break;
            case 'MT':
              part.dimensions.map((j) => {
                for (let i = 0; i < parseInt(j.qty); i++) {
                  return groups.push(part.edge);
                }
              });
              break;
            case 'M':
              part.dimensions.map((j) => {
                for (let i = 0; i < parseInt(j.qty); i++) {
                  return groups.push(part.edge);
                }
              });
              break;
            default:
              return;
          }
        }
      });
    });
    let groupbyName = _.groupBy(groups, 'NAME');

    groupbyName = Object.entries(groupbyName)
      .map(([k, v]) => ({ key: k, value: v }))
      .sort((a, b) => b.value.length - a.value.length);

    const pie = {
      labels: groupbyName.map((i) => i.key),
      datasets: [
        {
          data: groupbyName.map((v) => v.value.length),
        },
      ],
    };

    const options = {
      legend: {
        display: false,
      },
      plugins: {
        colorschemes: {
          scheme: 'brewer.Paired9',
        },
      },
    };

    console.log({ groupbyName });

    return (
      <div>
        <Card>
          <CardBody>
            <CardTitle className="mb-0">Edges</CardTitle>
            <div className="chart-wrapper">
              <Pie data={pie} options={options} />
            </div>
            <div>
              <ul>
                {groupbyName.map((i) => (
                  <li>
                    {i.key} <strong>{i.value.length}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  selectedDateRange: state.misc_items.selectedDateRange,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Chart2);
