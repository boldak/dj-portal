import snippets from "./snippets.js"

export default {

	name:"geo-chart-widget",

    icon: "mdi-map",

    getInitialConfig(snippet){
        snippet = snippet || "World"
        let res = snippets[snippet] || snippets["World"]
        return res
    }    

}