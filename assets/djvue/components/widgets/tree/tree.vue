<template>
  <v-container pa-0>
      <v-treeview
        v-model="tree"
        
        :items="options.tree"
        activatable
        item-key="name"
        open-on-click
      >
        <template slot="prepend" slot-scope="{ item, open, leaf }">
          <v-icon v-if="!item.file">
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
          <v-icon v-else>
            {{ files[item.file] }}
          </v-icon>
        </template>
      </v-treeview>

      <v-dialog
        v-model="dialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">Html widget options</v-card-title>

          <v-card-text>
            Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              flat="flat"
              @click="dialog = false"
            >
              Cancel
            </v-btn>

            <v-btn
              color="green darken-1"
              flat="flat"
              @click="dialog = false"
            >
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>  



</template>



<script>

 export default  {
    name:"tree-widget",
    methods:{
      openDialog(){console.log("emit tree dialog"); this.dialog = true}
    },

    props:["options"],
    
    data () {
      return {
        
        dialog: false,
        tree:[]
        
        
      }
    }
  }

</script>	