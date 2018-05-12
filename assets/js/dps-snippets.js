module.exports = 
[
    {
        title: "Snippets",
        type:"header",
        childs:[
        	{
        		title:"Binding",
        		type:"template",
        		code:`{{PATH_FOR_SCOPE_VARIABLE}}`
        	},
        	{
        		title:"Injection",
        		type:"header",
        		childs:[
        			{
        				title:"javascript",
        				type:"template",
        				code:
`
	<?javascript
		// Type your js here. You can access to variable via $scope
	?>
		
`
        			},
        			{
        				title:"json",
        				type:"template",
        				code:
`
	<?json
	
	?>
		
`
        			},
        			{
        				title:"csv",
        				type:"template",
        				code:
`
	<?csv
	
	?>
		
`
        			},
        			{
        				title:"xml",
        				type:"template",
        				code:
`
	<?xml
	
	?>
		
`
        			},
        			{
        				title:"text",
        				type:"template",
        				code:
`
	<?text
	
	?>
		
`
        			},
        			{
        				title:"html",
        				type:"template",
        				code:
`
	<?html
	
	?>
		
`
        			},
        			{
        				title:"dps",
        				type:"template",
        				code:
`
	<?dps
	
	?>
		
`
        			}        			        			        			
        		]
        	},	

            
            {
                title:"Data definition",
                type:"header",
                childs:[
                    {
                        title:"Create collection",
                        type:"template",
                        code:
        	
`
	// create user defined collection
	ddl.create(
		## collection description ##
	);

`
                    },

                    {
                        title:"Drop collection",
                        type:"template",
                        code:
`
	// drop collection
	ddl.drop(
		## collection identify ##
	);

`
                    },

                    {
                        title:"Alter collection",
                        type:"template",
                        code:
`
	// alter user defined collection
	ddl.alter(
		## altered collection description ##
	);

`
                    }                                    
                        
                ]
            },

            {
                title:"Data manipulation",
                type:"header"
            },
            {
            	title:"Scripts",
            	type:"header",
            	childs:[
            		{
            			title:"Load external data from WB",
            			type:"template",
            			code:
`
// Load external data from WB

dml.load
(
    url:'http://api.worldbank.org/v2/countries/ua/indicators/NY.GDP.MKTP.CD?format=json&per_page=100'
)
json()
set(var:'uaGDP')

<?javascript
    $scope.uaGDP = $scope.uaGDP[1].map(function(item){
        return {
            year:_util.parse.date(item.date,"YYYY"),
            value:item.value
        }
    }).filter(function(item){
        return item.value
    }); 
    $scope.UA_GDP_Table = {
        
        header:[
            {
                metadata:[{
                  "id": "0",
                  "label": "GDP per capita",
                  "dimension": "Indicator",
                  "dimensionLabel": "Indicator",
                  "role": "metric"
                }]
            }    
        ],
        
        body: $scope.uaGDP.map(function(item){
            return {
                metadata:[{
                  "id": _util.format.date(item.year, 'YYYY'),
                  "label": _util.format.date(item.year, 'YYYY'),
                  "dimension": "Year",
                  "dimensionLabel": "Year",
                  "role": "time"
                }],
                value:[_util.parse.number(item.value)]
            }
        })
    };

?>

get(var:'UA_GDP_Table', as:'table')
order(for:'row', by:-1)

`            			
            		}
            	]
            }
        ]

    }
];