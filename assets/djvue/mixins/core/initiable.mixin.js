

export default {

	data:()=>({
		_waitList:[]
	}),

	methods:{
		
		onInitChild(child) {
			
			child = child || "";

			if( this._waitList.length == 0 ) return

			_.remove(this._waitList, (item) => this.isEquals(item,child))
			
			if( this._waitList.length == 0 ) {
				if(this.onChildsInitiated) this.onChildsInitiated();
			}
		},

		isEquals(item,child) {
			return item == child 
		}

	},

	created(){
		if(this.onBeforeInit) this.onBeforeInit();
	}


}