
export default (data, edges, moulds, panels) => {
    return [
        {
            columns: [
                {
                    stack: [

                        { text: 'Profiles', bold: true },
                    ]
                },
                {
                    stack: [

                        { text: 'Porta Door Co. Inc.', alignment: 'center' },
                    ]
                },
                {
                    stack: [
                        { text: `Order #: ${data.orderNum}`, alignment: 'right' },
                    ]
                }
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
                                    image: edges,
                                    width: 100,
                                    height: 100,
                                    fit: [100, 100]
                                }

                            ]
                        },
                        {
                            stack: [
                                {
                                    text: `${i.moulds.NAME}`,
                                    style: 'fonts'
                                },
                                {
                                    image: moulds,
                                    width: 100,
                                    height: 100,
                                    fit: [100, 100]
                                }

                            ]
                        },
                        {
                            stack: [
                                {
                                    text: `${i.panels.PANEL}`,
                                    style: 'fonts'
                                },
                                {
                                    image: panels,
                                    width: 100,
                                    height: 100,
                                    fit: [100, 100]
                                }

                            ]
                        },
                    ],

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
