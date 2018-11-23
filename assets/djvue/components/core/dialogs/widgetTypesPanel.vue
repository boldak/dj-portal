
<template>
  <div>
  <v-item-group>
    <v-container grid-list-md>
      <v-layout wrap>
        <v-flex
          v-for="(item, index) in items"
          :key="index"
          xs2
          md2
        >
          <v-item>
            <v-card 
              flat 
              slot-scope="{active, toggle}"
              @click.native="() => { toggle(); getInitialConfig($event,item) }"
            >       
              <v-flex text-xs-center 
                  >
                  <v-icon large :color="active ? 'primary' : ''">
                    {{widgetTypes[item.type].icon}}
                  </v-icon>
                  <div :class="active ? 'primary--text' : ''">{{item.template || item.type}}</div>
              </v-flex>

            </v-card>
           </v-item>
        </v-flex>
      
      </v-layout>
    </v-container>
  </v-item-group>
 
  </div>
</template>  

<script>

import widgetTypes from "djvue/components/widgets/widgetTypes.js"
import mixin from "djvue/mixins/core/dblclick.mixin.js"

export default {
	name:"widget-types-panel",
	props:["selected"],
  mixins:[mixin],
  
  methods:{
    getInitialConfig (event, item) {
      this.onClickHandler(
        event,
        () => {this.$eventHub.emit("widget-config-dlg-select", this.widgetTypes[item.type].getInitialConfig(item.template))},
        () => {this.$eventHub.emit("widget-config-dlg-select", this.widgetTypes[item.type].getInitialConfig(item.template), true)}
      )
    }
  },

  data:()=>(
    {
      widgetTypes,
      items:[]
    }
  ),
  
  created(){
    this.items = this.selected.items.map((item => {
         let a = item.split(":")
         return {
            type:a[0],
            template:a[1]
         }
      }))
  }
  
}	
</script>