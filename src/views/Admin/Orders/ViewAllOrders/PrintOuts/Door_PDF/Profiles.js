import moment from 'moment';
import Stiles from '../Breakdowns/Doors/Stiles/Stiles';
import Rails from '../Breakdowns/Doors/Rails/Rails';
import Panels from '../Breakdowns/Doors/Panels';
import Size from '../Breakdowns/Doors/Size';
import base64Img from 'base64-img'


export default (data, edgePhoto) => {
    return [
        {
            columns: [
                {
                    stack: [

                        { text: 'Profiles', bold: true },
                        `Shipping Date: ${moment(data.jobInfo.DueDate).format('MM/DD/YYYY')}`,
                    ]
                },
                {
                    stack: [

                        { text: 'Porta Door Co. Inc.', alignment: 'center' },
                        { text: '65 Cogwheel Lane', alignment: 'center' },
                        { text: 'Seymour, CT', alignment: 'center' },
                        { text: '203-888-6191', alignment: 'center' },
                        { text: moment().format('DD-MMM-YYYY'), alignment: 'center' },
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
            return [
                {
                    margin: [0, 10, 0, 0],
                    columns: [
                        {
                            stack: [
                                {
                                    text: `${i.edges.NAME}`,
                                    style: 'fonts'
                                },
                                {
                                    image: edgePhoto
                                }

                            ]
                        },
                        {
                            stack: [
                                { text: 'Thickness: 3/4"', style: 'fonts' },
                                {
                                    text: `IP: ${i.moulds.NAME}   Edge: ${i.edges.NAME}`,
                                    style: 'fonts'
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
                    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 540, y2: 0, lineWidth: 1 }]
                }
            ];
        }),
        { text: '', pageBreak: 'before' }
    ];
};
