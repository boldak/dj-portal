// import {mapState, mapActions} from "../../../components/vuex/dist/vuex"

import store from "djvue/state/index.js"

export default {
	
	store,


	computed: {
		isProductionMode() {return this.app.mode == 'production'},
		isNeedSave() {return this.app.needSave},
		appName() {return this.app.name},
		
		
		...Vuex.mapState({app: state => state.Djvue.app})
	},	
	
	methods:{
		
		createEventContext(context){
			return {
				emitter:this,
				context
			}
		},

		getPage(name){
			let p = _.find(this.app.pages, item => item.id == name)
			p = p 
			|| _.find(this.app.pages, item => !item.id)
			|| {
				name:"error",
				title:"Page not found",
				layout:"layout-1"
			}
			return p;
		},
		...Vuex.mapActions(
			["setMode","setNeedSave","setCurrentPage","setHolderContent"]
		)
	},

	created(){
		// this.$eventHub.on("hi", (context) =>{console.log(context)} )
	}
}		
