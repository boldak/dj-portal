export default {
	name:"mediator-widget",

    icon: "mdi-language-javascript",

    getInitialConfig( snippet ){

        let res = {
            type:"mediator-widget", 
            name:"noname",
            icon:"mdi-language-javascript",
            options: { widget:{
                visible:true
              }
            },
            data:{
              script:`// type script here
                alert("Djvue app run in "+this.app.mode+" mode")
              `
            }
        }
        return res
    }	
}
