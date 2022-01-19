import numQty from 'numeric-quantity';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};


const edges = async (data) => {

  console.log({data_length: data.length});
  for (const d of data) {

    await sleep(100);

    console.log({d});

    let exportCsv = [];
    let a = [];
    let razorGuage = [];

    let itemNum = 0;

    if (d.Shipping_Scheduled) {
      const itemNumCounter = {
        ...d,
        part_list: d?.part_list?.map((i) => {
          return {
            ...i,
            dimensions: i?.dimensions?.map((j) => {
              itemNum += 1;
              return {
                ...j,
                construction: i.construction,
                profile: i.profile,
                design: i.design,
                edge: i.edge,
                panel: i.panel,
                orderType: i.orderType,
                VERTICAL_GRAIN: i.VERTICAL_GRAIN,
                item: itemNum,
              };
            }),
          };
        }),
      };

      if (d.orderType === 'Door Order') {
        exportCsv = itemNumCounter
          ? itemNumCounter.part_list.map(async(f, index) => {
            f.dimensions.forEach((j, ind) => {
              if (
                f.orderType.value === 'DF' ||
                  numQty(j.width) > numQty(j.height)
              ) {
                a.push([
                  d.orderNum,
                  '15DF',
                  j.qty,
                  f.woodtype && f.woodtype.NAME,
                  Math.round(numQty(j.width) * 16) / 16,
                  Math.round(numQty(j.height) * 16) / 16,
                  f.edge && f.edge.NAME,
                    f.thickness?.thickness_values
                      ? f.thickness?.thickness_values
                      : f.thickness?.thickness_1 === '4/4'
                        ? 0.75
                        : f.thickness?.thickness_1 === '5/4'
                          ? 1
                          : f.thickness?.thickness_1 === '6/4'
                            ? 1.25
                            : 0.75,
                ]);
              } else {
                a.push([
                  d.orderNum,
                  'D',
                  j.qty,
                  f.woodtype && f.woodtype.NAME,
                  Math.round(numQty(j.width) * 16) / 16,
                  Math.round(numQty(j.height) * 16) / 16,
                  f.edge && f.edge.NAME,
                    f.thickness?.thickness_values
                      ? f.thickness?.thickness_values
                      : f.thickness?.thickness_1 === '4/4'
                        ? 0.75
                        : f.thickness?.thickness_1 === '5/4'
                          ? 1
                          : f.thickness?.thickness_1 === '6/4'
                            ? 1.25
                            : 0.75,
                ]);
              }
            });
            return a;
          })
          : [];
      }

      if (d.orderType === 'Door Order') {

        const newItem = a.map((i, ind) => {
          return [...i, ind + 1, `*${i[0]}X${('00' + (ind + 1)).slice(-3)}*`];
        });

        const token =
        'D-8j9sffu8sAAAAAAAAAAemdC1XQBd05yzxnMcrWQS035ekpJ2hxb2T-SRun9TD9';

        let csvContent = newItem.map((e) => e.join(',')).join('\n');

        let myParams = {
          path: `/lips/${d.orderNum}.csv`,
          mode: 'add',
          autorename: true,
          mute: false,
          strict_conflict: false,
        };

        
        // await sleep(500);

        try {
          await axios.post(
            'https://content.dropboxapi.com/2/files/upload',
            csvContent,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/octet-stream',
                'Dropbox-API-Arg': JSON.stringify(myParams),
              },
            }
          );

          NotificationManager.success(
            `#${d.orderNum} Edges Successfully Exported!`,
            'Success',
            2000
          );
        } catch (err) {
          console.log({ err });
          console.log({orderNum: d.orderNum});
          console.log({length: csvContent.length});
          NotificationManager.error(
            'There was an problem with your upload',
            'Error',
            2000
          );
        }
      }
    }
  }
};

export default edges;
