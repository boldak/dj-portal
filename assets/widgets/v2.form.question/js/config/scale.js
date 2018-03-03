import angular from 'angular';
import Question from "./question.js"

let Scale = class extends Question {
	constructor(scope, previus) {
		super(scope, previus)
		this.state  = {
      type:{value:"scale", title:"Scale"}, 
      widget:{
        css:"fa fa-ellipsis-h", 
        view:this.prefix+"scale.view.html", 
        options:this.prefix+"scale.options.html"
      },
      options:{
        required: false,
        title:"", 
        note:"",
        ordinals:{
          range:{ min:1, max:7 },
          "undefined":{title:"undefined", value:0},
          values : [
            {value:1, title:"Low"},
            {value:2},
            {value:3},
            {value:4, title:"Medium"},
            {value:5},
            {value:6},
            {value:7, title:"High"}
          ]
        },
        colors:{
          pallete:["#f7fcb9", "#addd8e", "#31a354"],
          opacity: 70,
          "undefined":" #aaa"  
        }
	    }
    }    
		

	    this.configure(previus) 
	}

	configure(previus) {
    	super.configure()
    }

    applyAnswer() {}

    prepare() {
          this.scope.answer = {
            valid: false,
            question: this.scope.widget.ID,
            type:"scale",
            value:[]
          }

    }

        setValue(value) {
        	this.scope.answer.value[0] = value;
          this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0]))	
        }

       
        updateConfig() {}

        generateValues() {
          let values = this.scope.config.state.options.ordinals.values;
          let range = this.scope.config.state.options.ordinals.range;
          let lowTitle = values[0].title;
          let highTitle = values[values.length-1].title;
          let newValues = []
          for(let i=range.min; i<=range.max; i++) newValues.push({value:i})
          newValues[0].title = lowTitle;
          newValues[newValues.length-1].title = highTitle;
          this.scope.config.state.options.ordinals.values = newValues;   
        }

}

module.exports = Scale;
