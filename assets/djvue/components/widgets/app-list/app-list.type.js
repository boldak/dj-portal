

export default {
	name:"app-list-widget",

    icon: "mdi-apps",

    getInitialConfig( snippet ){
        // snippet = snippet || "default"
        // let res = snippets[snippet] || snippets["default"]
        // return res

        return {
      
	        type:"app-list-widget", 
	        // id:Vue.prototype.$djvue.randomName(),
	        name:"noname",
	        icon:"mdi-apps",
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
