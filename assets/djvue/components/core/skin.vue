<template>
  <div>
  	<dj-holder name="AppHeader" type="skin"></dj-holder>
    <router-view></router-view>
    <dj-holder name="AppFooter" type="skin"></dj-holder>
  </div>  
</template>		    


<script>
	import holder from "djvue/components/core/holder.vue"
	
	export default {
   components: {
      "dj-holder": () => import("djvue/components/core/holder.vue")
    }
  }
</script>
