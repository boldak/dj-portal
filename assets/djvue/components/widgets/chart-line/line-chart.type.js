import snippets from "./snippets.js"

export default {

	name:"line-chart-widget",

    icon: "mdi-chart-line",

    getInitialConfig(snippet){
        snippet = snippet || "Line"
        let res = snippets[snippet] || snippets["Line"]
        return res
    }    

}