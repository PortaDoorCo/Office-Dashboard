import React from 'react';
import { Card, CardBody, Table, Button } from 'reactstrap';
import moment from 'moment';
import DataTable from 'react-data-table-component';

const columns = [
  {
    name: '',
    selector: (row) => (
      <div>
        {row.status ? row.status : 'Order Edited'}{' '}
        {row.user ? 'by: ' + row.user : ''}
      </div>
    ),
  },
  {
    name: '',
    selector: (row) => (
      <div>{moment(row.date).format('dddd, MMMM Do YYYY, h:mm:ss a')}</div>
    ),
  },
];

const ExpandedComponent = ({ data, selectedOrder }) => {
  console.log({ data });

  let item = 0;

  return (
    <div>
      <Card>
        <CardBody>
          <h3>Updated Fields</h3>
          {data?.changes?.job_info ? (
            <div>
              <strong>Job Info:</strong>
              <p>
                {Object.keys(data?.changes?.job_info).map((i) => (
                  <li>{i.toUpperCase()}</li>
                ))}
              </p>
            </div>
          ) : null}

          {data?.changes?.part_list ? (
            <div>
              {data?.changes?.part_list.map((i, index) => {
                if (i) {
                  return Object.keys(i).map((k) => {
                    console.log({ k: i[k] });

                    if (i[k].length) {
                      return (
                        <div>
                          <strong>Dimensions</strong>
                          {i[k]?.length
                            ? i[k]?.map((j, p) => {
                                item += 1;
                                if (j) {
                                  console.log({ j });
                                  return Object.keys(j).map((k) => {
                                    return (
                                      <li>
                                        <strong>Line {item}:</strong>{' '}
                                        {k.toUpperCase()}
                                      </li>
                                    );
                                  });
                                }
                              })
                            : null}
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <strong>Parts</strong>
                          <li>
                            <strong>Item {index + 1}:</strong> {k.toUpperCase()}
                          </li>
                        </div>
                      );
                    }
                  });
                } else {
                  return selectedOrder?.part_list[index]?.dimensions?.map(
                    (j) => {
                      item += 1;
                      return null;
                    }
                  );
                }
              })}
            </div>
          ) : null}

          {data?.changes?.discount ? (
            <div>
              <strong>Discount</strong>
            </div>
          ) : null}

          {data?.changes?.misc_items ? (
            <div>
              <strong>Misc Items</strong>
              {data?.changes?.misc_items?.map((i, index) => {
                if (i) {
                  return (
                    <li>
                      <strong>Item {index + 1}</strong>
                    </li>
                  );
                }
              })}
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
};

const Tracking = (props) => {
  const { selectedOrder } = props;

  const data = selectedOrder?.tracking?.slice(0).reverse();

  console.log({ data });

  return (
    <Card>
      <CardBody>
        <DataTable
          title="Tracking History"
          columns={columns}
          data={data}
          expandableRows
          expandableRowsComponent={
            <ExpandedComponent selectedOrder={selectedOrder} />
          }
        />
      </CardBody>
    </Card>
  );
};

export default Tracking;
