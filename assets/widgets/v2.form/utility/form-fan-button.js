import angular from 'angular';

let Toast = class {
	
	constructor (scope) {
		this.scope = scope;
		this._timer = undefined;
		this._isShowed = false;
		this._toast = null;
		this._queue = [];
		this.usePreviusToast = false;  
		this.state = null;  
	}

	pushMessage(message) {
		if( message ) this._queue.push( message )
	}

	popMessage() {
		
		this.message = this._queue.splice(0,1)[0];
    	this.message.delay = this.message.delay || 3000;
    	this.state = this.message.state || "none";
    	
    	if(!this.usePreviusToast && !this._isShowed && this._toast){
	    	this._toast = undefined;
	    }
		
		if (!this.usePreviusToast && !this._toast) {
	    	this._isShowed = true;
	    	this._toast = this.scope.showToast();
	    	this._toast.then(() => {
    			this._isShowed = false;
		    	this.message = undefined;
	    	})
	    }
	    	   
		this.scope.timeout( () => {	
    		(new this.scope.APIUser()).invokeAll("toast-message", this.message);
    	});	
  
	    	
    	if( this._timer ) {
    		this.scope.timeout.cancel( this._timer );
	        this._timer = undefined;
	    }
	    
	    this._timer = this.scope.timeout(() => {
	    	this.usePreviusToast = this._queue.length > 0;
         	if( !this.usePreviusToast ) {
         		this.scope.hideToast()
         	} else {
         		this._isShowed = false;
		    	this.message = undefined;
		    	(new this.scope.APIUser()).invokeAll("toast-message", {});
		    	this.show()
         	}
	    },this.message.delay)
	    
	    
		
	} 

    show(options) {
    	
    	if ( this.scope.globalConfig.designMode ) return;
    	
    	if ( options ) this.pushMessage( options );
    	
    	if ( this.message && this.message.notInterrupted ) return;
    	if ( this._queue.length == 0 )  return;

    	this.popMessage();
    }	
	   	
}

module.exports = Toast;

