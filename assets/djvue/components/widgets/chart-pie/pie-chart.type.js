import snippets from "./snippets.js"

export default {

	name:"pie-chart-widget",

    icon: "mdi-chart-pie",

    getInitialConfig(snippet){
        snippet = snippet || "Pie"
        let res = snippets[snippet] || snippets["Pie"]
        return res
    }    

}