import angular from 'angular';
import Question from "./question.js"

let MScales = class extends Question {
	constructor(scope, previus) {
		super(scope, previus)
		this.state  = {
      type:{value:"scales", title:"Scales"}, 
      widget:{
        css:"fa fa-th-list", 
        view:this.prefix+"scales.view.html", 
        options:this.prefix+"scales.options.html"
      },
      options:{
        required: false,
        title:"", 
        note:"",
        entities:{},
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
        disables:[],
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
    	if(!previus) return;

          // prepare question config before setting $scope.qtype variable 
          // res - next config, $scope.config - previus config
          if(["dropdown","check", "radio", "scale"].indexOf(previus.state.type.value) < 0) return;
          
          if(["dropdown","check", "radio"].indexOf(previus.state.type.value) >= 0){
            this.state.options.entities = {};
          
            for ( let item of this.scope.alternatives ){
              this.state.options.entities[item.id] = { title: item.title, user: item.user }; 
            }  
          }
          
          if( previus.state.type.value == "scale" ){
            this.state.options.ordinals = previus.state.options.ordinals;
            this.state.options.colors = previus.state.options.colors;
          }
          
          
    }

    applyAnswer() {}

    prepare() {

          // prepare helped data structures
          this.scope.entities = _.toPairs(this.state.options.entities)
                                  .map(item => {
                                    return {
                                      id:item[0],
                                      title:item[1].title,
                                      user:item[1].user
                                    }
                                  })

          
          this.scope.answer = {
            valid: false,
            question: this.scope.widget.ID,
            type:"scales",
            value: [] 
          }

        }

        setValue(entity, value) {
          
          let index = this.scope.answer.value
                      .map(item => item.entity)
                      .indexOf(entity)
          
          if(index < 0){
            this.scope.answer.value.push({entity:entity, value:value})
          } else {
            this.scope.answer.value[index].value = value;
          }
          
          // this.scope.answer.value.forEach( ( item, index) => {
             
          //   if( this.scope.entities.map(v => v.id).indexOf(item.entity) <0 ){
          //     this.scope.answer.value.splice(index,1) 
          //   }            
          // })

          this.scope.answer.valid = this.scope.entities.length <= this.scope.answer.value.length;
        }

       
        updateConfig() {
          //  transform helped data structures into config
          this.state.options.entities = {};
          for( let item of this.scope.entities ){
            this.state.options.entities[item.id] = {title: item.title, user:item.user}; 
          }
        }

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

        getValue(entity) {
          return this.scope.answer.value[this.scope.answer.value.map(item => item.entity).indexOf(entity)].value
        }
  
}

module.exports = MScales;

