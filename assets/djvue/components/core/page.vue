<template>
	<div>
  	
  <!--   
    <h2>{{getPage($route.params.page).title}}</h2>
    <pre style="    font-size: small;
    line-height: 0.9;
    border-bottom: 1px solid #777;">
      {{JSON.stringify(getPage($route.params.page), null,"\t")}}
    </pre>   -->
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

    watch: {
      '$route' (to, from) {
        this.setCurrentPage(this.getPage(this.$route.params.page))  
      }
    },

    updated () {
      window.document.title = `${this.appName}${(this.getPage(this.$route.params.page).title?"-":"")}${this.getPage(this.$route.params.page).title || ""}`
    },

    created(){
      // console.log(this.$route)
      this.setCurrentPage(this.getPage(this.$route.params.page))  
      // console.log("currentPage", this.app.currentPage)  
    }
    
  }
</script>
