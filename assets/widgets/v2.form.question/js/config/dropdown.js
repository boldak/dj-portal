import angular from 'angular';
import Question from "./question.js"

let Dropdown = class extends Question {
  constructor(scope, previus) {
    super(scope, previus)
    this.state = {
      type: { value: "dropdown", title: "Dropdown" },
      widget: {
        css: "fa fa-list",
        view: this.prefix + "dropdown.view.html",
        options: this.prefix + "dropdown.options.html"
      },
      options: {
        required: false,
        title: "",
        note: "",
        nominals: {}
      }
    }


    this.configure(previus)
  }

  configure(previus) {

    super.configure()
    if (!previus) return;

    // prepare question config before setting $scope.qtype variable 
    // res - next config, $scope.config - previus config
    if (["radio", "check"].indexOf(previus.state.type.value) < 0) return;

    this.state.options.nominals = {};
    for (let item of this.scope.alternatives) {
      this.state.options.nominals[item.id] = { title: item.title, user: item.user };
    }
  }

  applyAnswer() {}

  prepare() {

    // prepare helped data structures
    this.scope.alternatives = _.toPairs(this.state.options.nominals)
      .map(item => {
        return {
          id: item[0],
          title: item[1].title,
          user: item[1].user
        }
      })


    this.scope.answer = {
      valid: false,
      question: this.scope.widget.ID,
      type: "dropdown",
      value: []
    }

  }

  setValue(value) {
    this.scope.answer.value[0] = value.id;
    this.scope.answer.valid = (angular.isDefined(this.scope.answer.value[0]))
  }


  updateConfig() {
    //  transform helped data structures into config
    this.state.options.nominals = {};
    for (let item of this.scope.alternatives) {
      this.state.options.nominals[item.id] = { title: item.title, user: item.user };
    }
  }

}

module.exports = Dropdown;
