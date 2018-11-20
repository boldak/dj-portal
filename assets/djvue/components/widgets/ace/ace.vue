<template>
	
	<v-card flat style="border:1px solid #999">

		<v-system-bar window>
	        <v-btn flat small @click="isShowSnippetPanel = !isShowSnippetPanel">
            	{{(!isShowSnippetPanel)?'Show':'Hide'}} Snippets
         	 </v-btn>

	      <!-- <v-spacer></v-spacer>
	      <v-icon>remove</v-icon>
	      <v-icon>check_box_outline_blank</v-icon>
	      <v-icon>close</v-icon> -->
    	</v-system-bar>

		
		<v-layout row wrap style="border-top: 1px solid #999; border-bottom: 1px solid #999;">
			
			<v-flex v-if="isShowSnippetPanel" style="border-right:1px solid #999;">
				
				<v-list dense>
		          <v-list-tile
		            v-for="item in snippets"
		            :key="item.title"
		            @click="insertSnippet(item.text)"
		          >
		            <v-list-tile-content>
		              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
		            </v-list-tile-content>
		          </v-list-tile>
		        </v-list>

			</v-flex>
			<v-flex v-bind:class="{ 'xs10':isShowSnippetPanel, 'pa-0':isShowSnippetPanel, 'xs12':!isShowSnippetPanel}">
				<editor 
					:content="source" 
					:lang="options.lang" 
					:sync="true"
					@change="onUpdateSource"
				> 
				</editor>	
			</v-flex>
		</v-layout>

		<v-system-bar status>
			<v-icon small>mdi-alert-outline</v-icon>
			<span>Create db schema</span>

			<v-spacer></v-spacer>
			<v-icon small>mdi-cloud-outline</v-icon>
	        <span>http://dj-storage.herokuapp.com</span>
	        
	        
	      </v-system-bar>
	    </v-card>		

	</v-card>
</template>



<script>

	import editor from 'djvue/components/core/ext/ace-editor.vue'

	

	export default {
		
		name: "ace-editor",

		components : {
			"editor": editor
		},
		
		props:["options"],
		
		data: () => {
			return {
				source:"// start edit dps",
				editor:null,
				snippets:[
					{
						title:"Load",
						text:"ddl.load(url:'http://your_data_source_URL')"
					}
				],
				drawer: true,
				isShowSnippetPanel:true
			}
		},

		mounted(){
			this.editor = this.$djvue.findChild(this, item => item.$el.className == "editor ace_editor ace-tomorrow")
			
			for(let i=0; i<2; i++){
				this.snippets.push({
						title:"Load "+i,
						text:"ddl.load(url:'http://your_data_source_URL')"
					})
			}
		},

		methods:{

			onUpdateSource(value){
				this.source = value
			},

			
			insertSnippet(text){
				this.editor.insert(text)
			}

		}
	}

</script>

