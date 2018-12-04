<template>
	<v-container fluid>
	  
	<v-layout wrap>
      <v-flex xs12>
        <v-combobox
          v-model="mode"
          :items="sourceTypes"
          dense
          label="Select a data source type"
        ></v-combobox>
      </v-flex>

      <v-flex xs12>
      	<v-text-field
      		  v-show="mode == 'url'"	
              v-model="config.data.url"
              label="url"
              hint="For example, djvue/components/widgets/html/1.htm"
        >         	
         </v-text-field>

         	
         </v-text-field> 
		
		<editor 	v-show="mode == 'embedded'"
	                :content="config.data.embedded" 
	                lang="html" 
	                :sync="true"
	                @change="onUpdateSource"
	                style="border:1px solid #999"
	    > 
	    </editor>

	    <editor 	v-show="mode == 'dps'"
	                :content="config.data.script" 
	                lang="dps" 
	                :sync="true"
	                @change="onUpdateScript"
	                style="border:1px solid #999"
	    > 
	    </editor>

	  </v-flex>  
	</v-layout>
	</v-container>  
</template>

<script>
	import editor from 'djvue/components/core/ext/ace-editor.vue';
	export default {
		name:"html-editor",
		components:{editor},
		props:["config"],
		data:()=>({
			sourceTypes:["url","dps", "embedded"], 
			mode:""
		}),
		methods:{
			onUpdateSource(value){
	        this.config.data.embedded = value
	      },
	      onUpdateScript(value){
	        this.config.data.script = value
	      }
		},

		created(){
			this.mode = this.config.data.source;
			this.clearWatch = this.$watch("mode", ()=>{this.config.data.source = this.mode})
		},

		destroyed(){
			this.clearWatch();	
		}

	}

</script>     