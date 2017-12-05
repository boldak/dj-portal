import angular from 'angular';
// import 'widgets/v2.nvd3-widget/nvd3-widget';
// import "widgets/v2.nvd3-bar/adapter";
// import "wizard-directives";
import 'ng-ace';

var m = angular.module("app.widgets.v2.data-selector-options",["app.dps","ng.ace"]);

m.factory("DataSelectorOptions",[
	"$http",
	"$dps",
	"$q", 
	"parentHolder",
	"pageWidgets",
	"dpsEditor",
	"i18n",

	
	function(
		$http, 
		$dps,
		$q, 
		parentHolder, 
		pageWidgets,
		dpsEditor,
		i18n ){

		return {
			id: "DataSelectorOptions",

			title : "Data Selector Options",
			
			description : "Setup data selector options",
	        
	    	html : "./widgets/v2.data-selector/data-selector-options.html",

	    	onStartWizard: function(wizard){
	    		this.wizard = wizard;
	    		this.scriptSettings = {
					    			options:{
								        mode:'dps', 
								        theme:'tomorrow'
								    }    
							    }

	    		this.conf = {
	    			decoration : wizard.conf.decoration || {},
	    			dataID : wizard.conf.dataID,
	    			queryID : (wizard.conf.script) ? undefined : wizard.conf.queryID,
	    			serieDataId : wizard.conf.serieDataId,
	    			optionsUrl : "./widgets/v2.nvd3-bar/options.json",
	    			dataUrl : $dps.getUrl()+"/api/data/process/",
	    			script: wizard.conf.script
	    		}	
	    		
	    		this.scriptSettings.data = this.conf.script;

	    		this.conf.decoration.direction = this.conf.decoration.direction || "Rows";

	    		this.queries = [];

	    		pageWidgets()
	    			.filter((item) => item.type =="v2.query-manager")
	    			.map((item) => item.queries)
	    			.forEach((item) => {this.queries = this.queries.concat(item)})

	    		if(this.conf.queryID && !this.conf.script){
	    			let thos = this;
	    			this.inputQuery = this.queries.filter((item) => item.$id == this.conf.queryID)[0].$title;
	    		}	

	    		this.loadData();
	    	},

	    	onFinishWizard:  function(wizard){
	    		
	    		wizard.conf.decoration = this.conf.decoration;
	    		wizard.conf.serieDataId  = this.conf.serieDataId; 
	    		wizard.conf.queryID  = this.conf.queryID;
	    		wizard.conf.dataID  = this.conf.dataID;
	    		wizard.conf.script = this.conf.script;
	    		

	    		this.selectorData = undefined;
	    		this.conf = {};
	    	},

	    	onCancelWizard: function(wizard){
	    		this.selectorData = undefined;
				this.conf = {};
	    	},

	    	selectInputData: function(){
				let thos = this;
				thos.wizard.context.postprocessedTable = undefined;
      			let iq = this.queries.filter((item) => item.$title == thos.inputQuery)[0];
				this.conf.dataID = iq.context.queryResultId;
				this.conf.queryID = iq.$id;
				this.loadData();
			},

			selectDirection: function(dir){
				this.metadataList = [];
				this.getMetadataList(this.wizard.context.postprocessedTable)
			},

			selectMeta : function(meta){
				if(!meta){
					this.selectorData = undefined;
					return
				}

				let list = (this.conf.decoration.direction == "Rows")
					? this.wizard.context.postprocessedTable.body
					: this.wizard.context.postprocessedTable.header;
				
				this.selectorData = list.map((item) => {
					return item.metadata[meta.index].label
				}) 
			},

			
			getMetadataList : function(table){
				let list = (this.conf.decoration.direction == "Rows")
					? table.body[0].metadata
					: table.header[0].metadata;
				this.metadataList = list.map((d,i) => {return {key:d.dimensionLabel, index:i}})	
			},

			editScript: function() {
                var thos = this;
                dpsEditor(thos.conf.script)
                    .then((script) => {
                        thos.conf.script = script;
                        thos.conf.dataID = undefined;
                        thos.scriptSettings.data = thos.conf.script;
                        thos.loadData();
                    })
            },
	    	
			loadData: function(){
				let thos = this;
				if(this.conf.script){
					$dps.post("/api/script",{
                                "script": this.conf.script,
                                "locale": i18n.locale()
                            })
                            .then((resp) => {
                            	// console.log("script result: ", resp)
                            	let d = resp.data;
                            	if (d.data.type == "error") {
	                                $error(d.data)
	                                return
	                            };
	                            thos.wizard.context.postprocessedTable = d.data;
                                thos.getMetadataList(thos.wizard.context.postprocessedTable)
			              		thos.apply()
                            })	        
				} else if (!this.wizard.context.postprocessedTable && this.conf.dataID){
					$dps
			          .get("/api/data/process/"+this.conf.dataID)
			          .success(function (resp) {
			              thos.wizard.context.postprocessedTable = resp.value;
			              /// extract object list
			              thos.getMetadataList(thos.wizard.context.postprocessedTable)
			              thos.apply()
			          })
				}
				
			},

			activate : function(wizard){
				// this.dataset = wizard.context.dataset;
				if (this.conf.dataID){
					this.loadData();
				}
			},

			apply: function(){
				// set $scope.data
			}	
	    }
}]);    	
