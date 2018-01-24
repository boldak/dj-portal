module.exports = 
{
	identity:"dj-forms",
	entities:{
        
        project:{
			attributes: {
			    owner: {
			     	type: "json"
			    },
			    collaborators: {
			     	type: "json"
			    },
			    config: {
			     	type: "json"
			    },
			    metadata: {
			     	type: "json"
			    }
			}
		},

        form:{

			attributes: {
			    project: {
			     	model: "Project"
			    },
			    owner: {
			     	type: "json"
			    },
			    collaborators: {
			     	type: "json"
			    },
			    config: {
			     	type: "json"
			    },
			    metadata: {
			     	type: "json"
			    }
			}

		},

		answer:{
			attributes: {
				form:{
					model:"form"
				},
				user:{
					type:"json"
				},
				data:{
					type:"json"
				} 
			}
		}
	}
}		
		

