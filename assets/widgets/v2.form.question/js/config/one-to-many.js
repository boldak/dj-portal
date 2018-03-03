import angular from 'angular';
import Question from "./question.js"

let OneToMany = class extends Question {
	constructor(scope, previus) {
		super(scope, previus)
		this.state  = {
	      type:{value:"radio", title:"Оne of many"}, 
	      widget:{
	        css:"fa fa-stop-circle", 
	        view:this.prefix+"radio.view.html", 
	        options:this.prefix+"radio.options.html"
	      },
	      options:{
	        required: false,
	        addEnabled: false,
	        showUserInfo: true,
	        title:"", 
	        note:"",
	        nominals:{}
	      }
	    }  
		

	    this.configure(previus) 
	}

	configure(previus) {
    	
    	super.configure()
    	if(!previus) return;

          // prepare question config before setting $scope.qtype variable 
          // res - next config, $scope.config - previus config
          if(["dropdown","check"].indexOf(previus.state.type.value) < 0) return;
          
          this.state.options.nominals = {};
          
          for ( let item of this.scope.alternatives ){
            this.state.options.nominals[item.id] = { title: item.title, user: item.user }; 
          }
          
          if (previus.state.type.value == "check"){
            this.state.options.addEnabled = previus.state.options.addEnabled;
            this.state.options.showUserInfo = previus.state.options.showUserInfo;
          }
    }

    applyAnswer() {}

    prepare() {

          // prepare helped data structures
          this.scope.alternatives = _.toPairs(this.state.options.nominals)
                                  .map(item => {
                                    return {
                                      id:item[0],
                                      title:item[1].title,
                                      user:item[1].user
                                    }
                                  })
          
          this.scope.checkboxes = {};
          for(let item of this.scope.alternatives){
           this.scope.checkboxes[item.id] = false; 
          }   

          this.scope.answer = {
            valid: false,
            question: this.scope.widget.ID,
            type:"radio",
            value:[]
          }

        }

        setValue(value) {
        	this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0]))	
        }

       
        updateConfig() {
          //  transform helped data structures into config
          this.state.options.nominals = {};
          for( let item of this.scope.alternatives ){
            this.state.options.nominals[item.id] = {title: item.title, user:item.user}; 
          }
        }

}

module.exports = OneToMany;

