
export default {

	props:["config"],

	data:()=>({

		localConfig:{}
	}),
	
	methods:{


	    doWidgetReconfigure (widget) {
			  
		  if(this.config.id == widget.config.id){
            
            if(this.$refs.instance.onWidgetConfigure){
            	
            	let c =  this.$djvue.extend({},widget.config)
            	
            	this.$refs.instance.onWidgetConfigure(c)
            		.then( newConfig => {
            			
            			if(newConfig)
            				this.$eventHub.emit("holder-update-widget-config",
	            				{ 
	            					widget:this, 
	            					newConfig:this.$djvue.extend({}, newConfig)
	            				}
	            			)
            		})
            		.catch(()=> {})
            }		
          }
        },

	    doWidgetUpdateConfig () {
	    		
	      		this.doRemoveSubscriptions();
	      		
	      		this.localConfig = this.config;

	      		this.doInitSubscriptions();

		      	let dataLoaded = new Promise( (resolve,reject) => {
				
				if(!this.localConfig.data){
					reject("no data")
				}

				if(this.localConfig.data.source == "url"){
					this.$http
						.get(this.localConfig.data.url)
						.then(res => {
							resolve(res.data)
						})
						.catch((error) => {
							this.$djvue.warning({
					            type:"error",
					            title:"Cannot load data",
					            text:error.toString()
					          })
							if ( this.$refs.instance && this.$refs.instance.onWidgetError ) this.$refs.instance.onWidgetError(error)
							
						})
					return	
				}
				
				if(this.localConfig.data.source == "dps"){
					resolve("dps")
					return
				}
				
				if(this.localConfig.data.source == "embedded") {
					resolve(this.localConfig.data.embedded)
					return
				}

				// reject("no data source")
			})

			let optionsLoaded = new Promise( (resolve,reject) => {

				if(!this.localConfig.options){
					reject("no options source")
				}

				if(this.localConfig.options.url){
					this.$http
						.get(this.localConfig.options.url)
						.then(res => {
							this.localConfig.options = res.data.options
							resolve(this.localConfig.options)
						})
					return	
				}
				
				if(this.localConfig.options.script){
					console.log("Run dps")
					this.localConfig.options = "DPS"
					resolve(this.localConfig.options)
					return
				}
				
				if(this.localConfig.options) {
					// setTimeout(()=> {resolve(this.config.options)},2000)

					resolve(this.localConfig.options)

					return
				}

				// reject("no options source")
					
			})

			Promise.all([dataLoaded, optionsLoaded]).then(res => {
				this.doWidgetUpdateState({data:res[0], options:res[1]})
			})	
		},

		doWidgetUpdateState (state) {
			if(this.$refs.instance && this.$refs.instance.onWidgetUpdate) this.$refs.instance.onWidgetUpdateState({data:res[0], options:res[1]})
		},

		doWidgetDelete () {
			if(this.$refs.instance && this.$refs.instance.onWidgetDelete) this.$refs.instance.onWidgetDelete()
			this.doRemoveSubscriptions()	
					
		},

		doRemoveSubscriptions () {
			this.$eventHub.off("widget-reconfigure",this.doWidgetReconfigure)
		},

		doInitSubscriptions () {
			this.$eventHub.on("widget-reconfigure", this.doWidgetReconfigure)			
		}


	},
	
	created(){
		this.doWidgetUpdateConfig()
	},

	destroyed(){
		this.doRemoveSubscriptions()
	}
}		
