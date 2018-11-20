<template>
	
	<v-container>
	    <v-layout row wrap>
	      <v-flex xs12 pa-1>
	        <dj-holder name="Holder"></dj-holder>
	      </v-flex>
		</v-layout>
	</v-container>
</template>		    


<script>
	export default {
    components: {
      "dj-holder": () => import("djvue/components/core/holder.vue")
    },

    data () {
      return {
       
      }
    }
  }
  
</script>
