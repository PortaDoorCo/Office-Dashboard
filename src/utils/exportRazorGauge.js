import numQty from "numeric-quantity";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import Stiles from "../views/PrintOuts/Breakdowns/Doors/Stiles/Stiles";
import Rails from "../views/PrintOuts/Breakdowns/Doors/Rails/Rails";

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const exportThis = async (data, breakdowns) => {
  for (const d of data) {
    await sleep(100);

    let exportCsv = [];
    let a = [];
    let razorGauge = [];

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

      const razor = itemNumCounter
        ? itemNumCounter.part_list?.map(async (f, index) => {
            if (f.construction?.value !== "Slab") {
              f.dimensions.forEach((j, ind) => {
                const stile = (Stiles(j, f, breakdowns) || []).map((rail) => {
                  return rail;
                });

                const rail = (Rails(j, f, breakdowns) || []).map((rail) => {
                  return rail;
                });

                const stilePrint = stile.map((i) => {
                  return razorGauge.push([
                    `${d.orderNum}`,
                    `${f.woodtype?.NAME} ${f.thickness?.thickness_1}`,
                    Math.round(numQty(i.width) * 16) / 16,
                    Math.round(numQty(i.height) * 16) / 16,
                    i.qty_2,
                    i.razor_pattern,
                    `${f.design?.NAME} ${f.thickness?.thickness_1}`,
                    i.item,
                    f.profile?.NAME
                      ? f.profile?.NAME
                      : f.design?.NAME
                      ? f.design?.NAME
                      : "",
                  ]);
                });

                const railPrint = rail.map((i) => {
                  return razorGauge.push([
                    `${d.orderNum}`,
                    `${f.woodtype?.NAME} ${f.thickness?.thickness_1}`,
                    Math.round(numQty(i.width) * 16) / 16,
                    Math.round(numQty(i.height) * 16) / 16,
                    i.qty_2,
                    i.razor_pattern,
                    `${f.design?.NAME} ${f.thickness?.thickness_1}`,
                    i.item,
                    f.profile?.NAME
                      ? f.profile?.NAME
                      : f.design?.NAME
                      ? f.design?.NAME
                      : "",
                  ]);
                });
              });
            }
          })
        : [];

      if (d.orderType === "Door Order") {
        const token =
          "D-8j9sffu8sAAAAAAAAAAemdC1XQBd05yzxnMcrWQS035ekpJ2hxb2T-SRun9TD9";

        let csvContent = razorGauge.map((e) => e.join(",")).join("\r\n");

        let myParams = {
          path: `/Razorgauge/${d.orderNum}.csv`,
          mode: "add",
          autorename: true,
          mute: false,
          strict_conflict: false,
        };

        try {
          await axios.post(
            "https://content.dropboxapi.com/2/files/upload",
            csvContent,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/octet-stream",
                "Dropbox-API-Arg": JSON.stringify(myParams),
              },
            }
          );

          NotificationManager.success(
            `#${d.orderNum} Razor Gauge Successfully Exported!`,
            "Success",
            2000
          );
        } catch (err) {
          console.log("errrrrr==>>", err);
          console.log({ orderNum: d.orderNum });
          NotificationManager.error(
            "There was an problem with your upload",
            "Error",
            2000
          );
        }
      }
    }
  }
};

export default exportThis;
