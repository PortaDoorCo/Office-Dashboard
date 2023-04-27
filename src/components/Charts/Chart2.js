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
    const filteredOrders =
      orders.length > 0
        ? orders.filter((order) => {
            switch (selectedDateRange) {
              case 'month':
                return moment(order.created_at).isSame(new Date(), 'month');
              case 'year':
                return moment(order.created_at).isSame(new Date(), 'year');
              default:
                return moment(order.created_at).isSame(new Date(), 'day');
            }
          })
        : [];

    const groups = [];
    filteredOrders.forEach((item) => {
      item.part_list.forEach((part) => {
        if (item && item.orderType === 'Door Order') {
          let total = 0;
          switch (part && part.construction && part.construction.value) {
            case 'Cope':
              part.dimensions?.map((i) => {
                return (total = total += parseInt(i.qty));
              });

              for (let i = 0; i < total; i++) {
                groups.push({ NAME: 'Cope' });
              }

              break;
            case 'MT':
              part.dimensions?.map((i) => {
                return (total = total += parseInt(i.qty));
              });

              for (let i = 0; i < total; i++) {
                groups.push({ NAME: 'MT' });
              }
              break;
            case 'Miter':
              part.dimensions?.map((i) => {
                return (total = total += parseInt(i.qty));
              });

              for (let i = 0; i < total; i++) {
                groups.push({ NAME: 'Miter' });
              }
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

    return (
      <div>
        <Card>
          <CardBody>
            <CardTitle className="mb-0">Door Designs</CardTitle>
            <div className="chart-wrapper">
              <Pie data={pie} options={options} />
            </div>
            <ul>
              {groupbyName.map((i) => {
                return (
                  <li>
                    {i.key}: {i.value?.length}
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  orders: state.Orders.orders,
  selectedDateRange: state.misc_items.selectedDateRange,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Chart2);
