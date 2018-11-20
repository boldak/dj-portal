<template>
   <v-card>

      <v-toolbar card dense dark :color="decoration[options.type].color" class="darken-2">
          <v-icon large>{{decoration[options.type].icon}}</v-icon>
          <v-toolbar-title>{{options.title}}</v-toolbar-title>
      </v-toolbar>


        <v-card-text>
          {{options.text}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="text--darken-3"
            :color="decoration[options.type].color"
            flat
            @click="resolve"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
</template>

<script>
 import warningLayout from "./simpleDialogLayout.vue";

  export default {
    
    name:"warningDialog",

    props:["options"],

    data:() => ({
        decoration:{
          info:{
            color:"primary",
            icon:"mdi-information-outline"
          },
          error:{
            color:"error",
            icon:"mdi-alert-outline"
          },
          success:{
            color:"success",
            icon:"mdi-checkbox-marked-circle-outline"
          },
          warning:{
            color:"warning",
            icon:"mdi-alert-outline"
          }
        }
    }),

    methods:{
      
      resolve(){
        this.$emit('submit', true)
      },

      reject(){
        this.$emit('submit', false)
      }  
    },

    layout: warningLayout

    


  }
</script>