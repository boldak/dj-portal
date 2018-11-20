<template>
	
	<v-container pa-2 class="holder" v-bind:class="{producttion:isProductionMode, accepted:isAcceptWidget}">
	  <div class="holder-title">
	   <h4 v-if="!isProductionMode"> Widget Holder: {{name}}</h4>
	  </div> 
	  <v-layout column wrap>
	  	<draggable 
	  		class="list-group" 
	  		element="div" 
	  		v-model="widgets" 
	  		:options="dragOptions" 
	  		:move="onMove" 
	  		@start="onStartDrag" 
	  		@end="onEndDrag" 
	  		@change="validateConfig" 
	  	>	
		  	 <transition-group type="transition" name="holders" tag="div" v-bind:class="{'empty-holder': isEmpty && !isProductionMode}">
		  		
		  			<dj-widget :config="widget"  v-for="widget in widgets" :key="widget.id" class="list-group-item"></dj-widget>
		  		
		  	</transition-group>
		  	
		</draggable>
	  	
	 </v-layout>
	 <v-layout align-center justify-center row fill-height>
	 	<v-btn color="primary" v-on:click="insert()" v-if="!isProductionMode">
		      	<v-icon small class="pr-3">fa-plus</v-icon>
		      	Add
		</v-btn>	
	 </v-layout>	
	 	
	</v-container>
	
</template>

<script>
	import draggable from "modules/vue-draggable/vuedraggableES6.js";
	
	import djvueMixin from "djvue/mixins/core/djvue.mixin.js"
	import listenerMixin from "djvue/mixins/core/listener.mixin.js"
	
	// import widgetTypes from "djvue/components/widgets/widgetTypes.js"

	import insertWidgetDialog from "djvue/components/core/dialogs/insertWidgetDialog.vue"

	Vue.prototype.$dialog.component('insertWidgetDialog', insertWidgetDialog)


	let accepted = null;

	let toTree = (object) =>
				
					_.keys(object).map( key => {
						return {
							name: (_.isObject(object[key])) ? key: `${key}: ${object[key]}`,
							children: (!_.isObject(object[key])) ? undefined : toTree(object[key]) 
						}
					})
					

	export default {

	mixins:[djvueMixin, listenerMixin],	
		
    components: {
      "dj-widget": () => import("./widget.vue"),
      draggable
    },

    data () {
      return {
        msg: 'hello',
        isAcceptWidget: false,
        widgets:[]
      }
    },
    props:["name"],
    computed:{
    	
    	isEmpty(){ return this.widgets.length == 0},
    	
    	dragOptions() {
	      return {
	        animation: 150,
	        group: {
	        	name:"holders"
	        },
	        // disabled: !this.editable,
	        ghostClass: "ghost",
	        dragClass: "drag",
	        handle:".handle"
	      };
	    }

    },

    methods:{
    	insert(){

    		this.$dialog.showAndWait(insertWidgetDialog)
    			.then( initialWidgetConfig => {
    				if(initialWidgetConfig){
    					initialWidgetConfig.id = this.$djvue.randomName()
    					this.widgets.push( this.$djvue.extend({},initialWidgetConfig ))	
    				}
    			})

    	},

    	isHoldWidget(id){
    		return !!_.find(this.widgets, w => w.id == id)
    	},

    	onStartDrag(){
    		this.$eventHub.emit("holder-accept", this)
    		this.isDragging=true
    	},

    	onEndDrag(){
    		this.$eventHub.emit("holder-accept", null)
    		this.isDragging=false
    	},

    	onMove({ relatedContext, draggedContext }) {
    	  this.$eventHub.emit("holder-accept", relatedContext.component.$parent)
    	  return true 
	    },

	    validateConfig(options){
	    	if (options.moved && options.moved.oldIndex != options.moved.newIndex){
	    		this.setNeedSave(true)
	    	}

	    	if(options.added || options.removed){
	    		this.setNeedSave(true)	

	    	}
	    }
    },

    created(){

    	this.$eventHub.on("holder-accept", (holder) => {
    		this.isAcceptWidget = holder && (holder.name == this.name)
    	})

    	this.$eventHub.on("widget-clone", (cloned) => {
    		
    		if(!this.acceptEvent("widget-clone", cloned.config.id)) return;
    		
    		console.log("accept widget-clone")
    		
    		let widgetIndex = _.findIndex(this.widgets, w => w.id == cloned.config.id);
			let newWidget = this.$djvue.extend({},this.widgets[widgetIndex] )
			newWidget.id = this.$djvue.randomName();
			newWidget.name += "_clone_"+newWidget.id;
			
			this.widgets.splice(widgetIndex+1, 0, newWidget )
    			
    	})

    	this.$eventHub.on("widget-delete", (deleted) => {
    		
    		if(!this.acceptEvent("widget-delete", deleted.config.id)) return;

    		console.log("accept widget-delete")
    		
    		deleted.doWidgetDelete();
    		let widgetIndex = _.findIndex(this.widgets, w => w.id == deleted.config.id);
    		if(widgetIndex > -1){
    			this.widgets.splice(widgetIndex, 1)
    		}	
    	})

    	
		this.$eventHub.on("holder-update-widget-config", (context) => {
			
			if(!this.acceptEvent("holder-update-widget-config", context.widget.config.id)) return;

    		console.log("accept holder-update-widget-config")
    		
			let widgetIndex = _.findIndex(this.widgets, w => w.id == context.widget.config.id);
			this.widgets.splice(widgetIndex, 1)
			this.$nextTick(() => {
				this.widgets.splice(widgetIndex, 0, this.$djvue.extend({},context.newConfig))
			})	
    			
    	})

    	
    	this.subscribe("widget-delete", this.isHoldWidget);
		this.subscribe("widget-clone", this.isHoldWidget);
    	this.subscribe("holder-update-widget-config", this.isHoldWidget);
        

	
    },

    watch: {
	    isDragging(newValue) {
	      if (newValue) {
	        this.delayedDragging = true;
	        return;
	      }
	      this.$nextTick(() => {
	        this.delayedDragging = false;
	      });
	    }
	 }


  }
</script>
<style scoped>
	.drag {
		opacity: 0;
	}
	.empty-holder {
		  border: 2px dashed #bbb !important;
		  min-height: 100px !important;
		  background-color: #eee !important;
		  /*background-image: -webkit-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), -webkit-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
		  background-image: -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
		  background-image: linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
		  background-size: 20px 20px;
		  background-position: 0 0,30px 30px;*/
	}

	.flip-list-move {
	  transition: transform 0.5s;
	}

	.no-move {
	  transition: transform 0s;
	}

	.ghost {
	  opacity: 0 !important;
	  
	}
	.list-group {
  		min-height: 20px;
	}

	.list-group-item {
	}

	.list-group-item i {
	}

	.container.holder.pa-2 {
		border:2px solid #bbb !important;
	}

	.container.holder.pa-2.producttion {
    /* display: none; */
    border: none !important;
	}

	.holder-title {
		background: #fafafa;
	    margin-top: -1.3em;
	    color: #bbb;
	    width: fit-content;
	    padding: 0em 1em;
	}

	.container.holder.pa-2.accepted {
		border-color: #1976d2 !important;
	}

	.accepted .empty-holder {
		border-color: #1976d2 !important;
	}

	.accepted h4 {
		color: #1976d2;
	}


</style>