let template = `
      <v-card>
        
        <v-toolbar card dense dark color="primary">
          <v-tooltip top>
                <v-icon slot="activator" large>{{icon}}</v-icon>
             <span>html-widget</span>
          </v-tooltip>
          <v-toolbar-title>{{title}}</v-toolbar-title>
        </v-toolbar>

        <v-layout>
          
          <v-flex>
            <v-card-text class="pa-1"  style="height:500px;">
               <v-treeview
                  :active.sync="active"
                  :items="editorTree"
                  :open = "open"
                  activatable
                  active-class="primary--text"
                  open-on-click
                  transition
                >
              </v-treeview>
            </v-card-text>
          </v-flex>

          <v-divider vertical></v-divider>
          
          <v-flex xs12 md8>
            <v-card-text class="pa-1"  style="height:500px;">
              <div v-for="item in editorMap">
                <component :is="item.editor" :config="config" :selected="selected" v-if="selected && selected.id == item.id"></component>
              </div>
            </v-card-text>
          </v-flex>  
        
        </v-layout>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="primary"
              flat="flat"
              @click="reject"
              
            >
              Cancel
            </v-btn>

            <v-btn
              color="primary"
              flat="flat"
             @click="resolve"
            >
              Ok
            </v-btn>
          </v-card-actions>

      </v-card>
`


 let tree2array = (tree, level) => {
  level = level || 1;
  let res = [];
  tree.forEach((node,index)=>{
    node.id = level+"."+index;
    res.push(node)
    if ( node.children ){
      res = res.concat(tree2array(node.children,level+1))
    }  
  })
  return res;
}

export default (components) => ({
  
  template,

  components,

  props:["icon", "title","config", "editorTree","resolve","reject"],

  computed:{
      selected () {
        let vm = this
        return _.find(vm.editorMap, item => item.id == vm.active[0])
      }
    },

  
    watch: {
      selected: function(value){
        this.selectedItem = value
      }
    },

    data () {
      return {
        editorMap:[],
        open:[],
        active:[]    
      }
    },

    created(){
      this.editorMap = tree2array(this.editorTree);
      this.open = [this.editorMap[0].id];
      this.active = [this.editorMap[1].id];
    }


})  


