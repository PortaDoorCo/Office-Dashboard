import React, { useState, useEffect } from 'react';
import Maps from '../../../components/Maps/Maps';
import Scheduler from './Scheduler';
import moment from 'moment';
import Board, { moveCard } from '@asseinfo/react-kanban';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const Deliveries = (props) => {
  // You need to control the state yourself.
  const { orders } = props;
  const [startDate, setStartDate] = useState(moment(new Date()));
  const [endDate, setEndDate] = useState(moment(new Date()));
  const [startDateFocusedInput, setStartDateFocusedInput] = useState(null);
  const [endDateFocusedInput, setEndDateFocusedInput] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Connecticut');
  const [data, setData] = useState(orders);
  const [controlledBoard, setBoard] = useState({
    columns: [
      {
        id: 1,
        title: 'Ready to Ship',
        cards: [],
      },
      {
        id: 2,
        title: `${moment().format('M/D/YYYY')} - Deliveries`,
        cards: [
          {
            id: 9,
            title: 'Card title 9',
            description: 'Card content',
          },
        ],
      },
    ],
  });

  useEffect(() => {
    const filteredOrders = orders?.filter((item) => {
      console.log({ item });
      let date = new Date(item.created_at);
      const dateCompleted = item?.tracking?.filter((x) => {
        return x.status === 'Complete';
      });

      return (
        moment(
          item.DateCompleted ||
            (dateCompleted.length > 0 ? dateCompleted[0]?.date : '1/1/1900')
        ) >= moment(startDate).startOf('day').valueOf() &&
        moment(
          item.DateCompleted ||
            (dateCompleted.length > 0 ? dateCompleted[0]?.date : '1/1/1900')
        ) <= moment(endDate).endOf('day').valueOf()
      );
    });

    console.log({ filteredOrders });
    setData(filteredOrders);
    setBoard({
      ...controlledBoard,
      columns: controlledBoard?.columns?.map((i, index) => {
        if (index === 0) {
          return {
            ...i,
            cards: filteredOrders.map((j) => {
              return {
                id: j.id,
                title: j.orderNum,
                description: 'description',
              };
            }),
          };
        } else {
          return i;
        }
      }),
    });
  }, [startDate, endDate, orders]);

  console.log({ controlledBoard });
  console.log({ data });
  console.log({ orders });

  let clickHoldTimer = null;

  const handleMouseDown = () => {
    console.log('press');
    clickHoldTimer = setTimeout(() => {
      //Action to be performed after holding down mouse
    }, 1000); //Change 1000 to number of milliseconds required for mouse hold
  };

  const handleMouseUp = () => {
    console.log('stop');
    clearTimeout(clickHoldTimer);
  };

  const handleCardMove = (_card, source, destination) => {
    const updatedBoard = moveCard(controlledBoard, source, destination);
    setBoard(updatedBoard);
  };

  return (
    <div>
      <Maps />
      <Scheduler
        handleCardMove={handleCardMove}
        handleMouseUp={handleMouseUp}
        handleMouseDown={handleMouseDown}
        controlledBoard={controlledBoard}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        startDateFocusedInput={startDateFocusedInput}
        endDateFocusedInput={endDateFocusedInput}
        setStartDateFocusedInput={setStartDateFocusedInput}
        setEndDateFocusedInput={setEndDateFocusedInput}
        setFilterStatus={setFilterStatus}
        startDate={startDate}
        endDate={endDate}
        orders={orders}
        setBoard={setBoard}
      />
      {/* <Table /> */}
    </div>
  );
};

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  orderNum: state.Orders.orderNum,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  breakdowns: state.part_list.breakdowns,
  box_breakdowns: state.part_list.box_breakdowns,
  role: state.users.user.role,
  user: state.users.user,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Deliveries);
