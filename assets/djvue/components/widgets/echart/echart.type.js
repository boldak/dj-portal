export default {

	name:"echart-widget",

    icon: "mdi-chart-bar",

    getInitialConfig(){

        let res = {
            type:"echart-widget", 
            name:"noname",
            icon:"mdi-chart-bar",
            
            options: { 

                widget:{
                  visible:true
                },

                
                legend: {},
                tooltip: {},
                xAxis: {type: 'value'},
                yAxis: {type: 'category'},
                series: [
                    {type: 'bar'},
                    {type: 'bar'},
                    {type: 'bar'}
                ],
                grid: {
                    top:"20",
                    height:"auto",
                    containLabel: true
                },

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
        return res
    }	
}