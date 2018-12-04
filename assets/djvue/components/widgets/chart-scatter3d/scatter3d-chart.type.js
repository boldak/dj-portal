import snippets from "./snippets.js"

export default {

	name:"scatter3d-chart-widget",

    icon: "mdi-chart-scatterplot-hexbin",

    getInitialConfig(snippet){
        snippet = snippet || "Default"
        let res = snippets[snippet] || snippets["Default"]
        return res
    }    

}