import snippets from "./snippets.js"

export default {

	name:"radar-chart-widget",

    icon: "mdi-chart-arc",

    getInitialConfig(snippet){
        snippet = snippet || "Radar"
        let res = snippets[snippet] || snippets["Radar"]
        return res
    }    

}