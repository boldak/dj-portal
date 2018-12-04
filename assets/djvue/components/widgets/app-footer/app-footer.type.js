

export default {
	name:"app-footer-widget",

    icon: "mdi-page-layout-footer",

    getInitialConfig( snippet ){
        // snippet = snippet || "default"
        // let res = snippets[snippet] || snippets["default"]
        // return res

        return {
      
	        type:"app-footer-widget", 
	        // id:Vue.prototype.$djvue.randomName(),
	        name:"noname",
	        icon:"mdi-page-layout-footer",
	        options: { widget:{
	            visible: true
	          }
	        },
	        data:{
	          source:"embedded",
	          embedded:`<h2 color="#eee"><center>not configured<center></h2><p>Use options dialog for configure this widget</p>`
	        }
       
    	}
    }

}
