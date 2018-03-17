import angular from 'angular';
import Question from "./question.js"

let ManyToMany = class extends Question {
	constructor(scope, previus) {
		super(scope, previus)
		this.state  ={
			type : {value:"check", title:"Many of many"}, 
      	
	      	widget : {
		        css:"fa fa-check-square", 
		        view:this.prefix+"check.view.html", 
		        options:this.prefix+"check.options.html"
		     },

	      	options : {
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
          if(["dropdown","radio"].indexOf(previus.state.type.value) < 0) return;
          
          this.state.options.nominals = {};
          
          for ( let item of this.scope.alternatives ){
            this.state.options.nominals[item.id] = { title: item.title, user: item.user }; 
          }
          
          if (previus.state.type.value == "radio"){
            this.state.options.addEnabled = previus.state.options.addEnabled;
            this.state.options.showUserInfo = previus.state.options.showUserInfo;
          }
    }

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
            type: "check",
            value: []
          }
        }

        setValue(value) {
          this.scope.answer.value = _.toPairs(this.scope.checkboxes)
                                  .filter(item => item[1])
                                  .map(item => item[0]);
          
          this.scope.answer.valid = this.scope.answer.value.length > 0;
        }

        applyAnswer() {
          this.scope.checkboxes = {};
          for(let item of this.scope.alternatives){
           this.scope.checkboxes[item.id] = this.scope.answer.value.indexOf(item.id) >= 0; 
          }
        }

        updateConfig() {
          //  transform helped data structures into config
          this.state.options.nominals = {};
          for( let item of this.scope.alternatives ){
            this.state.options.nominals[item.id] = {title: item.title, user:item.user}; 
          }
        }


          getResponseStat(responses) {
            let RStat = {};
            this.scope.alternatives.forEach(e => {
              RStat[e.id] = responses.filter(r => {
                  if ( r.entity_id == e.id ) {
                      return true
                    } else {
                      return false
                    }
                }).length;
              
            })
            // console.log("RSTAT!!!!!!!!!!!!", RStat)
            let pairs = _.toPairs(RStat)
            console.log(pairs)
            let values = pairs.map(item => item[1])
            let sum = values.reduce((item,sum) => {return sum+item})
            if(sum==0){
                  values = values.map(item => 0)
                }else{
                  values = values.map(item => item/sum )
                }
            // console.log(values)    
            pairs.forEach((p,index) => {
              RStat[p[0]] = values[index]
            })    
            // console.log(RStat)
            this.scope.rstat = RStat;
          }

          isResponse(value){
            return this.scope.answer.value.indexOf(value) >= 0
          }
}


module.exports = ManyToMany;