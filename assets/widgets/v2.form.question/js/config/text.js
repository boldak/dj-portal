import angular from 'angular';
import Question from "./question.js"

let Text = class extends Question {
  constructor(scope, previus) {
    super(scope, previus)
    this.state = {
      type: { value: "text", title: "Text" },
      widget: {
        css: "fa-align-left",
        view: this.prefix + "text.view.html",
        options: this.prefix + "text.options.html"
      },
      options: {
        required: false,
        title: "",
        note: "",
        rows:3,
        placeholder:"Your response..."
      }
    }


    this.configure(previus)
  }

  configure(previus) {
    super.configure();
    if(!previus) return;

    this.state.options.title = previus.state.options.title; 
    this.state.options.note = previus.state.options.note;
    this.state.options.required = previus.state.options.required;
    this.state.options.showResponsesStat = previus.state.options.showResponsesStat;
  }

  applyAnswer() {
    if(this.scope.answer && this.scope.answer.value[0]){
        this.setValue(new Date(this.scope.answer.value[0]));
    }    
  }

  prepare() {
    this.scope.answer = {
      valid: false,
      question: this.scope.widget.ID,
      type: "text",
      value: []
    }

  }

  setValue(value) {
    this.scope.answer.value[0] = value;
    this.validateAnswer()
  }

  validateAnswer() {
                  
    if(!this.state.options.required) {
      this.scope.answer.validationResult = { 
          valid: true,
          message: "",
          needSaveAnswer: true,
          needSaveForm: true 
        }
    } else {
      this.scope.answer.validationResult = {
        valid: ( true && this.scope.answer.value[0] ),
        message: ( true && this.scope.answer.value[0] ) 
                    ? ""
                    : this.scope.message("RANGE_VALIDATION", {
                        question : this.scope.truncate(this.scope.config.state.options.title, 40)
                      }),
        needSaveAnswer: true,
        needSaveForm: true 
      }  
    }
  
    this.scope.answer.valid =  this.scope.answer.validationResult.valid
  }

  
  updateConfig() {}
}

module.exports = Text;
