<template>
  
  <div class="app">
    <v-app>
     <v-navigation-drawer
      v-model="drawer"
      :mini-variant="mini"
      absolute
      dark
      temporary
    >
     <v-list class="pa-1">
    <v-list-tile tag="div">
      <v-list-tile-content>
    <v-treeview
        v-model="tree"
        
        :items="tree"
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
    </v-list-tile-content>
    </v-list-tile>
    </v-list> 
      <!-- <v-list class="pa-1">
        <v-list-tile v-if="mini" @click.stop="mini = !mini">
          <v-list-tile-action>
            <v-icon>chevron_right</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-list-tile avatar tag="div">
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>John Leider</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn icon @click.stop="mini = !mini">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider light></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click=""
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list> -->
    </v-navigation-drawer>
      
      <v-toolbar dark color="primary">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

        <v-toolbar-title class="white--text">{{$route.path}}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>search</v-icon>
        </v-btn>

        <v-btn icon v-on:click="loadAppList()">
          <v-icon>apps</v-icon>
        </v-btn>

        <v-btn icon v-on:click="fullReload()">
          <v-icon>refresh</v-icon>
        </v-btn>

        <v-btn icon v-if="!user.isLoggedIn" v-on:click="login()">
          <v-icon>mdi-google-plus</v-icon>
        </v-btn>

        <v-btn icon v-if="user.isLoggedIn">
          <v-avatar size="32">
            <img v-bind:src="user.photo" alt="avatar">
          </v-avatar>
        </v-btn>
      </v-toolbar>

      <v-divider></v-divider>
        <router-link v-for="page in app.pages" :to="`/${page.id || ''}`">{{page.title}}</router-link>
      <v-divider></v-divider>

      <router-view></router-view>
       
      <v-btn v-if="user.isOwner || user.isCollaborator"
              fab
              dark
              fixed
              bottom
              right
              :color="(isNeedSave) ? 'warning' : 'success'"
              v-on:click.stop="switchProduction()"
            >
              <v-icon>add</v-icon>
      </v-btn>
    </v-app>  
  </div>
</template>

<script>
import page from "djvue/components/core/page.vue"
import store from 'djvue/state/index.js'
import { portal, http, djvue, cookie, eventhub } from "djvue/plugins/index.js"
import mixin from "djvue/mixins/core/djvue.mixin.js"
import availableWidgets from "djvue/components/widgets/index.js"
import ConfigDialogLayout from "djvue/components/core/ext//configDialogLayout.vue"


Vue.use(cookie)
Vue.use( portal, {baseURL:"../../../"})
Vue.use( http)
Vue.use( djvue );
Vue.use( eventhub );

Vue.prototype.$dialog.layout('default', ConfigDialogLayout)

let toTree = (object) =>
        
          _.keys(object).map( key => {
            return {
              name: (_.isObject(object[key])) ? key: `${key}: ${object[key]}`,
              children: (!_.isObject(object[key])) ? undefined : toTree(object[key]) 
            }
          })

  export default {
    
    mixins:[mixin],
    // store,

    components: {
      "dj-page": page
    },

    data () {

      return {

        tree: toTree(this.app),
       
        user,
        author,
       
        drawer: null,
        items: [
          { title: 'Home', icon: 'dashboard' },
          { title: 'About', icon: 'question_answer' }
        ],
        mini: false,
        right: null
        
      }
    },

    // computed:{
    //   tree: () => toTree(this.app)
    // },

    methods:{
      loadAppList() {
        this.$portal
          .get('api/app/get-list')
          .then(response => {
            console.log(response)
          })
      },

      fullReload(){
        this.$djvue.fullReload()
      },

      login(){
        this.$djvue.login()
      },

      switchProduction(){
        this.setNeedSave(false)
        this.$eventHub.emit("ud-event")
        if(this.app.mode == 'production'){
          this.setMode('development')
        } else {
          this.setMode('production')
        }
      },

      insertPage() {
        // this.pages.push({path:"/new", name:"NewPage", component:Bar})
        // this.$router.addRoutes(this.pages)
        
      }
    },

    
    created() {

      this.$router.addRoutes([
        {path:"/", component:page},
        {path:"/:page", component:page}
      ])

      // this.$router.push('1')
      // this.$eventHub.on("ud-event", (context) => {console.log("handle user defined event", context)})

    }
  }
</script>

