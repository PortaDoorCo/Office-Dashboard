import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import 'chartjs-plugin-colorschemes';

class Chart4 extends Component {
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
      groups.push(item.status);
    });

    const quote = groups.filter((item) => {
      return item === 'Quote';
    });

    const production = groups.filter((item) => {
      return item === 'In Production';
    });

    const invoiced = groups.filter((item) => {
      return item.includes('Invoiced');
    });

    const ordered = groups.filter((item) => {
      return item.includes('Ordered');
    });

    const station1 = groups.filter((item) => {
      return item.includes('Station 1');
    });

    const station2 = groups.filter((item) => {
      return item.includes('Station 2');
    });

    const station3 = groups.filter((item) => {
      return item.includes('Station 3');
    });

    const station4 = groups.filter((item) => {
      return item.includes('Station 4');
    });

    const pie = {
      labels: [
        'Quote',
        'In Production',
        'Invoiced',
        'Ordered',
        'Station 1 - Building',
        'Station 2 - Lipping',
        'Station 3 - Inspection',
        'Station 4 - Paint Shop',
      ],
      datasets: [
        {
          data: [
            quote.length,
            production.length,
            invoiced.length,
            ordered.length,
            station1.length,
            station2.length,
            station3.length,
            station4.length,
          ],
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
            <CardTitle className="mb-0">Status</CardTitle>
            <div className="chart-wrapper">
              <Pie data={pie} options={options} />
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Chart4);
