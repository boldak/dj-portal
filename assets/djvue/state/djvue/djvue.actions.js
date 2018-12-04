// import Vue from 'vue'

export default {
  
  setMode (context, mode) {
    context.commit('SET_MODE', mode)
  },

  setConfig(context, config){
    context.commit('SET_CONFIG', config)
  },

  setUser(context, user){
    context.commit('SET_USER', user)
  },

  setAuthor(context, author){
    context.commit('SET_AUTHOR', author)
  },

  setName(context, name){
    context.commit('SET_NAME', name)
  },

   setId(context, id){
    context.commit('SET_NAME', id)
  },

  setNeedSave(context, value){
    context.commit('SET_NEED_SAVE', value)
  },

  setCurrentPage(context, value){
    context.commit('SET_CURRENT_PAGE', value)
  },

  setHolderContent(context, data){
    return new Promise(resolve => {
      
      let page,holder;

      if(data.page){
        let pages = context.state.app.pages;
        page = _.find(pages, p => p.id == data.page.id)
        holder = page.holders[data.holder.name]
      } else {
        holder = context.state.app.skin.holders[data.holder.name]
      }

      holder.widgets = JSON.parse(JSON.stringify(data.widgets))  
      // context.commit('SET_PAGES', pages)
      resolve()
    })
     
  },

  setSkin(context, value){
    context.commit('SET_SKIN', value)
  }




}
