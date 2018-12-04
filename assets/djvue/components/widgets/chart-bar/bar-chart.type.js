import snippets from "./snippets.js"

export default {

	name:"bar-chart-widget",

    icon: "mdi-chart-bar",

    getInitialConfig(snippet){
        snippet = snippet || "Horizontal Bars"
        let res = snippets[snippet] || snippets["Horizontal Bars"]
        return res
    }    

}