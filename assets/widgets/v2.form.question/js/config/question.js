import angular from 'angular';

let Question = class {
	
	constructor(scope, previus){
		
		this.prefix = "./widgets/v2.form.question/partitions/";
		this.scope = scope;

		this.state = {
			type : {
				value:"", 
				title:""
			},
		
			widget : {
		        css:"", 
		        view:"", 
		        options:""
	    	},
	    
	    	options : {
		        required: false,
		        title:"", 
		        note:""
		    }	
		}
		
		 

	}

    configure(previus) {
  
	  if(!previus) return;
	  
	  this.state.options.title = previus.state.options.title;
	  this.state.options.note = previus.state.options.note;
	  this.state.options.required = previus.state.options.required;

	  this.scope.markModified();  
    }


    prepare() {}

    setValue(value) {}

    updateConfig() {}
}

module.exports = Question;
