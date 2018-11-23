
import listenerMixin from "djvue/mixins/core/listener.mixin.js";
import initiableMixin from "djvue/mixins/core/initiable.mixin.js"

export default {

	props:["config"],

	mixins:[listenerMixin, initiableMixin],

	data:()=>({
		widgetWrapper:true,
		options:{
			widget:{
				visible: true
			}
		}
	}),
	
	methods:{

		onBeforeInit() { this._waitList = [""] },

        onChildsInitiated() { this.$emit("init", this.config.id) },

		isSameWidget(widget) { return this.config.id == widget.config.id },

	    _reconfigure (widget) {
			  
		    if(this.$refs.instance.onReconfigure){
            	
            	let c =  this.$djvue.extend({},widget.config)
            	
            	this.$refs.instance.onReconfigure(c)
            		.then( newConfig => { 
            			// this.config = newConfig
            			if(newConfig)
            				this.emit(
            					"holder-update-widget-config",
            					this,
            					{
            						widget: this,
            						newConfig: this.$djvue.extend({},newConfig)
            					}
            				)
            		})
            		.catch(()=> {})
            }		
          
        },


	    _updateConfig () {
	    		
	      		// this.doRemoveSubscriptions();
	      		
	      		// this.localConfig = this.config;

	      		// this.doInitSubscriptions();

	      		let dataLoaded = new Promise( (resolve,reject) => {
				
				if(!this.config.data){
					reject("no data")
				}

				if(this.config.data.source == "url"){
					this.$http
						.get(this.config.data.url)
						.then(res => {
							resolve(res.data)
						})
						.catch((error) => {
							this.$djvue.warning({
					            type:"error",
					            title:"Cannot load data",
					            text:error.toString()
					          })
							if ( this.$refs.instance && this.$refs.instance.onError ) this.$refs.instance.onError(error)
							
						})
					return	
				}
				
				if(this.config.data.source == "dps"){
					resolve("dps")
					return
				}
				
				if(this.config.data.source == "embedded") {
					resolve(this.config.data.embedded)
					return
				}

				// reject("no data source")
			})

			let optionsLoaded = new Promise( (resolve,reject) => {

				if(!this.config.options){
					reject("no options source")
				}

				if(this.config.options.url){
					this.$http
						.get(this.config.options.url)
						.then(res => {
							this.config.options = res.data.options
							resolve(this.config.options)
						})
					return	
				}
				
				if(this.config.options.script){
					console.log("Run dps")
					this.config.options = "DPS"
					resolve(this.config.options)
					return
				}
				
				if(this.config.options) {
					// setTimeout(()=> {resolve(this.config.options)},2000)

					resolve(this.config.options)

					return
				}

				// reject("no options source")
					
			})

			Promise.all([dataLoaded, optionsLoaded]).then(res => {
				this.updateState({data:res[0], options:res[1]})
			})	
		},

		updateState (state) {
			this.options = _.extend(this.options, state.options);
			console.log(JSON.stringify(this.options, null, "\t"));
			if(this.$refs.instance && this.$refs.instance.onUpdateState) this.$refs.instance.onUpdateState(state)
		},

		setOption(path,value){
			_.set(this.options, path, value)
		},

		_delete () {
			if(this.$refs.instance && this.$refs.instance.onDelete) this.$refs.instance.onDelete()
			this._removeSubscriptions()	
					
		},

		_removeSubscriptions () { this.off() },

		_initSubscriptions () {
			
			this.on({
				event:"widget-reconfigure", 
				callback: this._reconfigure,
				rule: this.isSameWidget
			})

			this.on({
	    		event: "page-start", 
	    		callback: () => {
	    			// this._updateConfig()		
	    			if(this.$refs.instance && this.$refs.instance.onPageStart)  this.$refs.instance.onPageStart()
		    	},
		    	rule: () => true		
    		})

    		this.on({
	    		event: "page-stop", 
	    		callback: () => {
	    			if(this.$refs.instance && this.$refs.instance.onPageStop)  this.$refs.instance.onPageStop()
		    	},
		    	rule: () => true		
    		})

    		this.dataSelectEmitters = this.config.dataSelectEmitters || [];
    		this.dataSelectEmitters = (_.isArray(this.dataSelectEmitters))?this.dataSelectEmitters : [this.dataSelectEmitters];
    		this.dataSelectEmitters.forEach( emitter => {
    			this.on({
		    		event: "data-select", 
		    		callback: (emitter, data) => {
		    			if(this.$refs.instance && this.$refs.instance.onDataSelect)  this.$refs.instance.onDataSelect(emitter,data)
			    	},
			    	rule: emitter		
    			})
    		})
    		

		}

	},

	watch:{
		config(value) { this._updateConfig() }
    },

	created(){
		this._initSubscriptions()
		this._updateConfig()
	},

	beforeDestroy(){
		this._removeSubscriptions()
	}
}		
