<template>
	
	<v-container>
	    <v-layout row wrap>
	      <v-flex xs12 pa-1>
	        <dj-holder name="Top"></dj-holder>
	      </v-flex>
	      <v-flex v-for="i in 2" :key="`6${i}`" xs6 pa-1>
	        <dj-holder v-bind:name="`Column ${i}`"></dj-holder>
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
