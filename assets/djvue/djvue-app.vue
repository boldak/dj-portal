<template>
  
  <div class="app">
    <v-app>
      <dj-skin></dj-skin>

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
import { portalPlugin, httpPlugin, djvuePlugin, cookiePlugin, eventhubPlugin, dpsPlugin } from "djvue/plugins/index.js"
import mixin from "djvue/mixins/core/djvue.mixin.js"
import availableWidgets from "djvue/components/widgets/index.js"
import ConfigDialogLayout from "djvue/components/core/ext//configDialogLayout.vue"


Vue.use(cookiePlugin)
Vue.use( portalPlugin, {baseURL:"../../../"})
Vue.use( dpsPlugin, {
  baseURL:dpsURL || "http://127.0.0.1:8098/",
  client: {user: user, app: appName}
});

Vue.use( httpPlugin)
Vue.use( djvuePlugin );
Vue.use( eventhubPlugin );

Vue.prototype.$dialog.layout('default', ConfigDialogLayout)

export default {
    
  mixins:[mixin],

  components: {
    "dj-skin": () => import("djvue/components/core/skin.vue")
  },

  data () {

    return {

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

