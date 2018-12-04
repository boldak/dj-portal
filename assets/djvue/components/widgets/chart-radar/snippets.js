export default {
    "Radar":
    {
            type:"radar-chart-widget", 
            name:"noname",
            icon:"mdi-chart-line",
            
            options: { 

                widget:{
                  visible:true
                },

                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    x: 'center',
                    data:['Entity 1','Entity 2','Entity 3']
                },
                radar: [
                    
                    {
                        indicator: [
                            {text: 'C1', max: 100},
                            {text: 'C2', max: 100},
                            {text: 'C3', max: 100},
                            {text: 'C4', max: 100},
                            {text: 'C5', max: 100}
                        ],
                        radius: "80%",
                        center: ['50%','50%'],
                    }
                ],

                series: [
                    {
                        type: 'radar',
                         tooltip: {
                            trigger: 'item'
                        },
                        itemStyle: {
                            
                        },
                        
                        data: [
                            {
                                value: [85, 90, 90, 95, 95],
                                areaStyle:{
                                    normal: {
                                        opacity:0.1
                                    }
                                },
                                name: 'Entity 1'
                            },
                            {
                                value: [95, 80, 95, 90, 93],
                                areaStyle:{
                                    normal: {
                                        opacity:0.2
                                    }
                                },
                                name: 'Entity 2'
                            },
                            {
                                value: [25, 30, 45, 50, 22],
                                areaStyle:{
                                    normal: {
                                        opacity:0.1
                                    }
                                },
                                name: 'Entity 3'
                            }
                        ]
                    }
                ],

                "color": [
                    "#e41a1c",
                    "#377eb8",
                    "#4daf4a",
                    "#984ea3",
                    "#ff7f00",
                    "#ffff33",
                    "#a65628",
                    "#f781bf",
                    "#999999"
                ]
            },
            
            
            data:{
                source:"embedded",
                embedded:{
                    dataset: {
                        // Here the declared `dimensions` is mainly for providing the order of
                        // the dimensions, which enables ECharts to apply the default mapping
                        // from dimensions to axes.
                        // Alternatively, we can declare `series.encode` to specify the mapping,
                        // which will be introduced later.
                        dimensions: ['product', '2015', '2016', '2017'],
                        source: [
                            {product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7},
                            {product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1},
                            {product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5},
                            {product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1}
                        ]
                    }
                }
            }
    }
}    
    