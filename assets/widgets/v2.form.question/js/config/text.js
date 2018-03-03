import angular from 'angular';
import Question from "./question.js"

let Text = class extends Question {
  constructor(scope, previus) {
    super(scope, previus)
    this.state = {
      type: { value: "text", title: "Text" },
      widget: {
        css: "fa fa-align-left",
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
    super.configure()
  }

  applyAnswer() {}

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
    this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0]))
  }

  validateAnswer() {
   this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0])) 
  }

  updateConfig() {}
}

module.exports = Text;
