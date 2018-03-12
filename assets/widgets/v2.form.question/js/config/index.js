import 	angular 		from 	'angular';
import 	ManyToMany 		from 	"./many-to-many.js"
import 	OneToMany 		from 	"./one-to-many.js"
import 	Scale 			from 	"./scale.js"
import 	Dropdown		from 	"./dropdown.js"
import 	MScales 		from 	"./mscales.js"
import 	Pairs 			from 	"./pairs.js"
import 	Influences 		from 	"./influences.js"
import 	Rate			from 	"./rate.js"
import 	Range			from 	"./range.js"
import 	Text			from 	"./text.js"
import 	DateTime		from 	"./datetime.js"
import  RadioPairs		from	"./radio_pairs.js"

let factory = {
	
	check: 		(scope,previus) => new ManyToMany 	(scope, previus),
	radio: 		(scope,previus) => new OneToMany 	(scope, previus),
	scale: 		(scope,previus) => new Scale 		(scope, previus),
	dropdown: 	(scope,previus) => new Dropdown 	(scope, previus),
	scales: 	(scope,previus) => new MScales 		(scope, previus),
	pairs: 		(scope,previus) => new Pairs 		(scope, previus),
	influences: (scope,previus) => new Influences 	(scope, previus),
	rate: 		(scope,previus) => new Rate 		(scope, previus),
	range: 		(scope,previus) => new Range 		(scope, previus),
	text: 		(scope,previus) => new Text 		(scope, previus),
	datetime: 	(scope,previus) => new DateTime 	(scope, previus),
	radiopairs: (scope,previus) => new RadioPairs 	(scope, previus)

}



angular
.module("v2.question.factory",[])
.factory("questionFactory", [ () => factory])
.factory("questionTypes", [()=> {
	let list = _.toPairs(factory).map(item => {
		return [item[0], item[1]()]
	});
	console.log(list)
	let res = {};
	for (let item of list){
		// console.log(item)
		res[item[0]] = {
			type: item[1].state.type,
			widget: item[1].state.widget
		}
	}
	return res;
}])

