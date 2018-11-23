import djvueMixin from "djvue/mixins/core/djvue.mixin.js"
import listenerMixin from "djvue/mixins/core/listener.mixin.js"
import initiableMixin from "djvue/mixins/core/initiable.mixin.js"

export default {

	mixins:[djvueMixin, listenerMixin, initiableMixin],
    
	beforeDestroy(){
		this.emit("page-stop", this, this.app.currentPage)  
	}

}