export default {
    "Line":
    {
            type:"line-chart-widget", 
            name:"noname",
            icon:"mdi-chart-line",
            
            options: { 

                widget:{
                  visible:true
                },

                legend:{
                    data:["1","2"]
                },
                xAxis: {
                    type:"category",
                    data:["2015","2016", "2017", "2018"]
                    
                },
                yAxis: {
                    type:"value"
                },
                series: [
                        {   name: "1",
                            type:"line",
                            // areaStyle: {},
                            data:[43.3, 85.8, 93.7,79.4],
                            smooth: true
                        },    
                        {   name: "2",
                            type:"line",
                            // areaStyle: {},
                            data:[37.3, 28.8, 77.7, 100],
                            smooth: true
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
    },

    "Area":
    {
            type:"line-chart-widget", 
            name:"noname",
            icon:"mdi-chart-line",
            
            options: { 

                widget:{
                  visible:true
                },

                legend:{
                    data:["1","2"]
                },
                xAxis: {
                    type:"category",
                    data:["2015","2016", "2017", "2018"]
                    
                },
                yAxis: {
                    type:"value"
                },
                series: [
                        {   name: "1",
                            type:"line",
                            areaStyle: {},
                            data:[43.3, 85.8, 93.7,79.4],
                            smooth: true
                        },    
                        {   name: "2",
                            type:"line",
                            areaStyle: {},
                            data:[37.3, 28.8, 77.7, 100],
                            smooth: true
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
    },
    "Stacked Line":
    {
            type:"line-chart-widget", 
            name:"noname",
            icon:"mdi-chart-line",
            
            options: { 

                widget:{
                  visible:true
                },

                legend:{
                    data:["1","2"]
                },
                xAxis: {
                    type:"category",
                    data:["2015","2016", "2017", "2018"]
                    
                },
                yAxis: {
                    type:"value"
                },
                series: [
                        {   name: "1",
                            type:"line",
                            // areaStyle: {},
                            data:[43.3, 85.8, 93.7,79.4],
                            smooth: true,
                            stack:"a"
                        },    
                        {   name: "2",
                            type:"line",
                            // areaStyle: {},
                            data:[37.3, 28.8, 77.7, 100],
                            smooth: true,
                            stack:"a"
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
    },

    "Stacked Area":
    {
            type:"line-chart-widget", 
            name:"noname",
            icon:"mdi-chart-line",
            
            options: { 

                widget:{
                  visible:true
                },

                legend:{
                    data:["1","2"]
                },
                xAxis: {
                    type:"category",
                    data:["2015","2016", "2017", "2018"]
                    
                },
                yAxis: {
                    type:"value"
                },
                series: [
                        {   name: "1",
                            type:"line",
                            areaStyle: {},
                            data:[43.3, 85.8, 93.7,79.4],
                            smooth: true,
                            stack:"a"
                        },    
                        {   name: "2",
                            type:"line",
                            areaStyle: {},
                            data:[37.3, 28.8, 77.7, 100],
                            smooth: true,
                            stack:"a"
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
    