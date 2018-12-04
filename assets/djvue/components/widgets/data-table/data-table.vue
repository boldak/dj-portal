<template>

  <v-data-table
    :headers="table.headers"
    :items="table.rows"
    :hide-actions="table.rows.length < 5"
    style="border:1px solid #999;"
  >
    
    <template slot="items" slot-scope="props">
      <td :class="{'text-xs-right':(index > 0) }" v-for="(col, index) in table.headers">
          {{props.item[col.value]}}
      </td>
    </template>
  </v-data-table>
 
</template>


<script>

  import djvueMixin from "djvue/mixins/core/djvue.mixin.js";
  import listenerMixin from "djvue/mixins/core/listener.mixin.js";
  
   
 export default  {
    
    name:"data-table-widget",

    icon: "mdi-grid",

    mixins:[djvueMixin, listenerMixin],
    
    methods:{

      onUpdate ({data, options}) {
        this.data = data.dataset.source;
        let temp = {
          headers: data.dataset.dimensions.map( item => ({
              text: item,
              align: 'center',
              value: item
          })),
          rows: this.data

        }
        this.table = temp
      },

      // onReconfigure (widgetConfig) {
      //  return this.$dialog.showAndWait(HtmlConfig, {config:widgetConfig})
      // },

      // onError (error) {
      //   this.template = `<div style="color:red; font-weight:bold;">${error.toString()}</div>`;
      // },

      onDataSelect (emitter, data) {
        
        let temp = {
          headers: this.table.headers,
          rows: this.data.filter( item => {
            let d = _.find(data.selection, t => t.entity == item[data.mapper])
            if(!d) return false;
            return d.selected
          })

        }
        this.table = temp
      }

    },

    
    props:["config"],

    

    created(){ 
      this.data = this.config.data.embedded.dataset.source;
      let temp = {
        headers: this.config.data.embedded.dataset.dimensions.map( item => ({
            text: item,
            align: 'center',
            value: item
        })),
        rows: this.data

      }
      this.table = temp
    },

    mounted(){ 
      this.$emit("init") 
    },
    
    data: () =>({
      table:{},
      data:[]
    })
  }

</script> 

<style scoped>
  
  table.v-table tbody td, table.v-table tbody th {
      height: 2em;
  }
    
</style>

