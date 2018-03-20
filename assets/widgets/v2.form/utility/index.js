import angular from 'angular';
import FormMetadata from "./form-metadata.js";
import FanButton from "./form-fan-button.js";
import FormIO from "./form-io.js";
import UserUtils from "./form-users.js";
import AnswerUtils from "./form-answer.js";


angular
.module("formUtility", [])

.factory("formMetadata",[() => scope => new FormMetadata(scope)])
.factory("formFanButton",[() => scope => new FanButton(scope)])
.factory("formAnswerUtils",[() => scope => new AnswerUtils(scope)])
.factory("formIO",[() => (scope,transport) => new FormIO(scope, transport)])
.factory("formUserUtils",[() => (scope,userList) => new UserUtils(scope,userList)])


.factory("objectsIsEqual",[() => (oldValue, newValue) => {
	return _.matches(oldValue)(newValue) && _.matches(newValue)(oldValue)
}])

.factory("truncString", [() => (value, length) => {
    length = length || 20;
    return ( value.toString().length <= length )
      ? value.toString()
      : ( (value.toString().length - length) > 10 )
        ? value.toString().substring(0,length)+'...'
        : value.toString()
  }
])


.factory("testMessage",[() => (scope) => 

	`
==============================================================        

    Form.config:

==============================================================        

${scope.$filter("json")(scope.widget.form)}



==============================================================        

    Answer:

==============================================================        

${scope.$filter("json")(scope.answer)}



==============================================================        
`
])

.factory("queryString", () => (uri, param) => {
  console.log(uri)
  var queryString = {};
  uri.replace(
      new RegExp("([^?=&]+)(=([^&]*))?", "g"),
      function($0, $1, $2, $3) { queryString[$1] = $3; }
  );
  return (param) ? queryString[param]: queryString
  
})

.factory("defaultNotificationTemplate", [() =>

`
<p>
  Dear <%=user.name || 'Respondent'%>!
</p> 
<p>
  We invite you to take part in the survey 
  <a href="<%=metadata.app_url%>">
    <%=metadata.app_title%>
  <a>
</p>

`
 ])