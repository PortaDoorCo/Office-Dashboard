import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import 'chartjs-plugin-colorschemes';

type PropTypes = {
  orders: Array<any>,
  selectedDateRange: string
}


class Chart2 extends Component<PropTypes> {

  render() {
    const { orders, selectedDateRange } = this.props;

    const filteredOrders = orders.length > 0 ? orders.filter(order => {
      switch (selectedDateRange) {
        case 'month':
          return moment(order.createdAt).isSame(new Date(), 'month');
        case 'year':
          return moment(order.createdAt).isSame(new Date(), 'year');
        default:
          return moment(order.createdAt).isSame(new Date(), 'day');
      }
    }) : [];

    const groups = [];
    filteredOrders.forEach(item => {
      item.part_list.forEach(part => {
        if (item.orderType === 'Door Order') {
          switch (part.construction.value) {
            case 'Cope':
              groups.push(part.cope_design);
              break;
            case 'MT':
              groups.push(part.mt_design);
              break;
            case 'M':
              groups.push(part.miter_design);
              break;
            default:
              return;
          }

        }

      });
    });
    let groupbyName = _.groupBy(groups, 'NAME');

    groupbyName = Object.entries(groupbyName).map(([k, v]) => ({ key: k, value: v })).sort((a:any, b:any) => b.value.length - a.value.length);

    const pie = {
      labels: groupbyName.map(i => i.key),
      datasets: [
        {
          data: groupbyName.map(v => v.value.length),
        }
      ],
    };

    const options = {
      legend: {
        display: false
      },
      plugins: {
        colorschemes: {
          scheme: 'brewer.Paired9'
        }
      }
    };

    return (
      <div>
        <Card>
          <CardBody>
            <CardTitle className="mb-0">Door Designs</CardTitle>
            <div className="chart-wrapper">
              <Pie data={pie} options={options} />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  selectedDateRange: state.misc_items.selectedDateRange
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {

    },
    dispatch
  );


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chart2);

