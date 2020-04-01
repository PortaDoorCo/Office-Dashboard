import moment from 'moment';
import Size from '../Breakdowns/DrawerBoxes/Size'
import Bottoms from '../Breakdowns/DrawerBoxes/Bottoms';
import LinearIN from '../Breakdowns/DrawerBoxes/LinearIN';
import _ from 'lodash'


export default data => {
    return [
        {
            columns: [
                {
                    stack: [
                        { text: 'Bottoms List', bold: true },
                        `Shipping Date: ${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`
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
                        { text: `Est. Ship: ${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`, alignment: 'right' }
                    ]
                }
            ]
        },
        {
            columns: [
                {
                    text: `${data.job_info.jobName} - ${data.job_info.customer.Company}`,
                    margin: [0, 10]
                },
                { text: 'Job: None', alignment: 'right', margin: [0, 0, 80, 0] }
            ]
        },
        {
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }]
        },
        data.part_list.map((i, index) => {
            let sortedDimensions = i.dimensions.sort(function (a, b) { return b.width - a.width })


            const bottoms = [
                [
                    { text: 'Item', style: 'fonts' },
                    { text: 'Qty', style: 'fonts' },
                    { text: 'Finish Box Size', style: 'fonts' },
                    { text: 'Qty', style: 'fonts' },
                    { text: 'Drawer Bottom Size', style: 'fonts' },

                ]
            ];
            sortedDimensions.forEach((item, index) => {
            
                bottoms.push([
                    { text: item.item, style: 'fonts' },
                    { text: item.qty, style: 'fonts' },
                    { text: Size(item, i), style: 'fonts' },
                    { text: Bottoms(item, i).qty, style: 'fonts' },
                    { text: Bottoms(item, i).measurement, style: 'fonts' },
                ])
            });


            const materialBody = []


            const groupedByDepth = _.groupBy(i.dimensions, 'depth');
            Object.entries(groupedByDepth).map(([k, v]) => {

                const groupedMaterialBody = []

                let mb = {
                    columns: [
                        { text: `${i.boxBottomWoodtype.NAME}`, style: 'fonts' },
                        { text: `${k} x ${i.boxThickness.NAME}`, style: 'fonts' },
                        { text: `= ${LinearIN(v, i)} Lin IN`, style: 'fonts' },
                        { text: '', style: 'fonts' },
                    ]
                }

                return (
                    groupedMaterialBody.push(mb),
                    materialBody.push(groupedMaterialBody)
                )
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
                        widths: ['*', '*', '*', '*', '*'],
                        body: bottoms
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 10]
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
