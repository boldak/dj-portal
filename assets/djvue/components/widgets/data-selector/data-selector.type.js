// import snippets from "./snippets.js"

export default {
	name:"data-selector-widget",

    icon: "mdi-format-list-checks",

    getInitialConfig( snippet ){
        // snippet = snippet || "default"
        // let res = snippets[snippet] || snippets["default"]
        // return res

        return {
      
	        type:"data-selector-widget", 
	        name:"noname",
	        icon:"mdi-format-list-checks",
	       
	        options: { widget:{
	            visible: true
	          },
	          mapper:"product"
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
}
