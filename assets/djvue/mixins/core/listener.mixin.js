export default {
	data:() => ({
		subscriptions:{}
	}),

	methods:{

		subscribe (event, emitterRule) {
			
			this.subscriptions[event] = this.subscriptions[event] || [];
			
			if(!emitterRule) return;
			
			let rule = _.find(this.subscriptions[event], item => item == emitterRule);
			if(!rule) this.subscriptions[event].push(emitterRule);
		},

		unsubscribe (event, emitterRule) {
			
			if(!this.subscriptions[event]) return
			
			if(!emitterRule){
				this.subscriptions[event] = undefined;
				return
			}	

			let index = _.findIndex(this.subscriptions[event], item => item == emitterRule)	
			this.subscriptions[event].splice(index,1)
		},

		acceptEvent (event, emitter) {

			
			if(!this.subscriptions[event]) return false
			
			if(this.subscriptions[event].length == 0 ) return true

			let rule = _.find(this.subscriptions[event], item => {
				if ( _.isString(item) ) return item == emitter
				if ( _.isFunction(item)) return item( emitter )
				return false	
			})

			return !!rule
		
		}

	}

}