import angular from 'angular';


let FanButton = class {
	
	constructor (scope) {
		this.scope = scope;
		this.availableStates = {
		      
		      process:{
		        identity:"process",
		        color:"#5f8ab9",
		        class:"fa fa-spinner fa-pulse",
		        tooltip:`Saving changes...`
		      },

		      completed:{
		        identity:"completed",
		        color:"#8bc34a",
		        class:"fa fa-check",
		        tooltip:`Changes saved successfully!`
		      },
		      
		      disabled:{
		        identity:"disabled",
		        color:"#f44336",
		        class:"fa fa-times"
		      },

		      alert:{
		        identity:"alert",
		        color:"#f44336",
		        class:"fa fa-exclamation"
		      },
		      
		      warning:{
		        identity:"warning",
		        color:"#ff9800",
		        class:"fa fa-exclamation",
		        tooltip:""
		      },

		      list:{
		        identity:"list",
		        color:"#ff9800",
		        class:"fa fa-pencil",
		        tooltip:""
		      },
		      
		      success:{
		        identity:"success",
		        color:"#ff9800",
		        class:"fa fa-check",
		        tooltip:`The form is completed. Save changes.`
		      }  
		}
		this._state = undefined;
		this.timer = undefined;
		this._showFantip = false;    
	}

    showTooltip(time) {
      
      if(this.timer){
        clearTimeout(this.timer)
        this.timer = undefined;
      }
      
      this._showFantip = true;
      
      if(time){
        this.timer = setTimeout(() => {
         	this.scope.$evalAsync(this.hideTooltip())        
        },time)  
      }
      
    }

    hideTooltip() {
      
      this._showFantip = false;
      if(this.timer){
        clearTimeout(this.timer)
        this.timer = undefined;        
      }
      
    }

    state(value) {
      
      if(value){
          if(this.availableStates[value]){
            this._state = this._state || {}
            angular.copy(this.availableStates[value], this._state)
            this.showTooltip(2000)
            // angular.extend($scope.fanButton._state, params)  
          } else {
            this._state = undefined
            this.hideTooltip()
          }
      } else {
        return this._state;
      }

    }  
  
}

module.exports = FanButton;

