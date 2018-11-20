<template>
	<div>
  	
    
    <h2>{{getPage($route.params.page).title}}</h2>
  	<component :is="getPage($route.params.page).layout" :options="options"></component>
	
  </div>  
</template>		    


<script>
	import layouts from "djvue/components/layouts/index.js"
	import mixin from "djvue/mixins/core/djvue.mixin.js"
	

	export default {

	mixins:[mixin],	
    components: layouts,

    props:{
    	type:{
	    	default: "layout-1-2"
	    }, 
    	"options":{}
    },

    updated () {
    window.document.title = `${this.appName}${(this.getPage(this.$route.params.page).title?"-":"")}${this.getPage(this.$route.params.page).title || ""}`
    },

    data () {
      return {
      }
    }
  }
</script>
