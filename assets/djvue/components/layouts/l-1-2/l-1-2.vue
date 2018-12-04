<template>
	<v-container>
	    <v-layout row wrap>
	      
	      <v-flex xs12 pa-1>
	        <dj-holder name="Top" @init="onInitChild"></dj-holder>
	      </v-flex>
	      
	      <v-flex xs6 pa-1 mt-2>
	        <dj-holder name="Column 1" @init="onInitChild"></dj-holder>
	      </v-flex>
	      
	      <v-flex xs6 pa-1 mt-2>
	        <dj-holder name="Column 2" @init="onInitChild"></dj-holder>
	      </v-flex>
	      
	      
		</v-layout>
	</v-container>
</template>		    


<script>
	import mixin from "djvue/mixins/core/layout.mixin.js"

	export default {
	    components: {
	      "dj-holder": () => import("djvue/components/core/holder.vue")
	    },
	    
	    mixins:[mixin],

	    methods:{
	    	
	    	onBeforeInit(){
	    		this._waitList = ["Top", "Column 1", "Column 2"]
	    	},

	    	onChildsInitiated(){
	    		
	    		this.$nextTick(()=>{
	    			this.emit("page-start")	
	    		})
	    		
	    	}
	    }
    
  	}
  
</script>
