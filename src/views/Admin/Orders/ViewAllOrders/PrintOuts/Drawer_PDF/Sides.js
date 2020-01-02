import moment from 'moment';
import Sides from '../Breakdowns/DrawerBoxes/Sides';
import Fronts from '../Breakdowns/DrawerBoxes/Fronts';
import LinearIN from '../Breakdowns/DrawerBoxes/LinearIN';
import _ from 'lodash'


export default data => {
    return [
        {
            columns: [
                {
                    stack: [
                        { text: 'Sides/Fronts/Backs List', bold: true },
                        `Shipping Date: ${moment(data.jobInfo.DueDate).format('MM/DD/YYYY')}`
                    ]
                },
                {
                    stack: [
                        { text: 'Porta Door Co. Inc.', alignment: 'center' },
                        { text: '65 Cogwheel Lane', alignment: 'center' },
                        { text: 'Seymour, CT', alignment: 'center' },
                        { text: '203-888-6191', alignment: 'center' },
                        { text: moment().format('DD-MMM-YYYY'), alignment: 'center' }
                    ]
                },
                {
                    stack: [
                        { text: `Order #: ${data.orderNum}`, alignment: 'right' },
                        { text: `Est. Ship: ${moment(data.jobInfo.DueDate).format('MM/DD/YYYY')}`, alignment: 'right' }
                    ]
                }
            ]
        },
        {
            columns: [
                {
                    text: `${data.jobInfo.jobName} - ${data.jobInfo.customer.Company}`,
                    margin: [0, 10]
                },
                { text: 'Job: None', alignment: 'right', margin: [0, 0, 80, 0] }
            ]
        },
        {
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }]
        },
        data.part_list.map((i, index) => {
            let sortedDimensions = i.dimensions.sort(function (a, b) { return a.height - b.height })
            let sortedQty = sortedDimensions.sort(function (a, b) { return a.qty - b.qty })
            const fronts = [
                [
                    { text: 'Item', style: 'fonts' },
                    { text: 'Piece Type', style: 'fonts' },
                    { text: 'Qty', style: 'fonts' },
                    { text: 'Size', style: 'fonts' },

                ]
            ];
            sortedQty.forEach((item, index) => {

                fronts.push([
                    { text: item.item, style: 'fonts' },
                    { text: Fronts(item, i).pattern, style: 'fonts' },
                    { text: Fronts(item, i).qty, style: 'fonts' },
                    { text: Fronts(item, i).measurement, style: 'fonts' },
                ])
            });
            const sides = [
                [
                    { text: '', style: 'fonts' },
                    { text: '', style: 'fonts' },
                    { text: '', style: 'fonts' },
                    { text: '', style: 'fonts' },

                ]
            ];
            sortedQty.forEach((item, index) => {
                sides.push([
                    { text: item.item, style: 'fonts' },
                    { text: Sides(item, i).pattern, style: 'fonts' },
                    { text: Sides(item, i).qty, style: 'fonts' },
                    { text: Sides(item, i).measurement, style: 'fonts' },
                ])
            });

            const materialBody = []


            const groupedByHeight = _.groupBy(i.dimensions, 'height');
            Object.entries(groupedByHeight).map(([k, v], lineIn) => {

                const groupedMaterialBody = []

                v.forEach((item, index) => {


                    let mb = {
                        columns: [
                            { text: `${i.woodtype.NAME}`, style: 'fonts' },
                            { text: `${k} x ${i.boxThickness.Thickness}`, style: 'fonts' },
                            { text: `= ${LinearIN(v, i)} Lin IN`, style: 'fonts' },
                            { text: '', style: 'fonts' },
                        ]
                    }
                    groupedMaterialBody.push(mb)
                    materialBody.push(groupedMaterialBody)

                });
            })

            return [
                {
                    margin: [0, 10, 0, 0],
                    columns: [
                        {
                            stack: [
                                { text: `${i.woodtype.NAME}`, style: 'woodtype' }
                            ]
                        },
                        {
                            stack: [
                                {
                                    text: `${i.boxThickness.Thickness} Box Side`,
                                    style: 'woodtype'
                                }
                            ],
                            alignment: 'right'
                        }
                    ]
                },
                {
                    canvas: [
                        { type: 'line', x1: 0, y1: 0, x2: 540, y2: 0, lineWidth: 1 }
                    ],
                    margin: [0, 10, 0, 0]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*',],
                        body: fronts
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 10]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*',],
                        body: sides
                    },
                    layout: 'lightHorizontalLines'
                },
                {
                    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 540, y2: 0, lineWidth: 1 }]
                },
                {
                    text: 'Box Sides / Box Fronts & Backs - Linear Inch Material Breakdown - "Width x Thickness"', style: 'fonts', margin: [0, 12, 0, 0],
                },
                {
                    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 540, y2: 0, lineWidth: 1 }]
                },
                materialBody

            ];
        }),
        { text: '', pageBreak: 'before' }
    ];
};
