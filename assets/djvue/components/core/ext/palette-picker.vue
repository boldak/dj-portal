<template>
  <v-layout column>
    <v-combobox
      label="Color Palette"
      v-model="model"
      :items="palettes"
      @input="onChange"
      dense
    >
      <template
        v-if="item === Object(item)"
        slot="selection"
        slot-scope="{ item, parent, selected }"
      >
            <span v-for="c in view" :style="`margin:0; padding:0; background:${c}; width:16px; height:20px;`">
           
            </span> 
        
      </template>
      <template
        slot="item"
        slot-scope="{ index, item, parent }"
      >
            <v-layout row >
              <span v-for="c in item.color" :style="`margin:0; padding:0; background:${c}; width:16px; height:20px;`">
              </span> 
            </v-layout>
      </template>
    </v-combobox>
    <v-switch
      label="Reverse colors"
      :disabled = "!model"
      v-model="isReverse"
      @change ="onChange"
      color="primary"
    ></v-switch>
  </v-layout>  

</template>

<script>
  
  import palettes from "./dj-palettes.js"

  export default {
    props:["value"],
    data: () => ({
      model: {},
      isReverse:{},
      palettes: palettes
    }),
    
    computed:{
      view() {
        let temp;
        if(this.model.color){
         temp = JSON.parse(JSON.stringify(this.model.color))
         if(this.isReverse) temp.reverse()
        }
        return temp
      }
    },
    
    created(){
      this.isReverse = (this.value) ? this.value.isReverse : false
      this.model = this.value
    },

    methods:{
      onChange(){
        if(this.model){
          this.model.isReverse = this.isReverse;
          this.$emit("change", this.model)  
        }
      }
    }
  }
</script>
