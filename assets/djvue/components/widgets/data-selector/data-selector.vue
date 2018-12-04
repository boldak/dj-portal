<template>
            <v-autocomplete
              v-model="selection"
              :items="items"
              color="primary"
              label="Select entities"
              multiple
            >
              <template
                slot="selection"
                slot-scope="data"
              >
                <v-chip
                  outline color="primary"
                  :selected="data.selected"
                  close
                  class="chip--select-multi"
                  @input="remove(data.item)"
                >
                  {{ data.item }}
                </v-chip>
              </template>
              <template
                slot="item"
                slot-scope="data"
              >
                <template v-if="typeof data.item !== 'object'">
                  <v-list-tile-content v-text="data.item"></v-list-tile-content>
                </template>
                <template v-else>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="data.item"></v-list-tile-title>
                 </v-list-tile-content>
                </template>
              </template>
            </v-autocomplete>

  </template>

<script>

  import djvueMixin from "djvue/mixins/core/djvue.mixin.js";
  import listenerMixin from "djvue/mixins/core/listener.mixin.js";


  export default {
    
    props:["config"],

    mixins:[djvueMixin, listenerMixin],

    computed:{
      items(){
         return this.source.map((item => item[this.mapper]))
      }
    },

    data: () => ({
      selection:[],
      source:[],
      mapper:null
    }),

    
    methods: {

      onUpdate ({data, options}) {
        // console.log(JSON.stringify(data))
       
       this.source = data.dataset.source;
       this.mapper = options.mapper;
       this.$nextTick(()=>{
           this.selection = [this.items[0]]
       })
      
      },

      onPageStart(){
        let res = {
          mapper:this.mapper,
          selection: this.items.map(item => ({
                  entity:item,
                  selected: (_.findIndex(this.selection, t => t == item)>=0)
              }))
        }  

        this.emit("data-select", this, res)
      
      },

      remove (item) {
        if(this.selection.length == 1) return
        const index = this.selection.indexOf(item)
        if (index >= 0) this.selection.splice(index, 1)
      }
    },

    watch:{
      selection(value){
        let res = {
          mapper:this.mapper,
          selection:this.items.map(item => ({
              entity:item,
              selected: (_.findIndex(value, t => t == item)>=0)
          }))
        }  

        this.emit("data-select", this, res)
      }  
    },

    created(){
       // console.log("CREATED",JSON.stringify(this.config, null,"\t"))
        this.source = this.config.data.embedded.dataset.source;
        this.mapper = this.config.options.mapper;
        this.$nextTick(()=>{
             this.selection = [this.items[0]]
             
        })  
    },

    
   
    mounted(){

        this.$emit("init")
    }
  }
</script>
