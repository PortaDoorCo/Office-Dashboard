import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import 'chartjs-plugin-colorschemes';



class Chart3 extends Component {

  render() {
    const { orders, selectedDateRange } = this.props;

    const filteredOrders = orders.filter(order => {
      switch (selectedDateRange) {
        case 'month':
          return moment(order.created_at).isSame(new Date(), 'month');
        case 'year':
          return moment(order.created_at).isSame(new Date(), 'year');
        default:
          return moment(order.created_at).isSame(new Date(), 'day');
      }
    });

    const groups = [];
    filteredOrders.forEach(item => {
      groups.push(item.orderType);
    });

    const Orders = groups.filter(item => {
      return item === 'Door Order';
    });

    const drawerOrders = groups.filter(item => {
      return item === 'Drawer Order';
    });

    const miscOrders = groups.filter(item => {
      return item === 'Misc Items';
    });


    // groupbyName = Object.entries(groupbyName).map(([k, v]) => ({key: k, value: v})).sort((a,b) => b.value.length - a.value.length)

    const pie = {
      labels: ['Door Orders', 'Drawer Orders', 'Misc Items'],
      datasets: [
        {
          data: [Orders.length, drawerOrders.length, miscOrders.length]
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
            <CardTitle className="mb-0">Order Types</CardTitle>
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
)(Chart3);
